"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Physics, RigidBody, CylinderCollider, ConvexHullCollider, BallCollider, CuboidCollider, useRapier, useBeforePhysicsStep, type RapierRigidBody } from "@react-three/rapier";
import { IcosahedronGeometry, MathUtils, Mesh, MeshStandardMaterial, Quaternion, Vector3, type Object3D } from "three";
import { BIN_PHYSICS as cfg, PAPER_SPECS, hollowBinWalls, kickBin, releasePaper, resetBody } from "@/lib/trash-physics";
import type { SecondaryState } from "./useSecondaryInteractions";
import type { SecondaryId } from "@/lib/secondary-config";

export default function TrashBinPhysics({ source, anchors, state }: { source: Mesh; anchors: Record<SecondaryId, Object3D>; state: SecondaryState }) {
  const [running, setRunning] = useState(false);
  return <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} updateLoop="independent" interpolate paused={!state.enabled || !running} colliders={false}>
    <BinBodies source={source} anchors={anchors} state={state} setRunning={setRunning} />
  </Physics>;
}
type Drag = { id: number; startX: number; startY: number; moved: boolean; target: Vector3; rotation: Quaternion; dx: number; dz: number };
function BinBodies({ source, anchors, state, setRunning }: { source: Mesh; anchors: Record<SecondaryId, Object3D>; state: SecondaryState; setRunning: (running: boolean) => void }) {
  const { rapier, world } = useRapier();
  const { gl, invalidate, get } = useThree();
  const bin = useRef<RapierRigidBody>(null);
  const papers = useRef<(RapierRigidBody | null)[]>([]);
  const drag = useRef<Drag | null>(null);
  const resetFrames = useRef(0);
  const tipped = useRef(false), released = useRef(false), quietSteps = useRef(0), totalSteps = useRef(0);
  const stateRef = useRef(state); stateRef.current = state;
  const start = useMemo(() => source.getWorldPosition(new Vector3()), [source]);
  const visual = useMemo(() => { const mesh = source.clone(false); mesh.position.set(0, 0, 0); mesh.quaternion.identity(); mesh.scale.set(1, 1, 1); mesh.visible = true; mesh.matrixAutoUpdate = true; mesh.updateMatrix(); return mesh; }, [source]);
  const walls = useMemo(hollowBinWalls, []);
  const paperVisuals = useMemo(() => PAPER_SPECS.map(spec => {
    const geometry = new IcosahedronGeometry(spec.radius, 1);
    const attribute = geometry.getAttribute("position");
    for (let i = 0; i < attribute.count; i++) {
      const p = new Vector3().fromBufferAttribute(attribute, i);
      p.multiplyScalar(.87 + .12 * Math.sin(p.x * 173 + p.y * 211 + p.z * 97 + spec.seed));
      attribute.setXYZ(i, p.x, p.y, p.z);
    }
    geometry.computeVertexNormals();
    return geometry;
  }), []);
  const paperMaterial = useMemo(() => new MeshStandardMaterial({ color: "#eeeee7", roughness: .96, flatShading: true }), []);
  const paperPosition = (index: number) => ({ x: start.x + PAPER_SPECS[index].x, y: start.y + .026 + PAPER_SPECS[index].radius, z: start.z + PAPER_SPECS[index].z });
  const reset = () => {
    if (!bin.current) return;
    bin.current.setBodyType(rapier.RigidBodyType.Dynamic, false);
    resetBody(bin.current, start);
    papers.current.forEach((body, index) => { if (body) resetBody(body, paperPosition(index)); });
    // Paused worlds need fresh mass properties before the first impulse.
    [bin.current, ...papers.current].forEach(body => body?.recomputeMassPropertiesFromColliders());
    world.propagateModifiedBodyPositionsToColliders();
    tipped.current = false; released.current = false; quietSteps.current = 0; totalSteps.current = 0;
    resetFrames.current = 2; setRunning(true); stateRef.current.setBinPhase("upright"); invalidate();
  };
  useLayoutEffect(() => {
    const previous = anchors.bin;
    source.visible = false; anchors.bin = visual;
    return () => { source.visible = true; anchors.bin = previous; };
  }, [source, visual, anchors]);
  useEffect(() => { reset(); return () => { paperVisuals.forEach(geometry => geometry.dispose()); paperMaterial.dispose(); }; }, []);
  const begin = (dx = 0, dz = 1) => {
    if (!bin.current || tipped.current || !stateRef.current.enabled) return;
    tipped.current = true; setRunning(true); stateRef.current.setBinPhase("moving");
    papers.current.forEach(body => body?.wakeUp());
    stateRef.current.closeBag(); bin.current.recomputeMassPropertiesFromColliders(); kickBin(bin.current, dx, dz); invalidate();
  };
  useEffect(() => {
    if (state.binSignal.type === "reset") reset(); else begin();
  }, [state.binSignal.revision]);
  useEffect(() => {
    const element = gl.domElement;
    const oldTouchAction = element.style.touchAction;
    const move = (event: PointerEvent) => {
      const current = drag.current;
      if (!current || current.id !== event.pointerId || !bin.current) return;
      const pixelDistance = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);
      if (!current.moved && pixelDistance < 5) return;
      event.preventDefault();
      if (!current.moved) {
        current.moved = true; tipped.current = true;
        stateRef.current.closeBag(); stateRef.current.setDragging(true); stateRef.current.setBinPhase("moving");
        setRunning(true); bin.current.setBodyType(rapier.RigidBodyType.KinematicPositionBased, true);
        papers.current.forEach(body => body?.wakeUp());
      }
      const camera = get().camera;
      const worldPerPixel = camera.type === "OrthographicCamera" ? ((camera as import("three").OrthographicCamera).right - (camera as import("three").OrthographicCamera).left) / (element.clientWidth * camera.zoom) : .005;
      current.dx = MathUtils.clamp((event.clientX - current.startX) * worldPerPixel, -.12, .28);
      current.dz = MathUtils.clamp((event.clientY - current.startY) * worldPerPixel * .7, -.08, .34);
      const distance = Math.hypot(current.dx, current.dz);
      const angle = Math.min(.95, distance * 3.6);
      const axis = new Vector3(current.dz, 0, -current.dx).normalize();
      current.rotation.setFromAxisAngle(axis, angle);
      current.target.set(start.x + current.dx, cfg.floorY + cfg.radius * Math.sin(angle) + .008, start.z + current.dz);
      invalidate();
    };
    const end = (event?: PointerEvent) => {
      const current = drag.current;
      if (!current || (event && current.id !== event.pointerId)) return;
      drag.current = null;
      if (element.hasPointerCapture(current.id)) element.releasePointerCapture(current.id);
      element.style.touchAction = oldTouchAction;
      stateRef.current.setDragging(false);
      if (!current.moved) { begin(); return; }
      if (bin.current) {
        bin.current.setBodyType(rapier.RigidBodyType.Dynamic, true);
        const length = Math.hypot(current.dx, current.dz) || 1;
        bin.current.setLinvel({ x: current.dx * .6, y: 0, z: current.dz * .6 }, true);
        const speed = MathUtils.lerp(1.5, 8, Math.min(1, length / .3));
        bin.current.setAngvel({ x: current.dz / length * speed, y: 0, z: -current.dx / length * speed }, true);
      }
      invalidate();
    };
    element.addEventListener("pointermove", move, { passive: false });
    const blur = () => end();
    element.addEventListener("pointerup", end); element.addEventListener("pointercancel", end); window.addEventListener("blur", blur);
    return () => {
      element.removeEventListener("pointermove", move); element.removeEventListener("pointerup", end); element.removeEventListener("pointercancel", end); window.removeEventListener("blur", blur);
      const current = drag.current;
      if (current && element.hasPointerCapture(current.id)) element.releasePointerCapture(current.id);
      element.style.touchAction = oldTouchAction;
    };
  }, [gl, get, start, invalidate]);
  useBeforePhysicsStep(() => {
    const body = bin.current;
    if (!body) return;
    if (!tipped.current) {
      // Let Rapier synchronize interpolated Three transforms before pausing.
      if (resetFrames.current > 0 && --resetFrames.current === 0) setRunning(false);
      return;
    }
    totalSteps.current++;
    const current = drag.current;
    if (current?.moved) {
      const next = new Vector3().copy(body.translation()).lerp(current.target, .22);
      const rotation = new Quaternion().copy(body.rotation()).slerp(current.rotation, .22);
      body.setNextKinematicTranslation(next); body.setNextKinematicRotation(rotation);
      return;
    }
    const opening = new Vector3(0, 1, 0).applyQuaternion(body.rotation());
    if (!released.current && opening.y < .3) {
      papers.current.forEach((paper, index) => { if (paper) releasePaper(paper, index, opening); });
      released.current = true;
    }
    const all = [body, ...papers.current.filter((paper): paper is RapierRigidBody => Boolean(paper))];
    const still = all.every(item => {
      const linear = item.linvel(), angular = item.angvel();
      return Math.hypot(linear.x, linear.y, linear.z) < .045 && Math.hypot(angular.x, angular.y, angular.z) < .14;
    });
    quietSteps.current = still && totalSteps.current > 90 ? quietSteps.current + 1 : 0;
    if (quietSteps.current >= 60) {
      all.forEach(item => item.sleep());
      setRunning(false); stateRef.current.setBinPhase("settled");
    }
  });
  // Diagnostics use actual physical transforms and expose no extra visible UI.
  useFrame(() => {
    if (!bin.current) return;
    const stage = gl.domElement.closest(".workspace-stage") as HTMLElement | null;
    if (!stage) return;
    stage.dataset.physicsSteps = String(totalSteps.current);
    stage.dataset.paperOutside = String(papers.current.filter(paper => {
      if (!paper) return false;
      const local = new Vector3().copy(paper.translation()).sub(bin.current!.translation()).applyQuaternion(new Quaternion().copy(bin.current!.rotation()).invert());
      return local.y > cfg.height || local.y < -.02 || Math.hypot(local.x, local.z) > .19;
    }).length);
    stage.dataset.paperMinY = String(Math.min(...papers.current.filter(Boolean).map(paper => paper!.translation().y)));
  });
  const down = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!stateRef.current.enabled || tipped.current || event.button !== 0) return;
    event.nativeEvent.preventDefault();
    gl.domElement.setPointerCapture(event.pointerId);
    gl.domElement.style.touchAction = "none";
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false, target: start.clone(), rotation: new Quaternion(), dx: 0, dz: 0 };
  };
  const stop = (event: ThreeEvent<PointerEvent | MouseEvent>) => event.stopPropagation();
  return <>
    <RigidBody ref={bin} position={[start.x, start.y, start.z]} colliders={false} canSleep ccd linearDamping={cfg.linearDamping} angularDamping={cfg.angularDamping} additionalSolverIterations={4} friction={.8} restitution={.05}>
      <CylinderCollider args={[.013, .128]} position={[0, .013, 0]} mass={cfg.massBottom} />
      {walls.map((vertices, index) => <ConvexHullCollider key={index} args={[vertices]} mass={cfg.massWall} />)}
      <primitive object={visual} dispose={null} onPointerDown={down} onPointerMove={(event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); stateRef.current.hover("bin"); }} onPointerOut={() => stateRef.current.hover(null)} onClick={stop} />
    </RigidBody>
    {PAPER_SPECS.map((spec, index) => {
      const position = paperPosition(index);
      return <RigidBody key={index} ref={body => { papers.current[index] = body; }} position={[position.x, position.y, position.z]} colliders={false} canSleep ccd linearDamping={1.1} angularDamping={2.3} friction={.85} restitution={.08} additionalSolverIterations={4}>
        <BallCollider args={[spec.radius]} mass={cfg.paperMass} />
        <mesh geometry={paperVisuals[index]} material={paperMaterial} rotation={[spec.seed, spec.seed * .6, 0]} castShadow receiveShadow dispose={null} onPointerMove={stop} onClick={stop} />
      </RigidBody>;
    })}
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[10, .05, 10]} position={[0, cfg.floorY - .05, 0]} friction={.9} restitution={.05} />
      <CuboidCollider args={[.01, .6, 1]} position={[cfg.bounds.left, .3, .85]} />
      <CuboidCollider args={[.01, .6, 1]} position={[cfg.bounds.right, .3, .85]} />
      <CuboidCollider args={[.43, .6, .01]} position={[1.8, .3, cfg.bounds.back]} />
      <CuboidCollider args={[.43, .6, .01]} position={[1.8, .3, cfg.bounds.front]} />
    </RigidBody>
  </>;
}
