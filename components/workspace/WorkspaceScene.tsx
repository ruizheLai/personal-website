"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { AgXToneMapping, SRGBColorSpace } from "three";
import { INTERACTIONS, MODEL_URL, WORKSPACE_CONFIG as config, type InteractionId, type InteractionPhase } from "@/lib/workspace-config";
import WorkspaceModel, { type OverlayElements, type SurfaceRects } from "./WorkspaceModel";
import InteractiveObject from "./InteractiveObject";
import SecondaryOverlay, { type SecondaryElements } from "./secondary/SecondaryOverlay";
import { useSecondaryInteractions, useWorkspaceVisibility } from "./secondary/useSecondaryInteractions";
import HeroFallback from "./HeroFallback";
import SceneBoundary from "./SceneBoundary";
import { useReducedMotion } from "./useReducedMotion";
import { usePageTransition } from "./PageTransitionProvider";
type Status = "loading" | "ready" | "error" | "unavailable";
type FocusState = { id: InteractionId | null; phase: InteractionPhase; revision: number };
export default function WorkspaceScene() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const [small, setSmall] = useState(false);
  const reducedMotion = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const visible = useWorkspaceVisibility(stage);
  const secondaryElements = useRef<SecondaryElements>({ anchors: {}, bag: null, toast: null, reset: null });
  const { enter, resetRevision } = usePageTransition();
  const previousReset = useRef(resetRevision);
  const overlays = useRef<OverlayElements>({});
  const rects = useRef<SurfaceRects>({});
  const [hovered, setHovered] = useState<InteractionId | null>(null);
  const [keyboard, setKeyboard] = useState<InteractionId | null>(null);
  const [focus, setFocus] = useState<FocusState>({ id: null, phase: "idle", revision: 0 });
  useEffect(() => {
    if (previousReset.current === resetRevision) return;
    previousReset.current = resetRevision;
    setHovered(null); setKeyboard(null);
    setFocus(value => ({ id: null, phase: "focusing", revision: value.revision + 1 }));
  }, [resetRevision]);
  const secondary = useSecondaryInteractions(status === "ready" && !focus.id && focus.phase !== "focusing" && focus.phase !== "transitioning" && visible);
  const active = focus.id ?? hovered ?? keyboard;
  const phase = focus.phase === "idle" && (hovered || keyboard) ? "hovered" : focus.phase;
  const onReady = useCallback(() => setStatus("ready"), []);
  const onError = useCallback(() => setStatus("error"), []);
  const reset = useCallback((force = false) => {
    setFocus(value => value.phase === "transitioning" || (!force && value.phase === "focusing") || !value.id ? value : { id: null, phase: "focusing", revision: value.revision + 1 });
    setHovered(null);
  }, []);
  const activate = useCallback((id: InteractionId) => {
    if (secondary.dragging || status !== "ready" || focus.phase === "focusing" || focus.phase === "transitioning") return;
    secondary.closeBag();
    if (focus.id === id && focus.phase === "focused") {
      const rect = rects.current[id];
      if (!rect) return;
      setFocus(value => ({ ...value, phase: "transitioning" }));
      enter(id, rect);
    } else {
      setFocus(value => ({ id, phase: "focusing", revision: value.revision + 1 }));
    }
  }, [status, focus, enter, secondary.dragging, secondary.closeBag]);
  const settled = useCallback(() => setFocus(value => value.phase === "focusing" ? { ...value, phase: value.id ? "focused" : "idle" } : value), []);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") reset(true); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [reset]);
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
  const retry = () => { useGLTF.clear(MODEL_URL); useTexture.clear(INTERACTIONS.map(item => item.image)); setStatus("loading"); setAttempt(value => value + 1); };
  const shadowSize = small ? 512 : 1024;
  return <div ref={stage} className="workspace-stage" aria-label="Interactive 3D workspace" aria-busy={status === "loading"} data-phase={phase} data-focused={focus.id ?? ""}>
    {supported && <SceneBoundary key={attempt} onError={onError}>
      <Canvas className={`workspace-canvas ${status === "ready" ? "is-ready" : ""}`} orthographic camera={{ position: [0, 3.45, 8.5], near: .1, far: 300 }} frameloop="demand" dpr={[1, small ? config.rendering.mobileMaxDpr : config.rendering.maxDpr]} shadows="percentage" gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onPointerMissed={() => { secondary.closeBag(); reset(); }} onCreated={({ gl }) => { gl.toneMapping = AgXToneMapping; gl.toneMappingExposure = config.rendering.exposure; gl.outputColorSpace = SRGBColorSpace; }}>
        <ambientLight intensity={1.1} />
        <hemisphereLight args={["#ffffff", "#c4c4c1", 1.1]} />
        <directionalLight position={[-3.5, 9, 5]} intensity={3.2} castShadow shadow-mapSize-width={shadowSize} shadow-mapSize-height={shadowSize} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-camera-near={.5} shadow-camera-far={20} shadow-bias={-.0002} shadow-normalBias={.012} shadow-radius={4} />
        <directionalLight position={[4, 3, -2]} intensity={.8} />
        <Suspense fallback={null}><WorkspaceModel reducedMotion={reducedMotion} onReady={onReady} active={active} hovered={hovered} command={focus} onSettled={settled} onHoverChange={setHovered} onActivate={activate} onReset={reset} overlays={overlays} rects={rects} secondary={secondary} secondaryElements={secondaryElements} visible={visible} /></Suspense>
      </Canvas>
    </SceneBoundary>}
    {supported && status !== "error" && <div className="workspace-overlays">{INTERACTIONS.map(interaction => <InteractiveObject key={interaction.id} interaction={interaction} selected={focus.id === interaction.id} phase={phase} enabled={status === "ready"} attach={element => { overlays.current[interaction.id] = element; }} onFocus={() => setKeyboard(interaction.id)} onBlur={() => setKeyboard(null)} onActivate={() => activate(interaction.id)} />)}</div>}
    {supported && status !== "error" && <SecondaryOverlay state={secondary} elements={secondaryElements} enabled={secondary.enabled && !secondary.dragging} />}
    {focus.id && <div className="workspace-focus-nav">
      <button onClick={() => reset(true)} disabled={focus.phase === "transitioning"} aria-label="Back to workspace">← Back</button>
      <span role="status">{focus.phase === "focusing" ? "Moving closer" : focus.phase === "transitioning" ? "Opening page" : "Select again to enter"}</span>
    </div>}
    <span className="sr-only" id="workspace-instructions">Select an object once to focus, and again to enter. Escape returns to the workspace.</span>
    {status !== "ready" && <HeroFallback status={status} retry={status === "error" ? retry : undefined} />}
  </div>;
}
