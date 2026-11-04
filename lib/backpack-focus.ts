import {MathUtils,Vector3,type Box3,type QuaternionLike} from "three";
// Use the existing camera tween, but translate only enough to avoid clipping.
// At the default desktop framing this is a zoom in place, rather than centering a separate layout.
export function backpackCameraTarget(home:Vector3,orientation:QuaternionLike,bounds:Box3,width:number,height:number,previousZoom:number,small:boolean){
 const right=new Vector3(1,0,0).applyQuaternion(orientation),up=new Vector3(0,1,0).applyQuaternion(orientation);
 const points=Array.from({length:8},(_,i)=>new Vector3(i&1?bounds.max.x:bounds.min.x,i&2?bounds.max.y:bounds.min.y,i&4?bounds.max.z:bounds.min.z));
 const xs=points.map(p=>p.dot(right)),ys=points.map(p=>p.dot(up));
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const zoom=Math.min(previousZoom*(small?1.9:1.45),small?2.2:2.0,width*.86/(maxX-minX),height*.78/(maxY-minY));
 const halfW=width/(2*zoom),halfH=height/(2*zoom);
 const padX=width/zoom*.02,padY=height/zoom*.025;
 const x=MathUtils.clamp(home.dot(right),maxX-halfW+padX,minX+halfW-padX);
 const y=MathUtils.clamp(home.dot(up),maxY-halfH+padY,minY+halfH-padY);
 return {position:home.clone().addScaledVector(right,x-home.dot(right)).addScaledVector(up,y-home.dot(up)),zoom};
}
