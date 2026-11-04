"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, type RefObject } from "react";
import { Box3, Vector3, type Object3D } from "three";
import { SECONDARY_OBJECTS, type SecondaryId } from "@/lib/secondary-config";
import { placeFloatingContent } from "@/lib/floating-layout";
import type { SurfaceRects } from "../WorkspaceModel";
import type { SecondaryElements } from "./SecondaryOverlay";
export default function SecondaryProjection({ objects, elements, primaryRects }: { objects: Record<SecondaryId, Object3D>; elements: RefObject<SecondaryElements>; primaryRects: RefObject<SurfaceRects> }) {
  const { gl } = useThree();
  const scratch = useMemo(() => ({ box: new Box3(), points: Array.from({ length: 8 }, () => new Vector3()) }), []);
  useFrame(({ camera, size }) => {
    const canvas = gl.domElement.getBoundingClientRect();
    for (const id of Object.keys(SECONDARY_OBJECTS) as SecondaryId[]) {
      const object = objects[id];
      object.updateWorldMatrix(true, true);
      scratch.box.setFromObject(object);
      const { min, max } = scratch.box;
      scratch.points.forEach((p, index) => p.set(index & 1 ? max.x : min.x, index & 2 ? max.y : min.y, index & 4 ? max.z : min.z).project(camera));
      const xs = scratch.points.map(p => (p.x * .5 + .5) * size.width), ys = scratch.points.map(p => (-p.y * .5 + .5) * size.height);
      const left = Math.min(...xs), top = Math.min(...ys), width = Math.max(...xs) - left, height = Math.max(...ys) - top;
      const anchor = elements.current.anchors[id];
      if (anchor) { anchor.style.transform = `translate3d(${left + width / 2}px,${top + height / 2}px,0)`; anchor.style.opacity = "1"; }
      if (id === "backpack" && elements.current.bag) {
        const panel = elements.current.bag;
        const obstacles = Object.values(primaryRects.current).filter(Boolean).map(rect => ({ ...rect!, left: rect!.left - canvas.left, top: rect!.top - canvas.top }));
        const placed = placeFloatingContent({ left, top, width, height }, panel.offsetWidth, panel.offsetHeight, size, obstacles);
        panel.style.left = placed.left + "px"; panel.style.top = placed.top + "px";
        panel.querySelectorAll<HTMLElement>(".bag-token").forEach(token => {
          let x = 0, y = 0, current: HTMLElement | null = token;
          while (current && current !== panel) { x += current.offsetLeft; y += current.offsetTop; current = current.offsetParent as HTMLElement | null; }
          token.style.setProperty("--from-x", left + width * .5 - placed.left - x - token.offsetWidth * .5 + "px");
          token.style.setProperty("--from-y", top + height * .1 - placed.top - y - token.offsetHeight * .5 + "px");
        });
      }
      if (id === "mug" && elements.current.toast) {
        elements.current.toast.style.left = Math.max(12, Math.min(size.width - 116, left + width / 2 - 52)) + "px";
        elements.current.toast.style.top = Math.max(12, top - 42) + "px";
      }
      if (id === "bin" && elements.current.reset) {
        elements.current.reset.style.left = Math.max(12, Math.min(size.width - 100, left + width / 2 - 42)) + "px";
        elements.current.reset.style.top = Math.min(size.height - 44, top + height + 12) + "px";
      }
    }
  });
  return null;
}
