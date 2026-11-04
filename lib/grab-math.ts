import {Quaternion,Vector3,type QuaternionLike,type Vector3Like} from "three";
export const GRAB_CONFIG={translationGain:18,rotationGain:16,maxLinear:4,maxAngular:8,throwLinear:4.5} as const;
// Stabilize the original grab point; pointer movement never changes this target.
export function grabVelocity(position:Vector3Like,target:Vector3Like){
 return new Vector3().copy(target).sub(position).multiplyScalar(GRAB_CONFIG.translationGain).clampLength(0,GRAB_CONFIG.maxLinear);
}
export function rotateBinFromPointer(rotation:Quaternion,dx:number,dy:number){
 const turnX=new Quaternion().setFromAxisAngle(new Vector3(1,0,0),dy*.012);
 const turnZ=new Quaternion().setFromAxisAngle(new Vector3(0,0,1),-dx*.012);
 return rotation.premultiply(turnX).premultiply(turnZ).normalize();
}
export function grabAngularVelocity(rotation:QuaternionLike,target:QuaternionLike){
 const delta=new Quaternion().copy(target).multiply(new Quaternion().copy(rotation).invert()).normalize();
 if(delta.w<0)delta.set(-delta.x,-delta.y,-delta.z,-delta.w);
 const length=Math.hypot(delta.x,delta.y,delta.z);
 return length<1e-6?new Vector3():new Vector3(delta.x,delta.y,delta.z).multiplyScalar(2*Math.atan2(length,delta.w)*GRAB_CONFIG.rotationGain/length).clampLength(0,GRAB_CONFIG.maxAngular);
}
