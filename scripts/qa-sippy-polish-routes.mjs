import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
const root=process.cwd(),out=process.env.SIPPY_QA_OUTPUT||path.join(root,fs.existsSync(path.join(root,'app'))?'docs/screenshots/sippy-phase-4b6':'previews');fs.mkdirSync(out,{recursive:true});
const url=process.env.SIPPY_TEST_URL||'http://127.0.0.1:3106/projects/sippy';
const profile=path.join(root,'.tools/sippy-4b6/chrome-smoke');fs.mkdirSync(profile,{recursive:true});const pf=path.join(profile,'DevToolsActivePort');try{fs.unlinkSync(pf)}catch{}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const child=spawn(process.env.SIPPY_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-background-timer-throttling','--disable-renderer-backgrounding',`--user-data-dir=${profile}`,'--remote-debugging-port=0','--no-first-run','--disable-extensions','--no-default-browser-check','--hide-scrollbars','about:blank'],{stdio:'ignore',windowsHide:true});
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
 const until=async expression=>{for(let i=0;i<100;i++){if(await ev(expression))return true;await wait(50)}return false};
 await S('Page.navigate',{url});await until('!!window.sippyState');
 await S('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await S('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 const keyboardSkip=await ev('document.activeElement.classList.contains("skip-link")');
 await ev('document.querySelector(".sp-back").click()');await until('location.pathname==="/projects"&&!!document.querySelector(".project-sippy-link")');const cleanup=await ev('!window.sippyState&&!document.querySelector(".sp-page")');
 await ev('document.querySelector(".project-fixlens-link").click()');const fixlens=await until('location.pathname==="/projects/fixlens"&&!!document.querySelector("#fixlens-title")');await shot('REGRESSION_FIXLENS.png');
 await ev('document.querySelector(".wordmark").click()');const home=await until('location.pathname==="/"&&!!document.querySelector(".home")');const canvasOrFallback=await until('!!document.querySelector(".workspace-canvas canvas,.workspace-fallback img")');await shot('REGRESSION_HOME.png');
 const model=await ev('fetch("/models/workspace_v3.glb").then(r=>r.status)');
 await ev('document.querySelectorAll(".site-header nav a")[1].click()');await until('location.pathname==="/projects"&&!!document.querySelector(".project-sippy-link")');await ev('document.querySelector(".project-sippy-link").click()');const returned=await until('!!window.sippyState&&!!document.querySelector(".sb-section")');
 const routes=[];for(const route of ['/about','/contact','/projects']){await S('Page.navigate',{url:new URL(route,url).href});await wait(450);routes.push(await ev('({route:location.pathname,main:!!document.querySelector("main"),overflow:document.documentElement.scrollWidth>innerWidth,title:document.title})'));await shot(`REGRESSION_${route.slice(1).toUpperCase()}.png`)}
 const result={routes,keyboardSkip,cleanup,fixlens,home,canvasOrFallback,modelHTTP:model,returned,errors};fs.writeFileSync(path.join(out,'REGRESSION_QA.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(!keyboardSkip||!cleanup||!fixlens||!home||!canvasOrFallback||model!==200||!returned||routes.some(x=>!x.main||x.overflow)||errors.length)process.exitCode=1;
 }finally{if(ws)ws.close();try{execFileSync('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore'})}catch{}}
