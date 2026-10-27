"use client";
import { useEffect, useMemo, useRef } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { Float32BufferAttribute, MathUtils, Mesh, MeshBasicMaterial, SRGBColorSpace, type Texture } from "three";

// A replaceable image layer on the existing screen/artwork geometry, never the frame border.
export default function SurfaceArtwork({ surface, texture, kind, active, reducedMotion }: {
  surface: Mesh; texture: Texture; kind: "portrait" | "screen"; active: boolean; reducedMotion: boolean;
}) {
  const cached = texture;
  const { invalidate } = useThree();
  const amount = useRef(0);
  const prepared = useMemo(() => {
    const texture = cached.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = true;
    texture.needsUpdate = true;
    const geometry = surface.geometry.clone();
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const width = box.max.x - box.min.x, height = box.max.y - box.min.y;
    const positions = geometry.getAttribute("position");
    const uv = new Float32Array(positions.count * 2);
    for (let i = 0; i < positions.count; i++) {
      uv[i * 2] = (positions.getX(i) - box.min.x) / width;
      uv[i * 2 + 1] = (positions.getY(i) - box.min.y) / height;
    }
    geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    const image = cached.image as { width: number; height: number };
    const imageAspect = image.width / image.height, surfaceAspect = width / height;
    const cropX = Math.min(1, surfaceAspect / imageAspect);
    const cropY = Math.min(1, imageAspect / surfaceAspect);
    texture.repeat.set(cropX, cropY);
    texture.offset.set((1 - cropX) / 2, (1 - cropY) / 2);
    const material = new MeshBasicMaterial({ map: texture, toneMapped: false, transparent: kind === "screen", opacity: kind === "screen" ? 0 : 1, depthWrite: kind !== "screen", polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    const mesh = new Mesh(geometry, material);
    mesh.name = kind === "portrait" ? "WebPortrait" : "WebScreenPreview";
    mesh.position.z = 0.0005;
    mesh.renderOrder = 2;
    return { texture, geometry, material, mesh, cropX, cropY };
  }, [cached, surface, kind]);
  useEffect(() => { invalidate(); }, [active, invalidate]);
  useEffect(() => () => { prepared.texture.dispose(); prepared.geometry.dispose(); prepared.material.dispose(); }, [prepared]);
  useFrame((_, delta) => {
    const target = active ? 1 : 0;
    const next = reducedMotion ? target : MathUtils.damp(amount.current, target, 13, Math.min(delta, 0.06));
    amount.current = Math.abs(next - target) < 0.0002 ? target : next;
    if (kind === "screen") prepared.material.opacity = amount.current;
    else {
      const scale = 1 + amount.current * 0.03;
      prepared.texture.repeat.set(prepared.cropX / scale, prepared.cropY / scale);
      prepared.texture.offset.set((1 - prepared.texture.repeat.x) / 2, (1 - prepared.texture.repeat.y) / 2);
    }
    if (amount.current !== target) invalidate();
  });
  return createPortal(<primitive object={prepared.mesh} dispose={null} />, surface);
}
