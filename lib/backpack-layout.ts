import {Box3,MathUtils,Vector3,type Object3D} from "three";
export const BACKPACK_ICON_SIZE=.24; // 60% of the previous .40 world-space size.
// Asymmetric fan: three high objects, two mid-flight objects and one near the opening.
const FAN=[[-.66,1.0,.04],[-.12,1.2,.02],[-.79,.50,.07],[-.24,.68,.05],[.30,.98,.025],[-.50,.32,.08]] as const;
export function backpackLayout(bag:Object3D,small:boolean){
 bag.updateWorldMatrix(true,true);
 const origin=bag.localToWorld(new Vector3(0,.55,.12));
 const targets=FAN.map(([x,y,z])=>origin.clone().add(new Vector3(x*(small?.70:1),(small?(y===.32?.22:y===.68?.86:y)*1.12:y),z)));
 const bounds=new Box3().setFromObject(bag);
 targets.forEach(p=>bounds.expandByPoint(p.clone().add(new Vector3(-.18,-.24,-.02))).expandByPoint(p.clone().add(new Vector3(.18,.15,.02))));
 return {origin,targets,bounds};
}
export function backpackFlight(origin:Vector3,target:Vector3,progress:number,index:number,out=new Vector3()){
 const p=MathUtils.clamp(progress,0,1);
 const rise=1-Math.pow(1-p,3);
 const spread=MathUtils.smoothstep(p,.26,1);
 const arc=Math.sin(Math.PI*p);
 return out.set(
  origin.x+(target.x-origin.x)*spread+arc*(index-2.5)*.008,
  origin.y+(target.y-origin.y)*rise,
  origin.z+(target.z-origin.z)*rise+arc*.025
 );
}
