"use client";
import {useEffect,useRef,type RefObject} from "react";
import {useThree,type ThreeEvent} from "@react-three/fiber";
import {useBeforePhysicsStep,type RapierRigidBody} from "@react-three/rapier";
import {Plane,Quaternion,Raycaster,Vector2,Vector3} from "three";
import {clampGrabTarget,grabAngularVelocity,grabVelocity,GRAB_CONFIG} from "@/lib/grab-math";
import type {GrabbableId} from "@/lib/secondary-config";
import type {SecondaryState} from "./useSecondaryInteractions";
export type GrabBodies=Record<GrabbableId,RapierRigidBody|null>;
type Hold={id:GrabbableId;body:RapierRigidBody;pointer:number|null;second:number|null;plane:Plane;offset:Vector3;target:Vector3;rotation:Quaternion;lastX:number;lastY:number;secondX:number;secondY:number;lastTime:number;lastMove:number;velocity:Vector3};
export function usePhysicsGrab(bodies:RefObject<GrabBodies>,state:SecondaryState,wake:()=>void){
 const {gl,get,invalidate}=useThree();
 const held=useRef<Hold|null>(null),latest=useRef({state,wake});latest.current={state,wake};
 const ray=useRef(new Raycaster()),point=useRef(new Vector3());
 const project=(x:number,y:number,plane:Plane)=>{
  const rect=gl.domElement.getBoundingClientRect();
  ray.current.setFromCamera(new Vector2((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1),get().camera);
  return ray.current.ray.intersectPlane(plane,point.current);
 };
 const release=(notify=true)=>{
  const hold=held.current;if(!hold)return;held.current=null;
  for(const id of [hold.pointer,hold.second])if(id!==null&&gl.domElement.hasPointerCapture(id))gl.domElement.releasePointerCapture(id);
  if(notify){
  const velocity=new Vector3().copy(hold.body.linvel());
  if(hold.pointer!==null&&performance.now()-hold.lastMove<100)velocity.lerp(hold.velocity,.35);
  velocity.clampLength(0,GRAB_CONFIG.throwLinear);hold.body.setLinvel(velocity,true);
  hold.body.setAngvel(new Vector3().copy(hold.body.angvel()).clampLength(0,GRAB_CONFIG.maxAngular),true);
  latest.current.state.setHeld(null);latest.current.state.setDragging(false);latest.current.state.suppressClick();latest.current.wake();}
  invalidate();
 };
 const makeHold=(id:GrabbableId,pointer:number|null,x=0,y=0,hit?:Vector3)=>{
  const body=bodies.current[id],s=latest.current.state;
  if(!body||!s.enabled||s.bagFocused||held.current)return;
  latest.current.wake();body.recomputeMassPropertiesFromColliders();body.wakeUp();
  const position=new Vector3().copy(body.translation());
  const plane=new Plane().setFromNormalAndCoplanarPoint(get().camera.getWorldDirection(new Vector3()),hit??position);
  const projected=pointer===null?position:project(x,y,plane)?.clone()??position;
  held.current={id,body,pointer,second:null,plane,offset:position.clone().sub(projected),target:position.clone(),rotation:new Quaternion().copy(body.rotation()),lastX:x,lastY:y,secondX:0,secondY:0,lastTime:performance.now(),lastMove:0,velocity:new Vector3()};
  s.closeBag();s.setKeyboardGrab(pointer===null);s.setHeld(id);s.setDragging(true);s.hover(null);invalidate();
 };
 const begin=(id:GrabbableId,event:ThreeEvent<PointerEvent>)=>{
  event.stopPropagation();
  if(event.button!==0||held.current)return;
  event.nativeEvent.preventDefault();
  makeHold(id,event.pointerId,event.clientX,event.clientY,event.point);
  if(held.current)gl.domElement.setPointerCapture(event.pointerId);
 };
 useEffect(()=>{
  const canvas=gl.domElement;
  const rotate=(hold:Hold,dx:number,dy:number)=>{
   const turnX=new Quaternion().setFromAxisAngle(new Vector3(1,0,0),dy*.012);
   const turnZ=new Quaternion().setFromAxisAngle(new Vector3(0,0,1),-dx*.012);
   hold.rotation.premultiply(turnX).premultiply(turnZ).normalize();
  };
  const down=(event:PointerEvent)=>{
   const h=held.current;
   if(h&&event.pointerType==="touch"&&h.pointer!==event.pointerId&&h.second===null){
    event.preventDefault();h.second=event.pointerId;h.secondX=event.clientX;h.secondY=event.clientY;canvas.setPointerCapture(event.pointerId);
   }
  };
  const move=(event:PointerEvent)=>{
   const h=held.current;if(!h||h.pointer===null)return;
   if(event.pointerId===h.second){event.preventDefault();rotate(h,event.clientX-h.secondX,event.clientY-h.secondY);h.secondX=event.clientX;h.secondY=event.clientY;invalidate();return;}
   if(event.pointerId!==h.pointer)return;
   event.preventDefault();
   const projected=project(event.clientX,event.clientY,h.plane);
   if(event.shiftKey){
    rotate(h,event.clientX-h.lastX,event.clientY-h.lastY);
    if(projected)h.offset.copy(h.target).sub(projected);
   }else if(projected){
    const previous=h.target.clone(),now=performance.now();
    h.target.copy(projected).add(h.offset);clampGrabTarget(h.target);
    const elapsed=Math.max(.016,(now-h.lastTime)/1000);
    h.velocity.lerp(h.target.clone().sub(previous).divideScalar(elapsed).clampLength(0,GRAB_CONFIG.throwLinear),.6);
    h.lastTime=now;h.lastMove=now;
   }
   h.lastX=event.clientX;h.lastY=event.clientY;invalidate();
  };
  const up=(event:PointerEvent)=>{
   const h=held.current;if(!h)return;
   if(event.pointerId===h.second){if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);h.second=null;return;}
   if(event.pointerId===h.pointer)release();
  };
  const wheel=(event:WheelEvent)=>{
   const h=held.current;if(!h)return;
   event.preventDefault();event.stopImmediatePropagation();
   const change=Math.max(-.12,Math.min(.12,event.deltaY*.001));
   h.target.z+=change;h.offset.z+=change;clampGrabTarget(h.target);invalidate();
  };
  const blur=()=>release();
  canvas.addEventListener("pointerdown",down);
  canvas.addEventListener("pointermove",move,{passive:false});
  canvas.addEventListener("pointerup",up);canvas.addEventListener("pointercancel",up);
  canvas.addEventListener("wheel",wheel,{passive:false,capture:true});window.addEventListener("blur",blur);
  return()=>{
   release(false);canvas.removeEventListener("pointerdown",down);canvas.removeEventListener("pointermove",move);
   canvas.removeEventListener("pointerup",up);canvas.removeEventListener("pointercancel",up);canvas.removeEventListener("wheel",wheel,true);window.removeEventListener("blur",blur);
  };
 },[gl,get,invalidate]);
 useEffect(()=>{
  state.physicsKeys.current=(id,event)=>{
   const keys=[" ","Enter","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","PageUp","PageDown","Home","Escape"];
   if(!keys.includes(event.key))return;
   event.preventDefault();event.stopPropagation();
   if(event.key===" "||event.key==="Enter"){if(held.current)release();else makeHold(id,null);return;}
   const h=held.current;if(!h||h.id!==id)return;
   if(event.key==="Escape"){release();return;}
   if(event.key==="Home")h.rotation.identity();
   else if(event.shiftKey&&event.key.startsWith("Arrow")){
    const axis=event.key==="ArrowUp"||event.key==="ArrowDown"?new Vector3(1,0,0):new Vector3(0,0,1);
    const sign=event.key==="ArrowUp"||event.key==="ArrowLeft"?-1:1;
    h.rotation.premultiply(new Quaternion().setFromAxisAngle(axis,sign*.12)).normalize();
   }else{
    if(event.key==="ArrowUp")h.target.y+=.045;
    if(event.key==="ArrowDown")h.target.y-=.045;
    if(event.key==="ArrowLeft")h.target.x-=.045;
    if(event.key==="ArrowRight")h.target.x+=.045;
    if(event.key==="PageUp")h.target.z-=.045;
    if(event.key==="PageDown")h.target.z+=.045;
    clampGrabTarget(h.target);
   }
   invalidate();
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
