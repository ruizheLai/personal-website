"use client";
import { useEffect, useMemo, useRef } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { MathUtils, PlaneGeometry, ShaderMaterial, type Object3D } from "three";
import { SECONDARY_CONFIG } from "@/lib/secondary-config";
export default function MugInteraction({ mug, hovered, pulse, reducedMotion, visible }: { mug: Object3D; hovered: boolean; pulse: number; reducedMotion: boolean; visible: boolean }) {
  const { invalidate, size } = useThree();
  const time = useRef(0), clickAge = useRef(10), strength = useRef(.12);
  const saved = useMemo(() => ({ position: mug.position.clone(), rotation: mug.rotation.clone() }), [mug]);
  const steam = useMemo(() => {
    const geometry = new PlaneGeometry(.026, .17, 1, 14);
    const materials = Array.from({ length: 3 }, (_, index) => new ShaderMaterial({
      transparent: true, depthWrite: false, toneMapped: false,
      uniforms: { uTime: { value: index * 2.1 }, uOpacity: { value: .12 } },
      vertexShader: "varying vec2 vUv; uniform float uTime; void main(){vUv=uv; vec3 p=position; p.x+=sin(uv.y*7.0-uTime*.8)*.008; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}",
      fragmentShader: "varying vec2 vUv; uniform float uTime; uniform float uOpacity; void main(){float edge=pow(max(0.0,1.0-abs(vUv.x-.5)*2.0),2.0); float fade=sin(vUv.y*3.14159); float w=.65+.35*sin(vUv.y*9.0-uTime); gl_FragColor=vec4(vec3(.57,.59,.58),edge*fade*w*uOpacity);}",
    }));
    return { geometry, materials };
  }, []);
  useEffect(() => {
    if (!visible || reducedMotion) { invalidate(); return; }
    const timer = setInterval(invalidate, 1000 / (size.width < 768 ? SECONDARY_CONFIG.mobileSteamFps : SECONDARY_CONFIG.steamFps));
    return () => clearInterval(timer);
  }, [visible, reducedMotion, size.width, invalidate]);
  useEffect(() => { clickAge.current = pulse ? 0 : 10; invalidate(); }, [pulse, invalidate]);
  useEffect(() => { invalidate(); }, [hovered, invalidate]);
  useEffect(() => () => { steam.geometry.dispose(); steam.materials.forEach(material => material.dispose()); mug.position.copy(saved.position); mug.rotation.copy(saved.rotation); }, [steam, mug, saved]);
  useFrame((_, delta) => {
    if (!visible) return;
    const dt = Math.min(delta, .08);
    if (!reducedMotion) time.current += dt;
    strength.current = MathUtils.damp(strength.current, hovered ? .3 : .12, 8, dt);
    steam.materials.forEach((material, index) => { material.uniforms.uTime.value = time.current + index * 2.1; material.uniforms.uOpacity.value = reducedMotion ? .07 : strength.current; });
    mug.position.copy(saved.position); mug.rotation.copy(saved.rotation);
    if (!reducedMotion && clickAge.current < .8) {
      clickAge.current += dt;
      const a = Math.sin(clickAge.current * Math.PI * 5) * Math.exp(-clickAge.current * 6);
      mug.rotation.z += a * .035; mug.position.y += Math.abs(a) * .005;
      invalidate();
    }
  });
  return createPortal(<group visible={visible} name="WebMugSteam">{steam.materials.map((material, index) => <mesh key={index} geometry={steam.geometry} material={material} position={[(index - 1) * .019, .24 + index * .015, .005]} raycast={() => {}} renderOrder={3} dispose={null} />)}</group>, mug);
}
