import assert from "node:assert/strict";
import {Group,Mesh,BoxGeometry,MeshBasicMaterial,Vector3} from "three";
import {backpackLayout} from "../lib/backpack-layout.ts";
import {BAG_CONTENT} from "../lib/secondary-config.ts";
import sharp from "sharp";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
assert.equal(BAG_CONTENT.length,6);assert.equal(new Set(BAG_CONTENT.map(i=>i.file)).size,6);
const manifest=JSON.parse(await readFile("public/images/backpack-icons/manifest.json","utf8"));
const avatar=await readFile("public/images/about-avatar-v3.png");
assert.equal(createHash("sha256").update(avatar).digest("hex"),manifest.avatar.sha256);
const meta=await sharp(avatar).metadata();assert.equal(meta.width,meta.height);
const bag=new Group();bag.position.set(-1.43,.02,.73);
const geo=new BoxGeometry(.45,.65,.22),mat=new MeshBasicMaterial(),mesh=new Mesh(geo,mat);mesh.position.y=.325;bag.add(mesh);
for(const small of [false,true]){
 const layout=backpackLayout(bag,small);
 assert.equal(layout.targets.length,6);
 for(const p of layout.targets){assert.ok(p.y>layout.origin.y);assert.ok(layout.bounds.containsPoint(p));assert.ok(p.distanceTo(layout.origin)>.3);}
 assert.ok(layout.bounds.containsPoint(mesh.getWorldPosition(new Vector3())));
}
for(const item of BAG_CONTENT){
 const m=await sharp("public/images/backpack-icons/"+item.file+".png").metadata();
 assert.ok(m.hasAlpha&&m.width>600&&m.height>600,"transparent high-resolution supplied icon");
 assert.ok(manifest.icons.some(i=>i.name===item.file));
}
geo.dispose();mat.dispose();
console.log("Six supplied icon files, alpha channels, avatar hash/aspect and world-space backpack bounds passed.");

const {backpackFlight,BACKPACK_ICON_SIZE}=await import("../lib/backpack-layout.ts");
const {backpackCameraTarget}=await import("../lib/backpack-focus.ts");
const {Quaternion,OrthographicCamera}=await import("three");
assert.ok(BACKPACK_ICON_SIZE/.4>=.55&&BACKPACK_ICON_SIZE/.4<=.65,"miniature hover scale");
for(const small of [false,true]){
 const layout=backpackLayout(bag,small),savedTargets=layout.targets.map(p=>p.toArray());
 assert.ok(new Set(layout.targets.map(p=>p.x.toFixed(3))).size>=5,"no fixed columns");
 assert.ok(new Set(layout.targets.map(p=>p.y.toFixed(3))).size>=5,"no fixed rows");
 layout.targets.forEach((target,i)=>{
  assert.ok(backpackFlight(layout.origin,target,0,i).distanceTo(layout.origin)<1e-9,"shared opening origin");
  assert.ok(backpackFlight(layout.origin,target,1,i).distanceTo(target)<1e-9,"path reaches fixed fan target");
  const early=backpackFlight(layout.origin,target,.18,i);
  assert.ok(early.y>layout.origin.y+.10,"initial rise");
  assert.ok(Math.abs(early.x-layout.origin.x)<.02,"spread follows initial rise");
  let lastY=layout.origin.y;
  for(let step=0;step<=20;step++){const p=backpackFlight(layout.origin,target,step/20,i);assert.ok(p.y>=lastY-1e-9);lastY=p.y;}
 });
 const home=new Vector3(0,3.450000047683716,8.5),q=new Quaternion(-.1566684991121292,0,0,.9876512885093689);
 const width=small?4.5:7.4,height=width/(small?390/764:1440/820);
 const framing=backpackCameraTarget(home,q,layout.bounds,width,height,1,small);
 assert.ok(framing.zoom>1);
 if(!small)assert.ok(framing.position.distanceTo(home)<.10,"default desktop focus avoids a composition shift");
 const camera=new OrthographicCamera(-width/2,width/2,height/2,-height/2,.1,300);
 camera.position.copy(framing.position);camera.quaternion.copy(q);camera.zoom=framing.zoom;camera.updateProjectionMatrix();camera.updateMatrixWorld();
 for(const p of layout.targets){const screen=p.clone().project(camera);assert.ok(Math.abs(screen.x)<.97&&Math.abs(screen.y)<.97,"focused fan remains in view");}
 assert.deepEqual(layout.targets.map(p=>p.toArray()),savedTargets,"focus does not reorganize icons");
}
console.log("Organic fan, rise-before-spread path, 60% scale and restrained shared-camera framing passed.");
