"use client";
import {useEffect,useLayoutEffect,useMemo,useRef,useState,type ReactNode,type RefObject} from "react";
import {useFrame,useThree,type ThreeEvent} from "@react-three/fiber";
import {Physics,RigidBody,CylinderCollider,ConvexHullCollider,BallCollider,CuboidCollider,useRapier,useAfterPhysicsStep,type RapierRigidBody} from "@react-three/rapier";
import {IcosahedronGeometry,Mesh,MeshStandardMaterial,Quaternion,Vector3,type Object3D} from "three";
import {BIN_PHYSICS as cfg,PAPER_SPECS,hollowBinWalls,resetBody} from "@/lib/trash-physics";
import {readPhysicsSession,savePhysicsSession,type PhysicsPose} from "@/lib/physics-session";
import {PHYSICS_IDS,type PhysicsBodyId,type SecondaryId} from "@/lib/secondary-config";
import {usePhysicsGrab,type GrabBodies} from "./usePhysicsGrab";
import type {SecondaryState} from "./useSecondaryInteractions";
import type {SecondaryElements} from "./SecondaryOverlay";
export default function TrashBinPhysics({source,anchors,state,elements}:{source:Mesh;anchors:Record<SecondaryId,Object3D>;state:SecondaryState;elements:RefObject<SecondaryElements>}){
 const [running,setRunning]=useState(true);
 return <Physics gravity={[0,-9.81,0]} timeStep={1/60} updateLoop="independent" interpolate paused={!state.enabled||state.bagFocused||!running} colliders={false}>
  <BinBodies source={source} anchors={anchors} state={state} elements={elements} setRunning={setRunning}/>
 </Physics>;
}
function PhysicsBody({id,bodies,position,state,onGrab,children}:{id:PhysicsBodyId;bodies:RefObject<GrabBodies>;position:[number,number,number];state:SecondaryState;onGrab:(id:PhysicsBodyId,event:ThreeEvent<PointerEvent>)=>void;children:ReactNode}){
 const saved=useMemo(()=>readPhysicsSession()?.[id], [id]);
 const initialRotation=useMemo(()=>saved?new Quaternion(saved.rotation.x,saved.rotation.y,saved.rotation.z,saved.rotation.w):new Quaternion(),[saved]);
 const initialPosition: [number,number,number]=saved?[saved.position.x,saved.position.y,saved.position.z]:position;
 return <RigidBody ref={body=>{bodies.current[id]=body;}} name={id} position={initialPosition} quaternion={initialRotation} colliders={false} canSleep ccd linearDamping={id==="bin"?.9:1.1} angularDamping={id==="bin"?1.6:2.3} additionalSolverIterations={6} friction={id==="bin"?.65:.8} restitution={.06}>
  <group {...(id==="bin"?{onPointerDown:(e:ThreeEvent<PointerEvent>)=>onGrab(id,e),onPointerMove:(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();state.hover("bin");},onPointerOut:()=>state.hover(null),onClick:(e:ThreeEvent<MouseEvent>)=>e.stopPropagation()}:{})}>{children}</group>
 </RigidBody>;
}
function BinBodies({source,anchors,state,elements,setRunning}:{source:Mesh;anchors:Record<SecondaryId,Object3D>;state:SecondaryState;elements:RefObject<SecondaryElements>;setRunning:(v:boolean)=>void}){
 const {world}=useRapier(),{gl,invalidate}=useThree();
 const bodies=useRef<GrabBodies>({bin:null,"paper-1":null,"paper-2":null,"paper-3":null,"paper-4":null});
 const latest=useRef(state);latest.current=state;
 const quiet=useRef(0),steps=useRef(0);
 const start=useMemo(()=>source.getWorldPosition(new Vector3()),[source]);
 const visual=useMemo(()=>{const mesh=source.clone(false);mesh.position.set(0,0,0);mesh.quaternion.identity();mesh.scale.set(1,1,1);mesh.visible=true;mesh.matrixAutoUpdate=true;mesh.updateMatrix();return mesh;},[source]);
 const walls=useMemo(hollowBinWalls,[]);
 const paperVisuals=useMemo(()=>PAPER_SPECS.map(spec=>{
  const geometry=new IcosahedronGeometry(spec.radius,1),attr=geometry.getAttribute("position"),p=new Vector3();
  for(let i=0;i<attr.count;i++){p.fromBufferAttribute(attr,i);p.multiplyScalar(.87+.12*Math.sin(p.x*173+p.y*211+p.z*97+spec.seed));attr.setXYZ(i,p.x,p.y,p.z);}
  geometry.computeVertexNormals();return geometry;
 }),[]);
 const paperMaterial=useMemo(()=>new MeshStandardMaterial({color:"#eeeee7",roughness:.96,flatShading:true}),[]);
 const wake=()=>{quiet.current=0;setRunning(true);latest.current.setPhysicsMoving(true);Object.values(bodies.current).forEach(b=>b?.wakeUp());invalidate();};
 const grab=usePhysicsGrab(bodies,state,wake);
 useLayoutEffect(()=>{
  const previous=anchors.bin,raycast=source.raycast;source.visible=false;source.raycast=()=>{};anchors.bin=visual;
  return()=>{source.visible=true;source.raycast=raycast;anchors.bin=previous;};
 },[source,anchors,visual]);
 useEffect(()=>{
  // Initialization is the only reset. Normal play never changes body type or teleports bodies.
  const saved=readPhysicsSession();
  for(const id of PHYSICS_IDS){
   const b=bodies.current[id];if(!b)continue;
   const i=PHYSICS_IDS.indexOf(id)-1,spec=PAPER_SPECS[i];
   resetBody(b,saved?.[id]?.position??(id==="bin"?start:{x:start.x+spec.x,y:start.y+.026+spec.radius,z:start.z+spec.z}),saved?.[id]?.rotation);
   if(saved?.[id]){const pose=saved[id]!;b.setLinvel(pose.linear,false);b.setAngvel(pose.angular,false);if(!pose.sleeping)b.wakeUp();}
   b.recomputeMassPropertiesFromColliders();
  }
  world.propagateModifiedBodyPositionsToColliders();invalidate();
  return()=>{paperVisuals.forEach(g=>g.dispose());paperMaterial.dispose();};
 },[]);
 useAfterPhysicsStep(()=>{
  const saved:Partial<Record<PhysicsBodyId,PhysicsPose>>={};
  PHYSICS_IDS.forEach(id=>{const b=bodies.current[id];if(b)saved[id]={position:{...b.translation()},rotation:{...b.rotation()},linear:{...b.linvel()},angular:{...b.angvel()},sleeping:b.isSleeping()};});
  savePhysicsSession(saved);
  steps.current++;
  if(grab.held.current){quiet.current=0;return;}
  const all=Object.values(bodies.current).filter((b):b is RapierRigidBody=>Boolean(b));
  const still=all.every(b=>new Vector3().copy(b.linvel()).length()<.025&&new Vector3().copy(b.angvel()).length()<.09);
  quiet.current=still?quiet.current+1:0;
  if(quiet.current>=60){all.forEach(b=>b.sleep());setRunning(false);latest.current.setPhysicsMoving(false);}
 });
 const scratch=useMemo(()=>({position:new Vector3(),local:new Vector3(),inverse:new Quaternion(),up:new Vector3()}),[]);
 useFrame(({camera,size})=>{
  const bin=bodies.current.bin;if(!bin)return;
  const stage=gl.domElement.closest(".workspace-stage") as HTMLElement|null;
  const poses:Record<string,unknown>={};
  scratch.inverse.copy(bin.rotation()).invert();
  let outside=0,minY=Infinity;
  PHYSICS_IDS.forEach(id=>{
   const b=bodies.current[id];if(!b)return;
   const p=b.translation(),q=b.rotation();poses[id]={position:{...p},rotation:{...q},sleeping:b.isSleeping()};
   if(id!=="bin"){minY=Math.min(minY,p.y);scratch.local.copy(p).sub(bin.translation()).applyQuaternion(scratch.inverse);if(scratch.local.y>cfg.height||scratch.local.y<-.02||Math.hypot(scratch.local.x,scratch.local.z)>.19)outside++;}
   scratch.position.copy(p);if(id==="bin")scratch.position.add(new Vector3(0,.20,0).applyQuaternion(q));scratch.position.project(camera);
   const control=id==="bin"?elements.current.physics.bin:null;
   if(control){control.style.transform="translate3d("+((scratch.position.x*.5+.5)*size.width)+"px,"+((-scratch.position.y*.5+.5)*size.height)+"px,0)";control.style.opacity="1";}
  });
  if(stage){stage.dataset.physicsSteps=String(steps.current);stage.dataset.physicsBodies=String(world.bodies.len());stage.dataset.physicsColliders=String(world.colliders.len());stage.dataset.physicsPoses=JSON.stringify(poses);stage.dataset.paperOutside=String(outside);stage.dataset.paperMinY=String(minY);}
 });
 return <>
  <PhysicsBody id="bin" bodies={bodies} position={[start.x,start.y,start.z]} state={state} onGrab={grab.begin}>
   <CylinderCollider args={[.013,.128]} position={[0,.013,0]} mass={cfg.massBottom}/>
   {walls.map((vertices,i)=><ConvexHullCollider key={i} args={[vertices]} mass={cfg.massWall}/>)}
   <primitive object={visual} dispose={null}/>
  </PhysicsBody>
  {PAPER_SPECS.map((spec,i)=><PhysicsBody key={i} id={PHYSICS_IDS[i+1]} bodies={bodies} position={[start.x+spec.x,start.y+.026+spec.radius,start.z+spec.z]} state={state} onGrab={grab.begin}>
   <BallCollider args={[spec.radius]} mass={cfg.paperMass}/>
   <mesh geometry={paperVisuals[i]} material={paperMaterial} rotation={[spec.seed,spec.seed*.6,0]} castShadow receiveShadow dispose={null} raycast={()=>{}}/>
  </PhysicsBody>)}
  <RigidBody type="fixed" colliders={false}>
   <CuboidCollider args={[8,.08,8]} position={[0,cfg.floorY-.08,0]} friction={.85}/>
   <CuboidCollider args={[.04,2.2,1.4]} position={[cfg.bounds.left,1.8,1.1]}/>
   <CuboidCollider args={[.04,2.2,1.4]} position={[cfg.bounds.right,1.8,1.1]}/>
   <CuboidCollider args={[.6,2.2,.04]} position={[1.8,1.8,cfg.bounds.back]}/>
   <CuboidCollider args={[.6,2.2,.04]} position={[1.8,1.8,cfg.bounds.front]}/>
   <CuboidCollider args={[.6,.04,1.4]} position={[1.8,cfg.bounds.ceiling,1.1]}/>
  </RigidBody>
 </>;
}
