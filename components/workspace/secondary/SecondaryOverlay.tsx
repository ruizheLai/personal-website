"use client";
import type { RefObject } from "react";
import { BAG_CONTENT, SECONDARY_OBJECTS, type SecondaryId } from "@/lib/secondary-config";
import type { SecondaryState } from "./useSecondaryInteractions";
export type SecondaryElements = { anchors: Partial<Record<SecondaryId, HTMLDivElement | null>>; bag: HTMLDivElement | null; toast: HTMLDivElement | null; reset: HTMLDivElement | null };
const paths: Record<string, string> = {
  football: "M12 3 8 9l4 4 5-4-5-6M8 9l-5 2m9 2-1 7m6-11 4 3M6 18l5 2 6-2 4-6-3-6-6-3-6 3-3 5 3 7Z",
  running: "m14 4 2 2-2 2-2-2 2-2Zm-4 5 4 2 3-1m-7-1-2 5 5 2 1 5m-6-7-4 4m9-7-2 5",
  coffee: "M4 7h12v8a5 5 0 0 1-10 0V7Zm12 1h2a3 3 0 0 1 0 6h-2M3 21h16M8 3v1m4-1v1",
  printer: "M7 9V3h10v6M6 18H3V9h18v9h-3M7 14h10v7H7v-7Zm10-2h1",
  layout: "M3 4h18v16H3V4Zm0 5h18M9 9v11M6 6h.1",
  product: "m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10 9-5m-9 5L3 8m9 5v9m-5-17 10 6",
  spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z",
  code: "m8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 18",
};
export default function SecondaryOverlay({ state, elements, enabled }: { state: SecondaryState; elements: RefObject<SecondaryElements>; enabled: boolean }) {
  const labels = { backpack: "Open skills and interests", mug: "Coffee break", bin: "Tip trash bin" };
  return <div className="secondary-overlays" data-bag-open={state.bagOpen} data-bin-state={state.binPhase} data-dragging={state.dragging}>
    {(Object.keys(SECONDARY_OBJECTS) as SecondaryId[]).map(id => <div key={id} ref={element => { elements.current.anchors[id] = element; }} className="projected-object-control secondary-control">
      <button className="scene-focus-target" aria-label={labels[id]} aria-expanded={id === "backpack" ? state.bagOpen : undefined} aria-controls={id === "backpack" ? "backpack-content" : undefined} disabled={!enabled || (id === "bin" && state.binPhase !== "upright")} onClick={() => state.activate(id)} onFocus={() => { if (id !== "backpack") state.hover(id); }} onBlur={() => state.hover(null)}><span className="sr-only">{labels[id]}</span></button>
    </div>)}
    <div id="backpack-content" ref={element => { elements.current.bag = element; }} className={`bag-content ${state.bagOpen && enabled ? "is-open" : ""}`} role="region" aria-label="Skills and interests" aria-hidden={!state.bagOpen || !enabled} inert={!state.bagOpen || !enabled} onPointerEnter={state.keepBag} onPointerLeave={state.leaveBag}>
      {["Interests", "Skills"].map(group => <section key={group}><h2>{group}</h2><ul>{BAG_CONTENT.filter(item => item.group === group).map((item, index) => <li key={item.label} className="bag-token" style={{ "--stagger": `${index * 75 + 180}ms` } as React.CSSProperties}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[item.icon]} /></svg><span>{item.label}</span></li>)}</ul></section>)}
      <button className="bag-close" aria-label="Close skills and interests" onClick={() => { state.closeBag(); elements.current.anchors.backpack?.querySelector("button")?.focus(); }}>Close <span aria-hidden="true">×</span></button>
    </div>
    <div ref={element => { elements.current.toast = element; }} className={`coffee-message ${state.mugMessage && enabled ? "is-visible" : ""}`} role="status" aria-live="polite">{state.mugMessage && enabled ? "Coffee break?" : ""}</div>
    <div ref={element => { elements.current.reset = element; }} className="bin-reset" hidden={state.binPhase === "upright" || !enabled}><button onClick={state.resetBin} disabled={state.dragging}>Reset bin <span aria-hidden="true">↺</span></button><span className="sr-only" role="status">{state.binPhase === "settled" ? "Bin and paper have settled." : "Bin is moving."}</span></div>
  </div>;
}
