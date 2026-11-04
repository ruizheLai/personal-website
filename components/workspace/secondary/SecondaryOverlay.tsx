"use client";
import type {RefObject} from "react";
import {BAG_CONTENT,GRABBABLE_IDS,type SecondaryId,type GrabbableId} from "@/lib/secondary-config";
import type {SecondaryState} from "./useSecondaryInteractions";
export type SecondaryElements={
 anchors:Partial<Record<SecondaryId,HTMLDivElement|null>>;
 labels:(HTMLSpanElement|null)[];
 physics:Partial<Record<GrabbableId,HTMLDivElement|null>>;
 toast:HTMLDivElement|null;
};
export default function SecondaryOverlay({state,elements,enabled}:{state:SecondaryState;elements:RefObject<SecondaryElements>;enabled:boolean}){
 return <div className="secondary-overlays" data-bag-open={state.bagOpen} data-bag-focused={state.bagFocused} data-labels-visible={state.labelsVisible} data-physics-moving={state.physicsMoving} data-held={state.held??""} data-dragging={state.dragging}>
  {(["backpack","mug"] as const).map(id=><div key={id} ref={el=>{elements.current.anchors[id]=el;}} className="projected-object-control secondary-control">
   <button className="scene-focus-target" aria-label={id==="backpack"?"Focus skills and interests":"Coffee break"} aria-expanded={id==="backpack"?state.bagFocused:undefined} aria-controls={id==="backpack"?"backpack-content":undefined} disabled={!enabled||state.dragging||(id==="mug"&&state.bagFocused)} onClick={()=>state.activate(id)} onFocus={()=>{if(id==="mug")state.hover(id);}} onBlur={()=>state.hover(null)}/>
  </div>)}
  <div id="backpack-content" role="region" aria-label="Skills and interests" aria-hidden={!state.labelsVisible} className="backpack-labels">
   {BAG_CONTENT.map((item,i)=><span key={item.file} ref={el=>{elements.current.labels[i]=el;}} className={"backpack-label"+(state.labelsVisible?" is-visible":"")}>{item.label}</span>)}
  </div>
  {GRABBABLE_IDS.map(id=><div key={id} ref={el=>{elements.current.physics[id]=el;}} className="projected-object-control physics-control">
   <button className="scene-focus-target physical-focus-target" aria-label={id==="bin"?"Grab trash bin":"Grab paper "+id.slice(-1)} aria-describedby="grab-instructions" disabled={!enabled||state.bagFocused} onKeyDown={event=>state.physicsKeys.current?.(id,event.nativeEvent)}/>
  </div>)}
  <span id="grab-instructions" className="sr-only">Space or Enter grabs and releases. Arrows move; Shift and arrows rotate. Page Up and Page Down move in depth. Home stands the held object upright. Escape releases.</span>
  {state.held&&<div className="grab-hint" role="status">{state.keyboardGrab?<span>Arrows to move · Shift-arrows to rotate · Page Up/Down for depth · Home for upright · Space to release</span>:<><span className="grab-desktop">Drag to move · Shift-drag to rotate · Wheel for depth</span><span className="grab-touch">Drag to lift · Second finger to rotate</span></>}</div>}
  <div ref={el=>{elements.current.toast=el;}} className={"coffee-message"+(state.mugMessage&&enabled?" is-visible":"")} role="status">{state.mugMessage&&enabled?"Coffee break?":""}</div>
 </div>;
}
