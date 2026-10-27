"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { AgXToneMapping, SRGBColorSpace } from "three";
import { MODEL_URL, WORKSPACE_CONFIG as config } from "@/lib/workspace-config";
import WorkspaceModel, { type OverlayElements } from "./WorkspaceModel";
import InteractiveObject from "./InteractiveObject";
import { INTERACTIONS, type InteractionId } from "@/lib/workspace-config";
import { useRouter } from "next/navigation";
import HeroFallback from "./HeroFallback";
import SceneBoundary from "./SceneBoundary";
import { useReducedMotion } from "./useReducedMotion";

type Status = "loading" | "ready" | "error" | "unavailable";
export default function WorkspaceScene() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const [small, setSmall] = useState(false);
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const overlays = useRef<OverlayElements>({});
  const [hovered, setHovered] = useState<InteractionId | null>(null);
  const [focused, setFocused] = useState<InteractionId | null>(null);
  const active = hovered ?? focused;
  const navigate = useCallback((href: string) => router.push(href), [router]);
  const onReady = useCallback(() => setStatus("ready"), []);
  const onError = useCallback(() => setStatus("error"), []);
  useEffect(() => {
    let available = false;
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      available = Boolean(context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { available = false; }
    setSupported(available);
    if (!available) setStatus("unavailable");
    const resize = () => setSmall(window.innerWidth < 768);
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);
  const retry = () => {
    useGLTF.clear(MODEL_URL);
    setStatus("loading");
    setAttempt(value => value + 1);
  };
  const shadowSize = small ? 512 : 1024;
  return (
    <div className="workspace-stage" aria-label="Interactive 3D workspace" aria-busy={status === "loading"}>
      {supported && <SceneBoundary key={attempt} onError={onError}>
        <Canvas className={`workspace-canvas ${status === "ready" ? "is-ready" : ""}`} orthographic camera={{ position: [0, 3.45, 8.5], near: 0.1, far: 300 }} frameloop="demand" dpr={[1, small ? config.rendering.mobileMaxDpr : config.rendering.maxDpr]} shadows="percentage" gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.toneMapping = AgXToneMapping; gl.toneMappingExposure = config.rendering.exposure; gl.outputColorSpace = SRGBColorSpace; }}>
          <ambientLight intensity={1.1} />
          <hemisphereLight args={["#ffffff", "#c4c4c1", 1.1]} />
          <directionalLight position={[-3.5, 9, 5]} intensity={3.2} castShadow shadow-mapSize-width={shadowSize} shadow-mapSize-height={shadowSize} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-camera-near={0.5} shadow-camera-far={20} shadow-bias={-0.0002} shadow-normalBias={0.012} shadow-radius={4} />
          <directionalLight position={[4, 3, -2]} intensity={0.8} />
          <Suspense fallback={null}><WorkspaceModel reducedMotion={reducedMotion} onReady={onReady} active={active} hovered={hovered} onHoverChange={setHovered} onNavigate={navigate} overlays={overlays} /></Suspense>
        </Canvas>
      </SceneBoundary>}
      {supported && status !== "error" && <div className="workspace-overlays">{INTERACTIONS.map(interaction => <InteractiveObject key={interaction.id} interaction={interaction} active={active === interaction.id} enabled={status === "ready"} attach={element => { overlays.current[interaction.id] = element; }} onFocus={() => setFocused(interaction.id)} onBlur={() => setFocused(null)} onNavigate={() => navigate(interaction.href)} />)}</div>}
      {status !== "ready" && <HeroFallback status={status} retry={status === "error" ? retry : undefined} />}
    </div>
  );
}
