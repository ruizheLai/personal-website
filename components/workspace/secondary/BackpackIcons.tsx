"use client";
import {useEffect,useMemo,useRef,type RefObject} from "react";
import {useFrame,useThree} from "@react-three/fiber";
import {useTexture} from "@react-three/drei";
import {MathUtils,Mesh,MeshBasicMaterial,PlaneGeometry,SRGBColorSpace,Vector3} from "three";
import {BAG_CONTENT} from "@/lib/secondary-config";
import type {backpackLayout} from "@/lib/backpack-layout";
import type {SecondaryState} from "./useSecondaryInteractions";
import type {SecondaryElements} from "./SecondaryOverlay";
export default function BackpackIcons({layout,state,elements,reducedMotion,visible}:{layout:ReturnType<typeof backpackLayout>;state:SecondaryState;elements:RefObject<SecondaryElements>;reducedMotion:boolean;visible:boolean}){
 const textures=useTexture(BAG_CONTENT.map(i=>"/images/backpack-icons/"+i.file+".png"));
 const {invalidate}=useThree();
 const age=useRef(0),amounts=useRef(BAG_CONTENT.map(()=>0));
 const meshes=useRef<(Mesh|null)[]>([]);
 const prepared=useMemo(()=>{
  const geometry=new PlaneGeometry(1,1);
  const maps=textures.map(texture=>{const copy=texture.clone();copy.colorSpace=SRGBColorSpace;copy.needsUpdate=true;return copy;});
  const materials=maps.map(map=>new MeshBasicMaterial({map,transparent:true,alphaTest:.045,depthWrite:false,toneMapped:false}));
  return {geometry,maps,materials};
 },[textures]);
 const region=useRef<Mesh|null>(null);
 const point=useMemo(()=>new Vector3(),[]);
 useEffect(()=>{age.current=0;invalidate();},[state.bagOpen,invalidate]);
 useEffect(()=>{
  if(!visible||!state.bagOpen||reducedMotion)return;
  const timer=setInterval(invalidate,1000/24);return()=>clearInterval(timer);
 },[visible,state.bagOpen,reducedMotion,invalidate]);
 useEffect(()=>()=>{prepared.geometry.dispose();prepared.maps.forEach(m=>m.dispose());prepared.materials.forEach(m=>m.dispose());},[prepared]);
 useFrame(({camera,size},delta)=>{
  const dt=Math.min(delta,.06);age.current+=dt;
  if(region.current){
   layout.bounds.getCenter(region.current.position);
   region.current.quaternion.copy(camera.quaternion);
   const size3=layout.bounds.getSize(new Vector3());
   region.current.scale.set(size3.x+.06,size3.y+.10,1);
  }
  meshes.current.forEach((mesh,i)=>{
   if(!mesh)return;
   const goal=state.bagOpen&&(reducedMotion||age.current>i*.075+.12)?1:0;
   amounts.current[i]=reducedMotion?goal:MathUtils.damp(amounts.current[i],goal,9,dt);
   const a=amounts.current[i];
   mesh.visible=a>.002;
   mesh.position.lerpVectors(layout.origin,layout.targets[i],a);
   if(!reducedMotion&&a>.99&&visible)mesh.position.y+=Math.sin(age.current*1.35+i*1.7)*.011;
   mesh.quaternion.copy(camera.quaternion);
   const image=prepared.maps[i].image as {width:number;height:number};
   const aspect=image.width/image.height;
   const scale=.40*(.12+.88*a);
   mesh.scale.set(aspect>1?scale:scale*aspect,aspect>1?scale/aspect:scale,1);
   prepared.materials[i].opacity=Math.min(1,a*1.7);
   const label=elements.current.labels[i];
   if(label){point.copy(mesh.position).addScaledVector(new Vector3(0,1,0).applyQuaternion(camera.quaternion),-.23).project(camera);label.style.left=(point.x*.5+.5)*size.width+"px";label.style.top=(-point.y*.5+.5)*size.height+"px";}
   if(Math.abs(a-goal)>.001)invalidate();
  });
 });
 return <group name="BackpackFloatingIcons">{state.bagOpen&&<mesh ref={region} geometry={prepared.geometry} onPointerMove={e=>{e.stopPropagation();state.keepBag();}} onPointerOut={state.leaveBag} onClick={e=>{e.stopPropagation();state.activate("backpack");}}><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>}{BAG_CONTENT.map((item,i)=><mesh key={item.file} ref={el=>{meshes.current[i]=el;}} name={"BackpackIcon_"+item.file} geometry={prepared.geometry} material={prepared.materials[i]} dispose={null} renderOrder={4} onPointerMove={e=>{e.stopPropagation();state.keepBag();}} onPointerOut={state.leaveBag} onClick={e=>e.stopPropagation()}/>)}</group>;
}
