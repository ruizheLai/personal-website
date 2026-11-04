import assert from "node:assert/strict";
import R from "@dimforge/rapier3d-compat";
import {Vector3,Quaternion} from "three";
import {BIN_PHYSICS as c,PAPER_SPECS,hollowBinWalls} from "../lib/trash-physics.ts";
import {grabVelocity,grabAngularVelocity,rotateBinFromPointer} from "../lib/grab-math.ts";
await R.init();
const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;
const bin=w.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(1.63,.001,.55).setLinearDamping(.9).setAngularDamping(1.6).setCcdEnabled(true).setAdditionalSolverIterations(6));
w.createCollider(R.ColliderDesc.cylinder(.013,.128).setTranslation(0,.013,0).setMass(c.massBottom).setFriction(.65),bin);
for(const v of hollowBinWalls())w.createCollider(R.ColliderDesc.convexHull(v).setMass(c.massWall).setFriction(.65),bin);
const fixed=w.createRigidBody(R.RigidBodyDesc.fixed());
for(const [size,pos] of [
[[8,.08,8],[0,c.floorY-.08,0]],
[[.04,2.2,1.4],[c.bounds.left,1.8,1.1]],[[.04,2.2,1.4],[c.bounds.right,1.8,1.1]],
[[.6,2.2,.04],[1.8,1.8,c.bounds.back]],[[.6,2.2,.04],[1.8,1.8,c.bounds.front]],[[.6,.04,1.4],[1.8,c.bounds.ceiling,1.1]]])
w.createCollider(R.ColliderDesc.cuboid(...size).setTranslation(...pos).setFriction(.85),fixed);
const papers=PAPER_SPECS.map(s=>{
 const b=w.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(1.63+s.x,.001+.026+s.radius,.55+s.z).setLinearDamping(1.1).setAngularDamping(2.3).setCcdEnabled(true).setAdditionalSolverIterations(6));
 w.createCollider(R.ColliderDesc.ball(s.radius).setMass(c.paperMass).setFriction(.8).setRestitution(.06),b);return b;
});
[bin,...papers].forEach(b=>b.recomputeMassPropertiesFromColliders());w.propagateModifiedBodyPositionsToColliders();
const advance=n=>{for(let i=0;i<n;i++)w.step();};
const local=p=>new Vector3().copy(p.translation()).sub(bin.translation()).applyQuaternion(new Quaternion().copy(bin.rotation()).invert());
advance(180);assert.ok(papers.every(p=>local(p).y<c.height&&Math.hypot(local(p).x,local(p).z)<.12),"papers start inside");
const initial=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),.3),actual=initial.clone();
rotateBinFromPointer(actual,37,83);
const previousShift=initial.clone().premultiply(new Quaternion().setFromAxisAngle(new Vector3(1,0,0),83*.012)).premultiply(new Quaternion().setFromAxisAngle(new Vector3(0,0,1),-37*.012));
assert.ok(actual.angleTo(previousShift)<1e-6,"normal drag exactly matches previous Shift rotation");
function drag(dx,dy){
 const anchor=new Vector3().copy(bin.translation()),rotation=new Quaternion().copy(bin.rotation()),originalAnchor=anchor.clone();
 [bin,...papers].forEach(b=>b.wakeUp());
 for(let i=0;i<60;i++){
  if(i<12)rotateBinFromPointer(rotation,dx/12,dy/12);
  bin.setLinvel(grabVelocity(bin.translation(),anchor),true);
  bin.setAngvel(grabAngularVelocity(bin.rotation(),rotation),true);w.step();
 }
 assert.deepEqual(anchor,originalAnchor,"pointer never moves the translation anchor");
}
drag(0,145);advance(600);
const outside=papers.filter(p=>{const v=local(p);return v.y>c.height||v.y<-.02||Math.hypot(v.x,v.z)>.19;}).length;
console.log(JSON.stringify({outside,bin:bin.translation(),up:new Vector3(0,1,0).applyQuaternion(bin.rotation()),papers:papers.map(p=>p.translation())}));
assert.ok(outside>=2,"passive paper spills naturally");
for(let i=0;i<20;i++){drag(i%2?45:-45,i%2?-65:65);advance(90);}
advance(360);
assert.equal(w.bodies.len(),6);assert.equal(w.colliders.len(),27);
assert.ok([bin,...papers].every(b=>Number.isFinite(b.translation().y)&&b.translation().y>-.02),"no floor escape after repeated tilt/release");
assert.ok(papers.every((p,i)=>p.translation().y-PAPER_SPECS[i].radius>c.floorY-.014),"passive papers settle at floor contact");
w.free();console.log("Exact legacy tilt mapping, fixed anchor, passive spill, repeat grabs and constant body counts passed.");
