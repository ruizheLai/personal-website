import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Vector3,Quaternion} from 'three';
import {BIN_PHYSICS as c,PAPER_SPECS,hollowBinWalls,kickBin,releasePaper,resetBody} from '../lib/trash-physics.ts';
await R.init();
function validate(warmupSteps) {
const w=new R.World({x:0,y:-9.81,z:0});
w.timestep=1/60;
const bin=w.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(1.63,.001,.55).setLinearDamping(c.linearDamping).setAngularDamping(c.angularDamping).setCcdEnabled(true).setAdditionalSolverIterations(4));
w.createCollider(R.ColliderDesc.cylinder(.013,.128).setTranslation(0,.013,0).setMass(c.massBottom).setFriction(.8).setRestitution(.05),bin);
for(const v of hollowBinWalls())w.createCollider(R.ColliderDesc.convexHull(v).setMass(c.massWall).setFriction(.8).setRestitution(.05),bin);
const fixed=w.createRigidBody(R.RigidBodyDesc.fixed());
for(const [size,pos] of [
[[10,.05,10],[0,c.floorY-.05,0]],
[[.01,.6,1],[c.bounds.left,.3,.85]],
[[.01,.6,1],[c.bounds.right,.3,.85]],
[[.43,.6,.01],[1.8,.3,c.bounds.back]],
[[.43,.6,.01],[1.8,.3,c.bounds.front]]])
w.createCollider(R.ColliderDesc.cuboid(...size).setTranslation(...pos).setFriction(.9).setRestitution(.05),fixed);
const positions=PAPER_SPECS.map(s=>({x:1.63+s.x,y:.001+.026+s.radius,z:.55+s.z}));
const papers=PAPER_SPECS.map((s,i)=>{
 const b=w.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(...Object.values(positions[i])).setLinearDamping(1.1).setAngularDamping(2.3).setCcdEnabled(true).setAdditionalSolverIterations(4));
 w.createCollider(R.ColliderDesc.ball(s.radius).setMass(c.paperMass).setFriction(.85).setRestitution(.08),b);return b;
});
[bin,...papers].forEach(b=>b.recomputeMassPropertiesFromColliders());
w.propagateModifiedBodyPositionsToColliders();
for(let i=0;i<warmupSteps;i++)w.step();
assert.ok(Math.abs(bin.translation().x-1.63)<.01,'upright remains stable');
kickBin(bin);
let released=false,minBottom=Infinity;
for(let i=0;i<1200;i++){
 const up=new Vector3(0,1,0).applyQuaternion(bin.rotation());
 if(!released&&up.y<.3){papers.forEach((p,j)=>releasePaper(p,j,up));released=true;}
 w.step();
 for(let j=0;j<papers.length;j++)minBottom=Math.min(minBottom,papers[j].translation().y-PAPER_SPECS[j].radius);
}
const inv=new Quaternion().copy(bin.rotation()).invert();
const outside=papers.filter(p=>{const v=new Vector3().copy(p.translation()).sub(bin.translation()).applyQuaternion(inv);return v.y>c.height||v.y<-.02||Math.hypot(v.x,v.z)>.19;}).length;
const speeds=[bin,...papers].map(p=>Math.hypot(...Object.values(p.linvel())));
console.log(JSON.stringify({released,outside,minBottom,speeds,bin:bin.translation(),up:new Vector3(0,1,0).applyQuaternion(bin.rotation())}));
assert.ok(released,'bin tips past spill angle');
assert.ok(outside>=3,'at least 3 papers escape');
assert.ok(minBottom>c.floorY-.012,'paper stays above floor tolerance');
assert.ok(speeds.every(s=>s<.045),'bodies settle');
resetBody(bin,{x:1.63,y:.001,z:.55});
papers.forEach((p,i)=>resetBody(p,positions[i]));
for(const p of [bin,...papers])assert.deepEqual({...p.linvel()},{x:0,y:0,z:0});
assert.equal(bin.translation().y,Math.fround(.001));
w.free(); }
validate(0); validate(180); console.log('Hollow bin containment, spill, floor contact, settling, and reset passed.');
