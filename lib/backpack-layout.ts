import {Box3,Vector3,type Object3D} from "three";
// World-space targets, anchored to the actual bag opening. Columns leave the frame and phone clear.
export function backpackLayout(bag:Object3D,small:boolean){
 bag.updateWorldMatrix(true,true);
 const origin=bag.localToWorld(new Vector3(0,.55,.12));
 const columns=small?[-.60,-.08]:[-.95,-.38];
 const rows=small?[2.65,1.95,1.25]:[1.65,1.10,.55];
 const targets=[0,1,2,3,4,5].map(i=>origin.clone().add(new Vector3(columns[i<3?0:1],rows[i%3],.05)));
 const bounds=new Box3().setFromObject(bag);
 targets.forEach(p=>bounds.expandByPoint(p.clone().add(new Vector3(-.25,-.28,0))).expandByPoint(p.clone().add(new Vector3(.25,.23,0))));
 return {origin,targets,bounds};
}
