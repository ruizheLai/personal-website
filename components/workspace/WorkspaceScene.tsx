"use client";
import {Suspense,useCallback,useEffect,useRef,useState} from "react";
import {Canvas} from "@react-three/fiber";
import {useGLTF,useTexture} from "@react-three/drei";
import {AgXToneMapping,SRGBColorSpace} from "three";
import {INTERACTIONS,MODEL_URL,WORKSPACE_CONFIG as config,type InteractionId,type InteractionPhase} from "@/lib/workspace-config";
import WorkspaceModel,{type OverlayElements,type SurfaceRects} from "./WorkspaceModel";
import type {FocusId} from "./CameraController";
import InteractiveObject from "./InteractiveObject";
import SecondaryOverlay,{type SecondaryElements} from "./secondary/SecondaryOverlay";
import {useSecondaryInteractions,useWorkspaceVisibility} from "./secondary/useSecondaryInteractions";
import HeroFallback from "./HeroFallback";
import SceneBoundary from "./SceneBoundary";
import {useReducedMotion} from "./useReducedMotion";
import {usePageTransition} from "./PageTransitionProvider";
type Status="loading"|"ready"|"error"|"unavailable";
type FocusState={id:FocusId|null;phase:InteractionPhase;revision:number};
export default function WorkspaceScene(){
 const [supported,setSupported]=useState<boolean|null>(null),[status,setStatus]=useState<Status>("loading"),[attempt,setAttempt]=useState(0),[small,setSmall]=useState(false);
 const reducedMotion=useReducedMotion(),stage=useRef<HTMLDivElement>(null),visible=useWorkspaceVisibility(stage);
 const secondaryElements=useRef<SecondaryElements>({anchors:{},labels:[],physics:{},toast:null});
 const {enter,resetRevision}=usePageTransition(),previousReset=useRef(resetRevision);
 const overlays=useRef<OverlayElements>({}),rects=useRef<SurfaceRects>({});
 const [hovered,setHovered]=useState<InteractionId|null>(null),[keyboard,setKeyboard]=useState<InteractionId|null>(null);
 const [focus,setFocus]=useState<FocusState>({id:null,phase:"idle",revision:0});
 useEffect(()=>{
  if(previousReset.current===resetRevision)return;
  previousReset.current=resetRevision;setHovered(null);setKeyboard(null);setFocus(v=>({id:null,phase:"focusing",revision:v.revision+1}));
 },[resetRevision]);
 const focusBackpack=useCallback(()=>{
  if(status!=="ready"||focus.phase==="focusing"||focus.phase==="transitioning")return;
  setHovered(null);setKeyboard(null);
  if(focus.id!=="backpack")setFocus(v=>({id:"backpack",phase:"focusing",revision:v.revision+1}));
 },[status,focus]);
 const bagFocused=focus.id==="backpack";
 const secondary=useSecondaryInteractions(status==="ready"&&(!focus.id||bagFocused)&&focus.phase!=="focusing"&&focus.phase!=="transitioning"&&visible,bagFocused,bagFocused&&focus.phase==="focused",focusBackpack);
 const active=bagFocused?null:((focus.id as InteractionId|null)??hovered??keyboard);
 const phase=focus.phase==="idle"&&(hovered||keyboard)?"hovered":focus.phase;
 const onReady=useCallback(()=>setStatus("ready"),[]),onError=useCallback(()=>setStatus("error"),[]);
 const reset=useCallback((force=false)=>{
  if(secondary.dragging||secondary.clickSuppressed())return;
  secondary.closeBag();
  setFocus(v=>v.phase==="transitioning"||(!force&&v.phase==="focusing")||!v.id?v:{id:null,phase:"focusing",revision:v.revision+1});setHovered(null);
 },[secondary.dragging,secondary.clickSuppressed,secondary.closeBag]);
 const activate=useCallback((id:InteractionId)=>{
  if(secondary.dragging||secondary.clickSuppressed()||status!=="ready"||focus.phase==="focusing"||focus.phase==="transitioning")return;
  if(bagFocused){reset(true);return;}
  secondary.closeBag();
  if(focus.id===id&&focus.phase==="focused"){
   const rect=rects.current[id];if(!rect)return;
   setFocus(v=>({...v,phase:"transitioning"}));enter(id,rect);
  }else setFocus(v=>({id,phase:"focusing",revision:v.revision+1}));
 },[status,focus,bagFocused,enter,reset,secondary.dragging,secondary.clickSuppressed,secondary.closeBag]);
 const settled=useCallback(()=>setFocus(v=>v.phase==="focusing"?{...v,phase:v.id?"focused":"idle"}:v),[]);
 useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==="Escape")reset(true);};window.addEventListener("keydown",escape);return()=>window.removeEventListener("keydown",escape);},[reset]);
 useEffect(()=>{
  let available=false;try{const context=document.createElement("canvas").getContext("webgl2");available=Boolean(context);context?.getExtension("WEBGL_lose_context")?.loseContext();}catch{available=false;}
  setSupported(available);if(!available)setStatus("unavailable");
  const resize=()=>setSmall(window.innerWidth<768);resize();window.addEventListener("resize",resize,{passive:true});return()=>window.removeEventListener("resize",resize);
 },[]);
 const retry=()=>{useGLTF.clear(MODEL_URL);useTexture.clear(INTERACTIONS.map(i=>i.image));setStatus("loading");setAttempt(v=>v+1);};
 const shadowSize=small?512:1024;
 return <div ref={stage} className="workspace-stage" aria-label="Interactive 3D workspace" aria-busy={status==="loading"} data-phase={phase} data-focused={focus.id??""}>
  {supported&&<SceneBoundary key={attempt} onError={onError}><Canvas className={"workspace-canvas "+(status==="ready"?"is-ready":"")} orthographic camera={{position:[0,3.45,8.5],near:.1,far:300}} frameloop="demand" dpr={[1,small?config.rendering.mobileMaxDpr:config.rendering.maxDpr]} shadows="percentage" gl={{antialias:true,alpha:true,powerPreference:"high-performance"}} onPointerMissed={()=>reset()} onCreated={({gl})=>{gl.toneMapping=AgXToneMapping;gl.toneMappingExposure=config.rendering.exposure;gl.outputColorSpace=SRGBColorSpace;}}>
   <ambientLight intensity={1.1}/><hemisphereLight args={["#ffffff","#c4c4c1",1.1]}/>
   <directionalLight position={[-3.5,9,5]} intensity={3.2} castShadow shadow-mapSize-width={shadowSize} shadow-mapSize-height={shadowSize} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-camera-near={.5} shadow-camera-far={20} shadow-bias={-.0002} shadow-normalBias={.012} shadow-radius={4}/>
   <directionalLight position={[4,3,-2]} intensity={.8}/>
   <Suspense fallback={null}><WorkspaceModel reducedMotion={reducedMotion} onReady={onReady} active={active} hovered={hovered} command={focus} onSettled={settled} onHoverChange={setHovered} onActivate={activate} onReset={reset} overlays={overlays} rects={rects} secondary={secondary} secondaryElements={secondaryElements} visible={visible}/></Suspense>
  </Canvas></SceneBoundary>}
  {supported&&status!=="error"&&<div className="workspace-overlays">{INTERACTIONS.map(i=><InteractiveObject key={i.id} interaction={i} selected={focus.id===i.id} phase={phase} enabled={status==="ready"&&!bagFocused&&!secondary.dragging} attach={el=>{overlays.current[i.id]=el;}} onFocus={()=>setKeyboard(i.id)} onBlur={()=>setKeyboard(null)} onActivate={()=>activate(i.id)}/>)}</div>}
  {supported&&status!=="error"&&<SecondaryOverlay state={secondary} elements={secondaryElements} enabled={secondary.enabled}/>}
  {focus.id&&!bagFocused&&<div className="workspace-focus-nav"><span role="status">{focus.phase==="focused"?"Click again to enter":focus.phase==="transitioning"?"Opening page":""}</span></div>}
  <span className="sr-only" id="workspace-instructions">Select a main object once to focus, and again to enter. Click empty space or press Escape to return.</span>
  {status!=="ready"&&<HeroFallback status={status} retry={status==="error"?retry:undefined}/>}
 </div>;
}
