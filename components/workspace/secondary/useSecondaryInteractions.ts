"use client";
import {useCallback,useEffect,useRef,useState,type RefObject} from "react";
import {SECONDARY_CONFIG,type SecondaryId,type GrabbableId} from "@/lib/secondary-config";
export type PhysicsKeyHandler=(id:GrabbableId,event:KeyboardEvent)=>void;
export function useWorkspaceVisibility(stage:RefObject<HTMLDivElement|null>){
 const [visible,setVisible]=useState(true);
 useEffect(()=>{
  let inView=true;
  const update=()=>setVisible(inView&&!document.hidden);
  const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;update();});
  if(stage.current)observer.observe(stage.current);
  document.addEventListener("visibilitychange",update);update();
  return()=>{observer.disconnect();document.removeEventListener("visibilitychange",update);};
 },[stage]);
 return visible;
}
export function useSecondaryInteractions(enabled:boolean,bagFocused:boolean,labelsVisible:boolean,onFocusBag:()=>void){
 const [bagHover,setBagHover]=useState(false);
 const [bagReturning,setBagReturning]=useState(false);
 const [hovered,setHovered]=useState<SecondaryId|null>(null);
 const [mugPulse,setMugPulse]=useState(0),[mugMessage,setMugMessage]=useState(false);
 const [dragging,setDragging]=useState(false);

 const [held,setHeld]=useState<GrabbableId|null>(null);
 const [physicsMoving,setPhysicsMoving]=useState(false);
 const bagTimer=useRef<ReturnType<typeof setTimeout>|null>(null),mugTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const suppressUntil=useRef(0);
 const physicsKeys=useRef<PhysicsKeyHandler|null>(null);
 const cancelExit=useCallback(()=>{if(bagTimer.current)clearTimeout(bagTimer.current);bagTimer.current=null;},[]);
 const closeBag=useCallback((returning=false)=>{cancelExit();setBagReturning(returning);setBagHover(returning);},[cancelExit]);
 const leaveBag=useCallback(()=>{cancelExit();bagTimer.current=setTimeout(()=>setBagHover(false),SECONDARY_CONFIG.exitDelay);},[cancelExit]);
 const keepBag=useCallback(()=>{if(enabled&&!dragging){cancelExit();setBagHover(true);}},[enabled,dragging,cancelExit]);
 const hover=useCallback((id:SecondaryId|null)=>{
  if(!enabled||dragging)return;
  setHovered(id);
  if(id==="backpack"){cancelExit();setBagHover(true);}else leaveBag();
 },[enabled,dragging,cancelExit,leaveBag]);
 const clickSuppressed=useCallback(()=>performance.now()<suppressUntil.current,[]);
 const suppressClick=useCallback(()=>{suppressUntil.current=performance.now()+350;},[]);
 const activate=useCallback((id:SecondaryId)=>{
  if(!enabled||dragging||clickSuppressed())return;
  if(id==="backpack"){cancelExit();setBagHover(true);onFocusBag();}
  if(id==="mug"&&!bagFocused){
   closeBag();setMugPulse(v=>v+1);setMugMessage(true);
   if(mugTimer.current)clearTimeout(mugTimer.current);
   mugTimer.current=setTimeout(()=>setMugMessage(false),2400);
  }
 },[enabled,dragging,bagFocused,onFocusBag,cancelExit,closeBag,clickSuppressed]);
 useEffect(()=>{if(!enabled){if(!bagReturning)closeBag();setHovered(null);setMugMessage(false);}},[enabled,closeBag,bagReturning]);
 useEffect(()=>{if(enabled&&bagReturning&&!bagFocused){setBagReturning(false);leaveBag();}},[enabled,bagReturning,bagFocused,leaveBag]);
 useEffect(()=>()=>{cancelExit();if(mugTimer.current)clearTimeout(mugTimer.current);},[cancelExit]);
 return {enabled,bagOpen:bagFocused||bagHover||bagReturning,bagFocused,labelsVisible,hovered,mugPulse,mugMessage,dragging,setDragging,held,setHeld,physicsMoving,setPhysicsMoving,physicsKeys,hover,activate,keepBag,leaveBag,closeBag,suppressClick,clickSuppressed};
}
export type SecondaryState=ReturnType<typeof useSecondaryInteractions>;
