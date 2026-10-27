"use client";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { Mesh, MeshStandardMaterial, Object3D, OrthographicCamera, ShadowMaterial, Vector3, type Material } from "three";
import { INTERACTIONS, MODEL_URL, type Interaction, type InteractionId, type SurfaceRect } from "@/lib/workspace-config";
import CameraController, { type FocusCommand } from "./CameraController";
import ChairController from "./ChairController";
import SurfaceArtwork from "./SurfaceArtwork";
export type OverlayElements = Partial<Record<InteractionId, HTMLDivElement | null>>;
export type SurfaceRects = Partial<Record<InteractionId, SurfaceRect>>;
function interactionFor(object: Object3D): Interaction | undefined {
  for (let current: Object3D | null = object; current; current = current.parent) {
    const match = INTERACTIONS.find(interaction => interaction.assembly === current.name);
    if (match) return match;
  }
}
export default function WorkspaceModel({ reducedMotion, onReady, active, hovered, command, onSettled, onHoverChange, onActivate, onReset, overlays, rects }: {
  reducedMotion: boolean; onReady: () => void; active: InteractionId | null; hovered: InteractionId | null;
  command: FocusCommand; onSettled: () => void;
  onHoverChange: (value: InteractionId | null) => void; onActivate: (id: InteractionId) => void; onReset: () => void;
  overlays: RefObject<OverlayElements>; rects: RefObject<SurfaceRects>;
}) {
  const asset = useGLTF(MODEL_URL);
  // Suspend the complete scene until every visible image is available.
  const textures = useTexture(INTERACTIONS.map(item => item.image));
  const { gl, invalidate } = useThree();
  const frames = useRef(0);
  const prepared = useMemo(() => {
    const model = asset.scene.clone(true);
    const ownedMaterials: Material[] = [];
    model.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.castShadow = object.name !== "Floor";
      object.receiveShadow = true;
      const originals = Array.isArray(object.material) ? object.material : [object.material];
      const materials = originals.map(original => {
        const material = original.clone(); ownedMaterials.push(material);
        if (material instanceof MeshStandardMaterial) {
          if (object.name === "Floor") material.emissive.setRGB(3.5, 3.5, 3.5);
          if (object.name === "MonitorScreen" || object.name === "PhoneScreen") {
            material.color.set("#070a0c"); material.emissive.set(0); material.roughness = .18; material.metalness = .2;
          }
        }
        return material;
      });
      object.material = Array.isArray(object.material) ? materials : materials[0];
    });
    const graphic = model.getObjectByName("ArtworkGraphic");
    if (graphic) graphic.visible = false;
    model.updateMatrixWorld(true);
    const chair = model.getObjectByName("Chair_Root"), camera = model.getObjectByName("WorkspaceCamera"), floor = model.getObjectByName("Floor");
    if (!chair || chair.userData.rotation_axis_gltf !== "Y") throw new Error("The chair hierarchy or Y-up pivot is missing.");
    if (!(camera instanceof OrthographicCamera) || !(floor instanceof Mesh)) throw new Error("Workspace camera or floor missing.");
    const surfaces = {} as Record<InteractionId, Mesh>;
    const corners = {} as Record<InteractionId, Vector3[]>;
    for (const item of INTERACTIONS) {
      const mesh = model.getObjectByName(item.surface);
      if (!(mesh instanceof Mesh)) throw new Error("Missing surface: " + item.surface);
      surfaces[item.id] = mesh;
      mesh.geometry.computeBoundingBox();
      const b = mesh.geometry.boundingBox!;
      corners[item.id] = [new Vector3(b.min.x,b.min.y,.0005), new Vector3(b.max.x,b.max.y,.0005), new Vector3(b.min.x,b.max.y,.0005), new Vector3(b.max.x,b.min.y,.0005)].map(p => mesh.localToWorld(p));
    }
    const shadowMaterial = new ShadowMaterial({ color: "#55554f", opacity: .24, depthWrite: false });
    const shadowFloor = new Mesh(floor.geometry, shadowMaterial);
    floor.matrixWorld.decompose(shadowFloor.position, shadowFloor.quaternion, shadowFloor.scale);
    shadowFloor.position.y += .001; shadowFloor.receiveShadow = true; shadowFloor.renderOrder = 1;
    return { model, chair, camera, ownedMaterials, surfaces, corners, shadowFloor, shadowMaterial };
  }, [asset.scene]);
  useEffect(() => () => { prepared.ownedMaterials.forEach(material => material.dispose()); prepared.shadowMaterial.dispose(); }, [prepared]);
  useEffect(() => {
    gl.domElement.style.cursor = hovered ? "pointer" : "";
    return () => { gl.domElement.style.cursor = ""; };
  }, [hovered, gl]);
  useFrame(({ camera, size }) => {
    if (frames.current < 3) { frames.current++; invalidate(); if (frames.current === 3) onReady(); }
    camera.updateMatrixWorld();
    const canvasRect = gl.domElement.getBoundingClientRect();
    for (const item of INTERACTIONS) {
      const points = prepared.corners[item.id].map(p => p.clone().project(camera));
      const xs = points.map(p => (p.x * .5 + .5) * size.width), ys = points.map(p => (-p.y * .5 + .5) * size.height);
      const left = Math.min(...xs), top = Math.min(...ys), width = Math.max(...xs) - left, height = Math.max(...ys) - top;
      rects.current[item.id] = { left: canvasRect.left + left, top: canvasRect.top + top, width, height };
      const element = overlays.current[item.id];
      if (element) {
        element.style.transform = `translate3d(${left + width / 2}px,${top + height / 2}px,0)`;
        element.style.opacity = "1";
      }
    }
  });
  const move = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (event.pointerType !== "touch") onHoverChange(interactionFor(event.object)?.id ?? null);
  };
  const click = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.button !== 0) return;
    const interaction = interactionFor(event.object);
    if (interaction) onActivate(interaction.id); else onReset();
  };
  return <>
    <CameraController referenceCamera={prepared.camera} surfaces={prepared.surfaces} command={command} reducedMotion={reducedMotion} onSettled={onSettled} />
    <ChairController chair={prepared.chair} reducedMotion={reducedMotion} />
    <primitive object={prepared.model} dispose={null} onPointerMove={move} onPointerOut={() => onHoverChange(null)} onClick={click} />
    <primitive object={prepared.shadowFloor} dispose={null} />
    {INTERACTIONS.map((item, index) => <SurfaceArtwork key={item.id} surface={prepared.surfaces[item.id]} texture={textures[index]} kind={item.id === "about" ? "portrait" : "screen"} active={active === item.id || command.id === item.id} reducedMotion={reducedMotion} />)}
  </>;
}
