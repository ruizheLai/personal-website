"use client";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Object3D } from "three";
import { WORKSPACE_CONFIG as config } from "@/lib/workspace-config";
export default function ChairController({ chair, reducedMotion }: { chair: Object3D; reducedMotion: boolean }) {
  const { gl, invalidate } = useThree();
  const target = useRef(0);
  useEffect(() => {
    const element = gl.domElement;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reducedMotion) return;
      const rect = element.getBoundingClientRect();
      const normalized = MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      target.current = config.chair.direction * normalized * MathUtils.degToRad(config.chair.maxDegrees);
      invalidate();
    };
    const reset = () => { target.current = 0; invalidate(); };
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    reset();
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      chair.rotation.y = 0;
    };
  }, [chair, gl, invalidate, reducedMotion]);
  useFrame((_, delta) => {
    const desired = reducedMotion ? 0 : target.current;
    if (Math.abs(chair.rotation.y - desired) > 0.0001) {
      chair.rotation.y = MathUtils.damp(chair.rotation.y, desired, config.chair.damping, Math.min(delta, 0.06));
      if (Math.abs(chair.rotation.y - desired) < 0.0001) chair.rotation.y = desired;
      invalidate();
    }
  });
  return null;
}
