"use client";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, OrthographicCamera } from "three";
import { WORKSPACE_CONFIG as config } from "@/lib/workspace-config";

export default function CameraController({ referenceCamera, reducedMotion }: { referenceCamera: OrthographicCamera; reducedMotion: boolean }) {
  const { size, gl, invalidate, set, get } = useThree();
  const zoomTarget = useRef<number>(config.zoom.initial);
  const camera = useMemo(() => {
    const value = new OrthographicCamera() as OrthographicCamera & { manual: boolean };
    value.manual = true;
    value.copy(referenceCamera, false);
    referenceCamera.updateWorldMatrix(true, false);
    referenceCamera.getWorldPosition(value.position);
    referenceCamera.getWorldQuaternion(value.quaternion);
    value.zoom = config.zoom.initial;
    return value;
  }, [referenceCamera]);

  useLayoutEffect(() => {
    const previous = get().camera;
    set({ camera });
    return () => { if (get().camera === camera) set({ camera: previous }); };
  }, [camera, set, get]);

  useLayoutEffect(() => {
    const width = size.width < 768 ? config.framing.mobileWidth : size.width < 1100 ? config.framing.tabletWidth : config.framing.desktopWidth;
    const height = width / Math.max(size.width / size.height, 0.1);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    invalidate();
  }, [size.width, size.height, camera, invalidate]);

  useEffect(() => {
    const element = gl.domElement;
    const onWheel = (event: WheelEvent) => {
      // Preserve browser pinch/zoom shortcuts and scrolling outside the workspace.
      if (event.ctrlKey || event.metaKey) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (x < 0.18 || x > 0.82 || y < 0.15 || y > 0.9) return;
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
      const delta = MathUtils.clamp(pixels, -200, 200);
      const next = MathUtils.clamp(zoomTarget.current * Math.exp(-delta * config.zoom.wheelSensitivity), config.zoom.min, config.zoom.max);
      if (Math.abs(next - zoomTarget.current) < 0.00001) return;
      event.preventDefault();
      zoomTarget.current = next;
      invalidate();
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [gl, invalidate]);

  useFrame((_, delta) => {
    const target = zoomTarget.current;
    const next = reducedMotion ? target : MathUtils.damp(camera.zoom, target, config.zoom.damping, Math.min(delta, 0.06));
    if (Math.abs(camera.zoom - target) > 0.0001) {
      camera.zoom = Math.abs(next - target) < 0.0001 ? target : next;
      camera.updateProjectionMatrix();
      invalidate();
    }
  });
  return null;
}
