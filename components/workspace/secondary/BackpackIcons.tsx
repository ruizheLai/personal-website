"use client";
import {useEffect,useMemo,useRef,type RefObject} from "react";
import {useFrame,useThree} from "@react-three/fiber";
import {useTexture} from "@react-three/drei";
import {MathUtils,Mesh,MeshBasicMaterial,PlaneGeometry,SRGBColorSpace,Vector3} from "three";
import {BAG_CONTENT} from "@/lib/secondary-config";
import {BACKPACK_ICON_SIZE,backpackFlight,type backpackLayout} from "@/lib/backpack-layout";
import type {SecondaryState} from "./useSecondaryInteractions";
import type {SecondaryElements} from "./SecondaryOverlay";
export default function BackpackIcons({layout,state,elements,reducedMotion,visible}:{layout:ReturnType<typeof backpackLayout>;state:SecondaryState;elements:RefObject<SecondaryElements>;reducedMotion:boolean;visible:boolean}){
 const textures=useTexture(BAG_CONTENT.map(i=>"/images/backpack-icons/"+i.file+".png"));
 const {invalidate,gl}=useThree();
 const age=useRef(0),amounts=useRef(BAG_CONTENT.map(()=>0));
 const meshes=useRef<(Mesh|null)[]>([]),region=useRef<Mesh|null>(null);
 const prepared=useMemo(()=>{
  const geometry=new PlaneGeometry(1,1);
  const maps=textures.map(texture=>{const copy=texture.clone();copy.colorSpace=SRGBColorSpace;copy.needsUpdate=true;return copy;});
  const materials=maps.map(map=>new MeshBasicMaterial({map,transparent:true,alphaTest:.045,depthWrite:false,toneMapped:false}));
  return {geometry,maps,materials};
 },[textures]);
 const scratch=useMemo(()=>({point:new Vector3(),up:new Vector3(),center:new Vector3(),size:new Vector3()}),[]);
 useEffect(()=>{age.current=0;invalidate();},[state.bagOpen,invalidate]);
 useEffect(()=>{
  if(!visible||!state.bagOpen||reducedMotion)return;
  const timer=setInterval(invalidate,1000/24);return()=>clearInterval(timer);
 },[visible,state.bagOpen,reducedMotion,invalidate]);
 useEffect(()=>()=>{prepared.geometry.dispose();prepared.maps.forEach(m=>m.dispose());prepared.materials.forEach(m=>m.dispose());},[prepared]);
 useFrame(({camera,size},delta)=>{
  const dt=Math.min(delta,.06);age.current+=dt;
  if(region.current){
   layout.bounds.getCenter(scratch.center);layout.bounds.getSize(scratch.size);
   // Keep the invisible hover bridge away from the main frame and phone.
   const right=Math.min(layout.bounds.max.x,layout.origin.x+.25);
   region.current.position.copy(scratch.center);region.current.position.x=(layout.bounds.min.x+right)/2;
   region.current.quaternion.copy(camera.quaternion);
   region.current.scale.set(right-layout.bounds.min.x,scratch.size.y+.08,1);
  }
  scratch.up.set(0,1,0).applyQuaternion(camera.quaternion);
  const poses:unknown[]=[];
  meshes.current.forEach((mesh,i)=>{
   if(!mesh)return;
   let p=amounts.current[i];
   if(reducedMotion)p=state.bagOpen?1:0;
   else if(state.bagOpen){if(p>0||age.current>.10+i*.04)p=Math.min(1,p+dt/.48);}
   else if(age.current>(5-i)*.015)p=Math.max(0,p-dt/.44);
   amounts.current[i]=p;
   mesh.visible=p>.001;
   backpackFlight(layout.origin,layout.targets[i],p,i,mesh.position);
   if(!reducedMotion&&p===1&&state.bagOpen&&visible){
    mesh.position.y+=Math.sin(age.current*1.3+i*1.7)*.008;
    mesh.position.x+=Math.sin(age.current*.9+i*2.2)*.004;
   }
   mesh.quaternion.copy(camera.quaternion);
   const image=prepared.maps[i].image as {width:number;height:number},aspect=image.width/image.height;
   const scale=BACKPACK_ICON_SIZE*MathUtils.smoothstep(p,0,.72);
   mesh.scale.set(aspect>1?scale:scale*aspect,aspect>1?scale/aspect:scale,1);
   prepared.materials[i].opacity=MathUtils.smoothstep(p,.025,.28);
   const label=elements.current.labels[i];
   if(label){scratch.point.copy(mesh.position).addScaledVector(scratch.up,i===5?-.14:-.16).project(camera);label.style.left=(scratch.point.x*.5+.5)*size.width+"px";label.style.top=(-scratch.point.y*.5+.5)*size.height+"px";}
   poses.push({position:{x:mesh.position.x,y:mesh.position.y,z:mesh.position.z},progress:p,scale});
   if(state.bagOpen?p<1:p>0)invalidate();
  });
  const stage=gl.domElement.closest(".workspace-stage") as HTMLElement|null;
  if(stage){stage.dataset.backpackIcons=JSON.stringify(poses);stage.dataset.backpackOrigin=JSON.stringify(layout.origin);stage.dataset.iconSize=String(BACKPACK_ICON_SIZE);}
 });
 return <group name="BackpackFloatingIcons">
  {state.bagOpen&&<mesh ref={region} geometry={prepared.geometry} onPointerMove={e=>{e.stopPropagation();state.keepBag();}} onPointerOut={state.leaveBag} onClick={e=>{e.stopPropagation();state.activate("backpack");}}><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>}
  {BAG_CONTENT.map((item,i)=><mesh key={item.file} ref={el=>{meshes.current[i]=el;}} name={"BackpackIcon_"+item.file} geometry={prepared.geometry} material={prepared.materials[i]} dispose={null} renderOrder={4} onPointerMove={e=>{e.stopPropagation();state.keepBag();}} onPointerOut={state.leaveBag} onClick={e=>e.stopPropagation()}/>)}
 </group>;
}
