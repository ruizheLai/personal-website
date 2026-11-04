import assert from 'node:assert/strict';
import {placeFloatingContent} from '../lib/floating-layout.ts';
const intersects=(a,b)=>a.left<b.left+b.width&&a.left+a.width>b.left&&a.top<b.top+b.height&&a.top+a.height>b.top;
for(const viewport of [{width:1440,height:820},{width:390,height:768}]){
 const width=284,height=224;
 const anchor=viewport.width>768?{left:400,top:450,width:100,height:150}:{left:40,top:360,width:65,height:90};
 const obstacles=viewport.width>768?[{left:635,top:250,width:170,height:100},{left:500,top:180,width:110,height:110}]:[{left:145,top:260,width:105,height:75}];
 for(const offset of [0,40,-30]){
  const p=placeFloatingContent({...anchor,left:anchor.left+offset},width,height,viewport,obstacles);
  assert.ok(p.left>=14&&p.top>=14);
  assert.ok(p.left+width<=viewport.width-14&&p.top+height<=viewport.height-14);
  assert.ok(obstacles.every(o=>!intersects({...p,width,height},o)),'content avoids primary surfaces');
 }
}
console.log('Desktop/mobile floating content clamp and primary-surface avoidance passed.');