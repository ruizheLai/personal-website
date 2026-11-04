"use client";
import {useEffect,useLayoutEffect,useMemo,useRef} from "react";
import {useFrame,useThree} from "@react-three/fiber";
import {Box3,MathUtils,OrthographicCamera,Vector3,type Mesh} from "three";
import {WORKSPACE_CONFIG as config,type InteractionId} from "@/lib/workspace-config";
export type FocusId=InteractionId|"backpack";
export type FocusCommand={id:FocusId|null;revision:number};
export default function CameraController({referenceCamera,surfaces,backpackBounds,command,reducedMotion,onSettled,interactionLocked=false}:{
 referenceCamera:OrthographicCamera;surfaces:Record<InteractionId,Mesh>;backpackBounds:Box3;command:FocusCommand;reducedMotion:boolean;onSettled:()=>void;interactionLocked?:boolean;
}){
 const {size,gl,invalidate,set,get}=useThree();
 const zoomTarget=useRef<number>(config.zoom.initial),returnZoom=useRef(1),previousFocus=useRef<FocusId|null>(null);
 const motion=useRef<{from:Vector3;to:Vector3;fromZoom:number;toZoom:number;elapsed:number;duration:number}|null>(null);
 const settled=useRef(onSettled);settled.current=onSettled;
 const camera=useMemo(()=>{
  const value=new OrthographicCamera() as OrthographicCamera&{manual:boolean};value.manual=true;value.copy(referenceCamera,false);
  referenceCamera.updateWorldMatrix(true,false);referenceCamera.getWorldPosition(value.position);referenceCamera.getWorldQuaternion(value.quaternion);value.zoom=config.zoom.initial;return value;
 },[referenceCamera]);
 const home=useMemo(()=>camera.position.clone(),[camera]);
 useLayoutEffect(()=>{const previous=get().camera;set({camera});return()=>{if(get().camera===camera)set({camera:previous});};},[camera,set,get]);
 useLayoutEffect(()=>{
  const width=size.width<768?config.framing.mobileWidth:size.width<1100?config.framing.tabletWidth:config.framing.desktopWidth;
  const height=width/Math.max(size.width/size.height,.1);
  camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();
  if(command.id&&!previousFocus.current)returnZoom.current=camera.zoom;
  previousFocus.current=command.id;
  const target=home.clone();let targetZoom=returnZoom.current;
  if(command.id){
   const box=command.id==="backpack"?backpackBounds:new Box3().setFromObject(surfaces[command.id]);
   const center=box.getCenter(new Vector3());
   const right=new Vector3(1,0,0).applyQuaternion(camera.quaternion),up=new Vector3(0,1,0).applyQuaternion(camera.quaternion);
   const offset=center.clone().sub(home);target.addScaledVector(right,offset.dot(right)).addScaledVector(up,offset.dot(up));
   const points=Array.from({length:8},(_,i)=>new Vector3(i&1?box.max.x:box.min.x,i&2?box.max.y:box.min.y,i&4?box.max.z:box.min.z));
   const xs=points.map(p=>p.dot(right)),ys=points.map(p=>p.dot(up));
   const fraction=command.id==="backpack"?(size.width<768?.78:.62):(size.width<768?.78:config.focus.widthFraction);
   targetZoom=Math.min(width*fraction/(Math.max(...xs)-Math.min(...xs)),height*(command.id==="backpack"?.73:config.focus.heightFraction)/(Math.max(...ys)-Math.min(...ys)));
  }
  zoomTarget.current=returnZoom.current;
  motion.current={from:camera.position.clone(),to:target,fromZoom:camera.zoom,toZoom:targetZoom,elapsed:0,duration:reducedMotion?0:(command.id?config.focus.duration:config.focus.returnDuration)/1000};invalidate();
 },[size.width,size.height,camera,home,surfaces,backpackBounds,command.id,command.revision,reducedMotion,invalidate]);
 useEffect(()=>{
  const element=gl.domElement;
  const wheel=(event:WheelEvent)=>{
   if(interactionLocked||command.id||motion.current||event.ctrlKey||event.metaKey)return;
   const rect=element.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
   if(x<.18||x>.82||y<.15||y>.9)return;
   const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?rect.height:1);
   const next=MathUtils.clamp(zoomTarget.current*Math.exp(-MathUtils.clamp(pixels,-200,200)*config.zoom.wheelSensitivity),config.zoom.min,config.zoom.max);
   if(Math.abs(next-zoomTarget.current)<.00001)return;
   event.preventDefault();zoomTarget.current=next;returnZoom.current=next;invalidate();
  };
  element.addEventListener("wheel",wheel,{passive:false});return()=>element.removeEventListener("wheel",wheel);
 },[command.id,interactionLocked,gl,invalidate]);
 useFrame((_,delta)=>{
  const moving=motion.current;
  if(moving){
   moving.elapsed+=Math.min(delta,.06);const t=moving.duration?Math.min(1,moving.elapsed/moving.duration):1,eased=t*t*(3-2*t);
   camera.position.lerpVectors(moving.from,moving.to,eased);camera.zoom=MathUtils.lerp(moving.fromZoom,moving.toZoom,eased);camera.updateProjectionMatrix();camera.updateMatrixWorld();
   if(t===1){motion.current=null;settled.current();}invalidate();
  }else if(!command.id&&Math.abs(camera.zoom-zoomTarget.current)>.0001){
   camera.zoom=reducedMotion?zoomTarget.current:MathUtils.damp(camera.zoom,zoomTarget.current,config.zoom.damping,Math.min(delta,.06));camera.updateProjectionMatrix();invalidate();
  }
 });
 return null;
}
