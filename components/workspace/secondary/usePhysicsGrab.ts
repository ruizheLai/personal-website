"use client";
import {useEffect,useRef,type RefObject} from "react";
import {useThree,type ThreeEvent} from "@react-three/fiber";
import {useBeforePhysicsStep,type RapierRigidBody} from "@react-three/rapier";
import {Quaternion,Vector3} from "three";
import {grabAngularVelocity,grabVelocity,rotateBinFromPointer,GRAB_CONFIG} from "@/lib/grab-math";
import type {PhysicsBodyId} from "@/lib/secondary-config";
import type {SecondaryState} from "./useSecondaryInteractions";
export type GrabBodies=Record<PhysicsBodyId,RapierRigidBody|null>;
type Hold={body:RapierRigidBody;pointer:number|null;target:Vector3;rotation:Quaternion;lastX:number;lastY:number};
export function usePhysicsGrab(bodies:RefObject<GrabBodies>,state:SecondaryState,wake:()=>void){
 const {gl,invalidate}=useThree();
 const held=useRef<Hold|null>(null),latest=useRef({state,wake});latest.current={state,wake};
 const release=(notify=true)=>{
  const hold=held.current;if(!hold)return;held.current=null;
  if(hold.pointer!==null&&gl.domElement.hasPointerCapture(hold.pointer))gl.domElement.releasePointerCapture(hold.pointer);
  if(notify){
   hold.body.setLinvel(new Vector3().copy(hold.body.linvel()).clampLength(0,GRAB_CONFIG.throwLinear),true);
   hold.body.setAngvel(new Vector3().copy(hold.body.angvel()).clampLength(0,GRAB_CONFIG.maxAngular),true);
   latest.current.state.setHeld(null);latest.current.state.setDragging(false);latest.current.state.suppressClick();latest.current.wake();
  }
  invalidate();
 };
 const makeHold=(pointer:number|null,x=0,y=0)=>{
  const body=bodies.current.bin,s=latest.current.state;
  if(!body||!s.enabled||s.bagFocused||held.current)return;
  latest.current.wake();body.recomputeMassPropertiesFromColliders();body.wakeUp();
  held.current={body,pointer,target:new Vector3().copy(body.translation()),rotation:new Quaternion().copy(body.rotation()),lastX:x,lastY:y};
  s.closeBag();s.setHeld("bin");s.setDragging(true);s.hover(null);invalidate();
 };
 const begin=(_id:PhysicsBodyId,event:ThreeEvent<PointerEvent>)=>{
  event.stopPropagation();
  if(event.button!==0||held.current||_id!=="bin")return;
  event.nativeEvent.preventDefault();makeHold(event.pointerId,event.clientX,event.clientY);
  if(held.current)gl.domElement.setPointerCapture(event.pointerId);
 };
 useEffect(()=>{
  const canvas=gl.domElement;
  const move=(event:PointerEvent)=>{
   const h=held.current;if(!h||h.pointer!==event.pointerId)return;
   event.preventDefault();
   // Exactly the former Shift-drag rotation, now unconditional.
   rotateBinFromPointer(h.rotation,event.clientX-h.lastX,event.clientY-h.lastY);
   h.lastX=event.clientX;h.lastY=event.clientY;invalidate();
  };
  const up=(event:PointerEvent)=>{if(held.current?.pointer===event.pointerId)release();};
  const wheel=(event:WheelEvent)=>{if(held.current){event.preventDefault();event.stopImmediatePropagation();}};
  const blur=()=>release();
  canvas.addEventListener("pointermove",move,{passive:false});
  canvas.addEventListener("pointerup",up);canvas.addEventListener("pointercancel",up);
  canvas.addEventListener("wheel",wheel,{passive:false,capture:true});window.addEventListener("blur",blur);
  return()=>{release(false);canvas.removeEventListener("pointermove",move);canvas.removeEventListener("pointerup",up);canvas.removeEventListener("pointercancel",up);canvas.removeEventListener("wheel",wheel,true);window.removeEventListener("blur",blur);};
 },[gl,invalidate]);
 useEffect(()=>{
  state.physicsKeys.current=(_id,event)=>{
   if(![" ","Enter","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Escape"].includes(event.key))return;
   event.preventDefault();event.stopPropagation();
   if(event.key===" "||event.key==="Enter"){if(held.current)release();else makeHold(null);return;}
   const h=held.current;if(!h)return;
   if(event.key==="Escape"){release();return;}
   const dx=event.key==="ArrowLeft"?-10:event.key==="ArrowRight"?10:0;
   const dy=event.key==="ArrowUp"?-10:event.key==="ArrowDown"?10:0;
   rotateBinFromPointer(h.rotation,dx,dy);invalidate();
  };
  return()=>{state.physicsKeys.current=null;};
 },[state.physicsKeys]);
 useEffect(()=>{if(!state.enabled||state.bagFocused)release();},[state.enabled,state.bagFocused]);
 useBeforePhysicsStep(()=>{
  const h=held.current;if(!h)return;
  h.body.setLinvel(grabVelocity(h.body.translation(),h.target),true);
  h.body.setAngvel(grabAngularVelocity(h.body.rotation(),h.rotation),true);
 });
 return {begin,held};
}
