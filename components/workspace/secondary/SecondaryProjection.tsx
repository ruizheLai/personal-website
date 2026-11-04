"use client";
import {useFrame,useThree} from "@react-three/fiber";
import {useMemo,type RefObject} from "react";
import {Box3,Vector3,type Object3D} from "three";
import type {SecondaryId} from "@/lib/secondary-config";
import type {SecondaryElements} from "./SecondaryOverlay";
export default function SecondaryProjection({objects,elements}:{objects:Record<SecondaryId,Object3D>;elements:RefObject<SecondaryElements>}){
 const scratch=useMemo(()=>({box:new Box3(),center:new Vector3()}),[]);
 useFrame(({camera,size})=>{
  for(const id of ["backpack","mug"] as const){
   const object=objects[id];object.updateWorldMatrix(true,true);
   scratch.box.setFromObject(object);scratch.box.getCenter(scratch.center).project(camera);
   const x=(scratch.center.x*.5+.5)*size.width,y=(-scratch.center.y*.5+.5)*size.height;
   const anchor=elements.current.anchors[id];
   if(anchor){anchor.style.transform="translate3d("+x+"px,"+y+"px,0)";anchor.style.opacity="1";}
   if(id==="mug"&&elements.current.toast){elements.current.toast.style.left=Math.max(12,Math.min(size.width-116,x-52))+"px";elements.current.toast.style.top=Math.max(12,y-65)+"px";}
  }
 });
 return null;
}
