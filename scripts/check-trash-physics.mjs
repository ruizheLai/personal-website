import assert from "node:assert/strict";
import R from "@dimforge/rapier3d-compat";
import {Vector3,Quaternion} from "three";
import {BIN_PHYSICS as c,PAPER_SPECS,hollowBinWalls} from "../lib/trash-physics.ts";
import {grabVelocity,grabAngularVelocity,clampGrabTarget} from "../lib/grab-math.ts";
await R.init();
const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;
const bin=w.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(1.63,.001,.55).setLinearDamping(.9).setAngularDamping(1.6).setCcdEnabled(true).setAdditionalSolverIterations(6));
w.createCollider(R.ColliderDesc.cylinder(.013,.128).setTranslation(0,.013,0).setMass(c.massBottom).setFriction(.65),bin);
for(const v of hollowBinWalls())w.createCollider(R.ColliderDesc.convexHull(v).setMass(c.massWall).setFriction(.65),bin);
const fixed=w.createRigidBody(R.RigidBodyDesc.fixed());
for(const [size,pos] of [
[[8,.08,8],[0,c.floorY-.08,0]],
[[.04,2.2,1.4],[1.25,1.8,1.1]],[[.04,2.2,1.4],[2.35,1.8,1.1]],
[[.6,2.2,.04],[1.8,1.8,-.3]],[[.6,2.2,.04],[1.8,1.8,2.5]],[[.6,.04,1.4],[1.8,2.7,1.1]]])
w.createCollider(R.ColliderDesc.cuboid(...size).setTranslation(...pos).setFriction(.85),fixed);
const papers=PAPER_SPECS.map(s=>{
 const b=w.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(1.63+s.x,.001+.026+s.radius,.55+s.z).setLinearDamping(1.1).setAngularDamping(2.3).setCcdEnabled(true).setAdditionalSolverIterations(6));
 w.createCollider(R.ColliderDesc.ball(s.radius).setMass(c.paperMass).setFriction(.8).setRestitution(.06),b);return b;
});
[bin,...papers].forEach(b=>b.recomputeMassPropertiesFromColliders());w.propagateModifiedBodyPositionsToColliders();
const advance=n=>{for(let i=0;i<n;i++)w.step();};
const hold=(body,target,rotation=new Quaternion(),n=120)=>{
 clampGrabTarget(target);
 for(let i=0;i<n;i++){body.setLinvel(grabVelocity(body.translation(),target),true);body.setAngvel(grabAngularVelocity(body.rotation(),rotation),true);w.step();}
};
const localPaper=p=>new Vector3().copy(p.translation()).sub(bin.translation()).applyQuaternion(new Quaternion().copy(bin.rotation()).invert());
advance(180);
assert.ok(papers.every(p=>localPaper(p).y<c.height&&Math.hypot(localPaper(p).x,localPaper(p).z)<.12),"upright containment");
hold(bin,new Vector3(1.75,.8,.85));
assert.ok(bin.translation().y>.7,"bin lifts");
hold(bin,new Vector3(1.75,.65,.85),new Quaternion().setFromAxisAngle(new Vector3(1,0,0),1.8),180);
advance(360);
let outside=papers.filter(p=>{const v=localPaper(p);return v.y>c.height||v.y<-.02||Math.hypot(v.x,v.z)>.19;}).length;
assert.ok(outside>=2,"paper spills naturally without scripted impulse");
hold(bin,new Vector3(1.75,.8,.85));
hold(bin,new Vector3(1.75,.015,.85));
advance(240);
assert.ok(new Vector3(0,1,0).applyQuaternion(bin.rotation()).y>.97,"fallen bin re-grabbed and stood upright");
const b=bin.translation(),paper=papers[0];
hold(paper,new Vector3(paper.translation().x,.9,paper.translation().z));
hold(paper,new Vector3(b.x,.85,b.z));
hold(paper,new Vector3(b.x,.52,b.z));
advance(300);
const returned=localPaper(paper);
assert.ok(returned.y>.02&&returned.y<c.height-.03&&Math.hypot(returned.x,returned.z)<.11,"paper reinserted through hollow opening");
const count=w.bodies.len(),colliders=w.colliders.len();
for(let i=0;i<20;i++){
 hold(bin,new Vector3(1.75,.4,.85),new Quaternion(),30);
 hold(bin,new Vector3(1.75,.015,.85),new Quaternion(),30);
 advance(30);
}
assert.equal(w.bodies.len(),count);assert.equal(w.colliders.len(),colliders);
assert.equal(count,6);assert.equal(colliders,27);
advance(360);
assert.ok(papers.every((p,i)=>p.translation().y-PAPER_SPECS[i].radius>c.floorY-.012),"floor containment");
assert.ok(grabAngularVelocity(new Quaternion(),new Quaternion(0,0,0,-1)).length()<1e-5,"equivalent quaternion has no spurious spin");
console.log(JSON.stringify({outsideAfterTip:outside,returnedPaper:returned,bodies:count,colliders,repeatedGrabs:40,upright:new Vector3(0,1,0).applyQuaternion(bin.rotation()).y}));
w.free();console.log("Dynamic lift, natural spill, re-grab, stand upright, paper return and bounded object counts passed.");
