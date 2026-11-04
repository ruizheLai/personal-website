import {MathUtils,Quaternion,Vector3,type QuaternionLike,type Vector3Like} from "three";
export const GRAB_CONFIG={translationGain:18,rotationGain:16,maxLinear:4,maxAngular:8,throwLinear:4.5,minX:1.48,maxX:2.10,minY:.015,maxY:2.1,minZ:.16,maxZ:1.98} as const;
export function clampGrabTarget(target:Vector3){
 target.x=MathUtils.clamp(target.x,GRAB_CONFIG.minX,GRAB_CONFIG.maxX);
 target.y=MathUtils.clamp(target.y,GRAB_CONFIG.minY,GRAB_CONFIG.maxY);
 target.z=MathUtils.clamp(target.z,GRAB_CONFIG.minZ,GRAB_CONFIG.maxZ);return target;
}
export function grabVelocity(position:Vector3Like,target:Vector3Like){
 return new Vector3().copy(target).sub(position).multiplyScalar(GRAB_CONFIG.translationGain).clampLength(0,GRAB_CONFIG.maxLinear);
}
export function grabAngularVelocity(rotation:QuaternionLike,target:QuaternionLike){
 const delta=new Quaternion().copy(target).multiply(new Quaternion().copy(rotation).invert()).normalize();
 if(delta.w<0)delta.set(-delta.x,-delta.y,-delta.z,-delta.w);
 const length=Math.hypot(delta.x,delta.y,delta.z);
 return length<1e-6?new Vector3():new Vector3(delta.x,delta.y,delta.z).multiplyScalar(2*Math.atan2(length,delta.w)*GRAB_CONFIG.rotationGain/length).clampLength(0,GRAB_CONFIG.maxAngular);
}
