"use client";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Color, MathUtils, Mesh, MeshStandardMaterial, Object3D, OrthographicCamera, ShadowMaterial, Vector3 } from "three";
import { INTERACTIONS, MODEL_URL, type Interaction, type InteractionId } from "@/lib/workspace-config";
import CameraController from "./CameraController";
import ChairController from "./ChairController";
export type OverlayElements = Partial<Record<InteractionId, HTMLDivElement | null>>;
const WHITE = new Color(1, 1, 1);
function interactionFor(object: Object3D): Interaction | undefined {
  for (let current: Object3D | null = object; current; current = current.parent) {
    const match = INTERACTIONS.find(interaction => interaction.assembly === current.name);
    if (match) return match;
  }
}
export default function WorkspaceModel({ reducedMotion, onReady, active, hovered, onHoverChange, onNavigate, overlays }: {
  reducedMotion: boolean; onReady: () => void; active: InteractionId | null; hovered: InteractionId | null;
  onHoverChange: (value: InteractionId | null) => void; onNavigate: (href: string) => void;
  overlays: RefObject<OverlayElements>;
}) {
  const asset = useGLTF(MODEL_URL);
  const { gl, invalidate } = useThree();
  const projected = useRef(new Vector3());
  const prepared = useMemo(() => {
    // Preserve hierarchy/geometry; own material clones so hover never changes the loader cache.
    const model = asset.scene.clone(true);
    const ownedMaterials: MeshStandardMaterial[] = [];
    const highlights: { material: MeshStandardMaterial; id: InteractionId; color: Color; emissive: Color; amount: number; strength: number }[] = [];
    model.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.castShadow = object.name !== "Floor";
      object.receiveShadow = true;
      const originals = Array.isArray(object.material) ? object.material : [object.material];
      const materials = originals.map(original => {
        const material = original.clone();
        if (material instanceof MeshStandardMaterial) {
          // Web-only studio fill; retain the floor's PBR base color and roughness.
          if (object.name === "Floor") material.emissive.setRGB(3.5, 3.5, 3.5);
          ownedMaterials.push(material);
          const interaction = interactionFor(object);
          if (interaction) highlights.push({ material, id: interaction.id, color: material.color.clone(), emissive: material.emissive.clone(), amount: 0, strength: object.name === interaction.surface ? 0.075 : 0.012 });
        }
        return material;
      });
      object.material = Array.isArray(object.material) ? materials : materials[0];
    });
    model.updateMatrixWorld(true);
    const chair = model.getObjectByName("Chair_Root");
    const camera = model.getObjectByName("WorkspaceCamera");
    const floor = model.getObjectByName("Floor");
    if (!chair || chair.userData.rotation_axis_gltf !== "Y") throw new Error("The chair hierarchy or Y-up pivot is missing.");
    if (!(camera instanceof OrthographicCamera)) throw new Error("The exported orthographic camera is missing.");
    if (!(floor instanceof Mesh)) throw new Error("The existing studio floor is missing.");
    const positions = INTERACTIONS.map(interaction => {
      const surface = model.getObjectByName(interaction.surface);
      if (!surface) throw new Error(`Missing interaction surface: ${interaction.surface}`);
      return surface.getWorldPosition(new Vector3());
    });
    // Reuse the original floor geometry for a transparent, inexpensive shadow layer.
    const shadowMaterial = new ShadowMaterial({ color: "#55554f", opacity: 0.24, depthWrite: false });
    const shadowFloor = new Mesh(floor.geometry, shadowMaterial);
    floor.matrixWorld.decompose(shadowFloor.position, shadowFloor.quaternion, shadowFloor.scale);
    shadowFloor.position.y += 0.001;
    shadowFloor.receiveShadow = true;
    shadowFloor.name = "StudioShadowCatcher";
    shadowFloor.renderOrder = 1;
    return { model, chair, camera, highlights, ownedMaterials, positions, shadowFloor, shadowMaterial };
  }, [asset.scene]);
  useEffect(() => { onReady(); invalidate(); }, [onReady, invalidate]);
  useEffect(() => () => { prepared.ownedMaterials.forEach(material => material.dispose()); prepared.shadowMaterial.dispose(); }, [prepared]);
  useEffect(() => {
    gl.domElement.style.cursor = hovered ? "pointer" : "";
    return () => { gl.domElement.style.cursor = ""; };
  }, [hovered, gl]);
  useEffect(() => { invalidate(); }, [active, invalidate]);
  useFrame(({ camera, size }, delta) => {
    let animating = false;
    for (const item of prepared.highlights) {
      const target = active === item.id ? 1 : 0;
      if (Math.abs(item.amount - target) <= 0.0001) continue;
      const next = reducedMotion ? target : MathUtils.damp(item.amount, target, 12, Math.min(delta, 0.06));
      item.amount = Math.abs(next - target) < 0.0001 ? target : next;
      item.material.color.copy(item.color).lerp(WHITE, item.amount * item.strength * 0.55);
      item.material.emissive.copy(item.emissive).addScalar(item.amount * item.strength);
      animating = true;
    }
    // Position normal DOM controls without creating extra React roots inside the canvas.
    camera.updateMatrixWorld();
    for (let index = 0; index < INTERACTIONS.length; index++) {
      const element = overlays.current[INTERACTIONS[index].id];
      if (!element) continue;
      projected.current.copy(prepared.positions[index]).project(camera);
      const x = (projected.current.x * 0.5 + 0.5) * size.width;
      const y = (-projected.current.y * 0.5 + 0.5) * size.height;
      element.style.transform = `translate3d(${x}px,${y}px,0)`;
      element.style.opacity = projected.current.z >= -1 && projected.current.z <= 1 ? "1" : "0";
    }
    if (animating) invalidate();
  });
  const pointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHoverChange(interactionFor(event.object)?.id ?? null);
  };
  const click = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.button !== 0) return;
    const interaction = interactionFor(event.object);
    if (interaction) onNavigate(interaction.href);
  };
  return <>
    <CameraController referenceCamera={prepared.camera} reducedMotion={reducedMotion} />
    <ChairController chair={prepared.chair} reducedMotion={reducedMotion} />
    <primitive object={prepared.model} dispose={null} onPointerMove={pointerMove} onPointerOut={() => onHoverChange(null)} onClick={click} />
    <primitive object={prepared.shadowFloor} dispose={null} />
  </>;
}
