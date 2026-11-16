"use client";

import { useRef } from "react";
import { useStoryChapter } from "./useStoryChapter";
import { sippyMedia as M } from "@/lib/sippy-assets";

const stages = [
  { name: "Exploration", title: "What if the reminder had a presence?", text: "Coffee Time explored bringing a break into view. Cup-holder and shell studies considered the everyday object at its centre. " },
  { name: "Physical prototyping", title: "Making room for a cup, and everything beneath it.", text: "The open grey prototype shows how the cup holder, platforms, wheels and electronics share a compact body. The photographs make the packaging decisions visible." },
  { name: "Fabrication & assembly", title: "A working structure meets a softer exterior.", text: "Load-cell and chassis integration sit alongside the making of the fur covering. " },
  { name: "Testing & iteration", title: "Bring the whole system onto the bench.", text: "Motor wiring, an open chassis and a camera-preview test connect the parts to their behaviour. The report flags sensing, movement, cup stability and gestures on crowded desks as limits. " },
  { name: "Final showcase", title: "The companion takes its place on the desk.", text: "Colourful fur and eyes give the exhibition version its character. This is the real prototype behind the reconstructed hero, with its physical build and computer-based interaction brought together." },
] as const;

function Photo({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  return <img src={`${M}${name.includes("/") ? name : `process/${name}`}.webp`} alt={alt} className={className} width="768" height="1024" loading="lazy" />;
}
function ProcessVisual({ stage }: { stage: number }) {
  switch (stage) {
    case 0: return <div className="sm-visual sm-exploration"><img src={`${M}coffee-time.webp`} alt="Original Coffee Time alternative concept study" width="1000" height="1000" loading="lazy" /><Photo name="shell-study" alt="Original Sippy shell and cup-holder dimensional sketch" /></div>;
    case 1: return <div className="sm-visual sm-prototype"><Photo name="open-shell" alt="Authentic grey Sippy shells opened beside the cup holder and packed electronics" /><Photo name="plush-assembly" alt="Cup-holder platform and visible internals seated in the plush-covered lower shell" className="sm-inset" /></div>;
    case 2: return <div className="sm-visual sm-assembly"><Photo name="loadcell-integration" alt="Load cell wired beside the circular chassis and controller during integration" /><Photo name="fur-fabrication" alt="The colourful fur covering on the workbench with scissors and a glue gun" /></div>;
    case 3: return <div className="sm-visual sm-testing"><Photo name="motor-bench" alt="ESP32, driver and a wired motor on the test bench" /><Photo name="bench-test" alt="Open chassis and controller connected beside a laptop in a bench-test setup" /><Photo name="gesture-test-still" alt="Authentic test-video still showing a laptop camera preview with detected hand landmarks" className="sm-test-detail" /></div>;
    default: return <div className="sm-visual sm-showcase"><Photo name="showcase" alt="Authentic final plush Sippy and laptop camera interface at the project showcase" /><span>From a working prototype<br />to a small presence.</span></div>;
  }
}

export default function MakingStory() {
  const root = useRef<HTMLElement>(null);
  const { active } = useStoryChapter(root, "[data-making-step]");
  return <section ref={root} className="sp-evolution sm-section sp-wrap" aria-labelledby="idea-title" data-active-process={active}>
    <div className="sp-section-heading"><h2 id="idea-title">From Idea<br /><em>to Companion</em></h2><p>Sketches, open shells, wires and fur. The making of a physical companion, through authentic process evidence.</p></div>
    <div className="sm-story">
      <div className="sm-desktop" data-story-screen><div className="sm-panel" key={active}><ProcessVisual stage={active} /></div><p className="sm-stage-name">{stages[active].name}</p></div>
      <div className="sm-steps">{stages.map((stage, i) => <article key={stage.name} data-making-step={i} className={active === i ? "is-active" : ""}>
        <span className="sm-step-name">{stage.name}</span><h3>{stage.title}</h3><div className="sm-inline"><ProcessVisual stage={i} /></div><p>{stage.text}</p>
      </article>)}</div>
    </div>
    <p className="sp-source-note">Process stages group related evidence. File timestamps are not treated as creation dates, and the photographs do not establish an exact chronology or measured reliability.</p>
  </section>;
}
