import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
const root=process.cwd(),out=process.env.SIPPY_QA_OUTPUT||path.join(root,fs.existsSync(path.join(root,'app'))?'docs/screenshots/sippy-phase-4b4':'previews');fs.mkdirSync(out,{recursive:true});
const url=process.env.SIPPY_TEST_URL||'http://127.0.0.1:3104/projects/sippy';
const profile=path.join(root,'.tools/sippy-qa-profile');fs.mkdirSync(profile,{recursive:true});const pf=path.join(profile,'DevToolsActivePort');try{fs.unlinkSync(pf)}catch{}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const child=spawn(process.env.SIPPY_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new',`--user-data-dir=${profile}`,'--remote-debugging-port=0','--no-first-run','--disable-extensions','--no-default-browser-check','--hide-scrollbars','about:blank'],{stdio:'ignore',windowsHide:true});
let ws;const errors=[],results=[];let encoder;
try{
 let port;for(let i=0;i<150&&!port;i++){await wait(100);try{port=parseInt(fs.readFileSync(pf,'utf8'))}catch{}}if(!port)throw Error('Chrome failed to start');
 const v=await(await fetch(`http://127.0.0.1:${port}/json/version`)).json();ws=new WebSocket(v.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text)});
 const send=(method,params={},sessionId)=>new Promise(r=>{pending.set(++id,r);ws.send(JSON.stringify({id,method,params,sessionId}))});
 const{result:{targetId}}=await send('Target.createTarget',{url:'about:blank'});const{result:{sessionId}}=await send('Target.attachToTarget',{targetId,flatten:true});
 const S=async(m,p={})=>{const r=await send(m,p,sessionId);if(r.error)throw Error(JSON.stringify(r.error));return r.result};
 const ev=async(expression)=>{const r=await S('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
 await S('Page.enable');await S('Runtime.enable');
 const go=async y=>{await ev(`scrollTo(0,${y});new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);return await ev(`(()=>{const st=window.sippyState;return {state:st,overflow:document.documentElement.scrollWidth>innerWidth,loaded:[...document.querySelectorAll('.sp-part img,.sp-layer img')].every(x=>x.complete&&x.naturalWidth),bounds:[...document.querySelectorAll('.sp-part,.sp-layer')].filter(e=>Number(getComputedStyle(e).opacity)>.6).map(e=>{const b=e.getBoundingClientRect();return{id:e.id||e.dataset.structure,x:b.x,y:b.y,w:b.width,h:b.height}}),destinations:[...document.querySelectorAll('[data-dest]')].map(e=>{const b=e.getBoundingClientRect();return{id:e.dataset.dest,x:b.x+b.width/2,y:b.y+b.height/2,w:b.width,h:b.height}}),nodes:[...document.querySelectorAll('[data-component]')].length}})()`)};
 const shot=async name=>{const r=await S('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name),Buffer.from(r.data,'base64'))};
 for(const[width,height]of[[1440,900],[1024,768],[768,1024],[390,844],[375,812]]){
  await S('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});await S('Page.navigate',{url});
  for(let i=0;i<120;i++){await wait(50);if(await ev('!!window.sippyState&&[...document.querySelectorAll(".sp-part img,.sp-layer img")].every(x=>x.complete&&x.naturalWidth)'))break}
  const meta=await ev('window.sippyState');if(!meta)throw Error('Sippy effect did not initialise');const samples=[];
  for(const p of[0,.16,.26,.39,.48,.60,.65,.70,.76,.82,.89,.97]){const r=await go(meta.heroEnd*p);samples.push({requested:p,...r});if([1440,390].includes(width)&&[0,.26,.39,.48,.76,.97].includes(p))await shot(`${width}-hero-${Math.round(p*100)}.png`)}
  const baseline=await go(meta.heroEnd*.76);await go(meta.handEnd);await go(meta.heroEnd*.26);const reverse=await go(meta.heroEnd*.76);const reversible=JSON.stringify(baseline.state)===JSON.stringify(reverse.state);const stable=JSON.stringify(reverse.state);await wait(180);const paused=stable===JSON.stringify(await ev('window.sippyState'));
  const flights=[];for(const h of[.2,.5,.8,1]){const r=await go(meta.handoffStart+(meta.handEnd-meta.handoffStart)*h);flights.push({h,...r});if([1440,390].includes(width)&&[.5,1].includes(h))await shot(`${width}-construction-${h*100}.png`)}
  const arrived=flights.at(-1);const arrival=arrived.destinations.map(d=>({id:d.id,error:Math.hypot(arrived.state.poses[d.id][0]-d.x,arrived.state.poses[d.id][1]-d.y)}));
  const heroClips=samples.flatMap(s=>s.bounds.filter(b=>b.x<-.7||b.x+b.w>width+.7||b.y<-.7||b.y+b.h>height+.7).map(b=>({p:s.requested,...b})));
  const core=samples.find(s=>s.requested===.48);const coreHeld=core.state.coreOpacity===1&&Object.entries(core.state.alphas).filter(([id])=>!['central','upper','lower','plush','cup'].includes(id)).every(([,a])=>a===0);
  const noOverflow=[...samples,...flights].every(x=>!x.overflow),nodesStable=[...samples,...flights].every(x=>x.nodes===7&&JSON.stringify(x.state.nodeIds)===JSON.stringify(meta.nodeIds)),allLoaded=samples.every(x=>x.loaded);
  // Resize the same loaded page while mid-handoff: positions must remeasure, not retain old slots.
  await go(meta.handoffStart+(meta.handEnd-meta.handoffStart)*.5);await S('Emulation.setDeviceMetricsOverride',{width:width-20,height,deviceScaleFactor:1,mobile:width<600});await wait(80);const resized=await ev('window.sippyState');await go(resized.handEnd);const resizeError=await ev('Math.max(...[...document.querySelectorAll("[data-dest]")].map(e=>{const r=e.getBoundingClientRect(),a=window.sippyState.poses[e.dataset.dest];return Math.hypot(a[0]-r.left-r.width/2,a[1]-r.top-r.height/2)}))');await S('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});await wait(60);
  // Review each narrative section at its own native position; lazy images get time to load.
  if([1440,390].includes(width))for(const name of['sp-build','sp-action','sp-evolution','sp-evaluation','sp-reflection']){
   await ev(`document.querySelector('.${name}').scrollIntoView()`);await wait(name==='sp-evaluation'?750:150);await shot(`${width}-${name}.png`);
  }
  const videos=await ev('Promise.all([...document.querySelectorAll("video")].map(v=>new Promise(r=>{const done=()=>r({ready:v.readyState,duration:v.duration,width:v.videoWidth,height:v.videoHeight,audio:v.mozHasAudio||v.webkitAudioDecodedByteCount||0,muted:v.muted,autoplay:v.autoplay,controls:v.controls});v.addEventListener("loadeddata",done,{once:true});v.addEventListener("error",()=>r({error:true}),{once:true});v.preload="auto";v.load();if(v.readyState>=2)done()})))');
  const r={width,height,reversible,paused,nodesStable,noOverflow,allLoaded,coreHeld,heroClips,maxArrivalError:Math.max(...arrival.map(x=>x.error)),resizeError,videos,samples,flights};results.push(r);console.log(JSON.stringify({width,reversible,paused,nodesStable,noOverflow,allLoaded,coreHeld,heroClips:heroClips.length,maxArrivalError:r.maxArrivalError,resizeError,videos:videos.map(x=>x.ready)}));
 }
 await S('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await go(0);await shot('375-reduced.png');
 const reduced=await ev('({reduced:window.sippyState.reduced,heroHeight:document.querySelector(".sp-hero").offsetHeight,viewport:innerHeight,still:getComputedStyle(document.querySelector(".sp-still")).visibility,words:[...document.querySelectorAll(".sp-system-copy")].every(e=>getComputedStyle(e).opacity==="1")})');
 await S('Emulation.setEmulatedMedia',{features:[]});
 // No JavaScript must leave the full narrative and native component slots available.
 await S('Emulation.setScriptExecutionDisabled',{value:true});await S('Page.navigate',{url});await wait(300);await shot('375-no-javascript.png');await S('Emulation.setScriptExecutionDisabled',{value:false});
 await S('Emulation.setDeviceMetricsOverride',{width:1100,height:800,deviceScaleFactor:1,mobile:false});await S('Page.navigate',{url});await wait(500);const meta=await ev('window.sippyState');
 const ff=process.env.SIPPY_FFMPEG||'E:/Personal Website/.tools/video-review/node_modules/ffmpeg-static/ffmpeg.exe';encoder=spawn(ff,['-loglevel','error','-y','-f','image2pipe','-vcodec','mjpeg','-r','12','-i','-','-an','-c:v','libx264','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,'SIPPY_FORWARD_REVERSE.mp4')],{stdio:['pipe','ignore','pipe'],windowsHide:true});let encoderErrors='';encoder.stderr.on('data',x=>encoderErrors+=x);
 const end=await ev('document.querySelector(".sp-action").getBoundingClientRect().top+scrollY-120');
 for(let i=0;i<192;i++){if(i%48===0)console.log('Recording browser frame '+i+'/192');const t=i<96?i/95:(191-i)/95;await go(end*t);const s=await S('Page.captureScreenshot',{format:'jpeg',quality:83,captureBeyondViewport:false});if(!encoder.stdin.write(Buffer.from(s.data,'base64')))await new Promise(r=>encoder.stdin.once('drain',r))}encoder.stdin.end();await new Promise(r=>encoder.once('close',r));
 // Browser navigation out and back exercises effect cleanup and reinitialisation.
 await ev('document.querySelector(".sp-return").click()');
 for(let i=0;i<100;i++){await wait(50);if(await ev('location.pathname==="/projects"&&!!document.querySelector(".project-sippy-link")'))break}
 const projectsLink=await ev('location.pathname==="/projects"&&!!document.querySelector(".project-sippy-link")');
 await ev('document.querySelector(".project-sippy-link").click()');
 for(let i=0;i<100;i++){await wait(50);if(await ev('location.pathname==="/projects/sippy"&&!!window.sippyState'))break}
 const backInitialised=await ev('location.pathname==="/projects/sippy"&&!!window.sippyState');
 const result={results,reduced,errors,projectsLink,backInitialised,recording:{frames:192,fps:12,encoderErrors}};fs.writeFileSync(path.join(out,'BROWSER_QA.json'),JSON.stringify(result,null,2));
 const failed=results.some(r=>!r.reversible||!r.paused||!r.nodesStable||!r.noOverflow||!r.allLoaded||!r.coreHeld||r.heroClips.length||r.maxArrivalError>.8||r.resizeError>.8||r.videos.some(v=>v.ready<2||v.autoplay||!v.controls||!v.muted))||errors.length||!reduced.reduced||!reduced.words||!projectsLink||!backInitialised||encoderErrors;
 console.log(JSON.stringify({failed:!!failed,reduced,errors,projectsLink,backInitialised}));if(failed)process.exitCode=1;
}finally{if(ws)ws.close();try{execFileSync('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore'})}catch{}if(encoder&&!encoder.killed)try{encoder.kill()}catch{}}
