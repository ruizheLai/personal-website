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
