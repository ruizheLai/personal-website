"use client";

import { useRef } from "react";
import { useStoryChapter } from "./useStoryChapter";
import { sippyMedia as M } from "@/lib/sippy-assets";

const stages = [
  { name: "Exploration", title: "Give the reminder a presence.", text: "Coffee Time explored bringing a break into view. Form studies centred the idea on an everyday cup." },
  { name: "Physical prototyping", title: "Make room for what is inside.", text: "The open grey shell reveals the balance between cup support, moving parts and electronic packaging." },
  { name: "Fabrication & assembly", title: "A working core. A softer exterior.", text: "Load-cell integration and the fur covering bring the functional structure and tactile character together." },
  { name: "Testing & iteration", title: "Connect the parts to the behaviour.", text: "Bench wiring and camera-preview tests show the system being brought together. Sensing, movement and cup stability remained important limits." },
  { name: "Final showcase", title: "A companion on the desk.", text: "Colourful fur and eyes give the working prototype its character, ready for people to encounter at the showcase." },
] as const;

function Photo({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  return <img src={`${M}${name.includes("/") ? name : `process/${name}`}.webp`} alt={alt} className={className} width={name == "showcase-focus" ? 390 : name == "showcase" ? 1024 : 768} height={name == "showcase-focus" ? 380 : name == "showcase" ? 576 : 1024} loading="lazy" />;
}
function ProcessVisual({ stage }: { stage: number }) {
  switch (stage) {
    case 0: return <div className="sm-visual sm-exploration"><img src={`${M}coffee-time.webp`} alt="Original Coffee Time alternative concept study" width="1000" height="1000" loading="lazy" /><Photo name="shell-study" alt="Original Sippy shell and cup-holder dimensional sketch" /></div>;
    case 1: return <div className="sm-visual sm-prototype"><Photo name="open-shell" alt="Authentic grey Sippy shells opened beside the cup holder and packed electronics" /><img src={`${M}grey-prototype.webp`} alt="Authentic grey Sippy prototype with its cup" width="1200" height="675" loading="lazy" className="sm-inset" /></div>;
    case 2: return <div className="sm-visual sm-assembly"><Photo name="loadcell-integration" alt="Load cell wired beside the circular chassis and controller during integration" /><Photo name="fur-fabrication" alt="The colourful fur covering on the workbench with scissors and a glue gun" /></div>;
    case 3: return <div className="sm-visual sm-testing"><Photo name="motor-bench" alt="ESP32, driver and a wired motor on the test bench" /><Photo name="gesture-test-still" alt="Camera-preview test with detected hand landmarks" className="sm-test-detail" /></div>;
    default: return <div className="sm-visual sm-showcase"><Photo name="showcase-focus" alt="Authentic colourful plush Sippy with its cup, cropped from the project showcase photograph" /><Photo name="showcase" alt="Wider context of the showcase prototype and its computer interface" className="sm-context" /></div>;
  }
}

export default function MakingStory() {
  const root = useRef<HTMLElement>(null);
  const { active } = useStoryChapter(root, "[data-making-step]");
  return <section ref={root} className="sp-evolution sm-section sp-wrap" aria-labelledby="idea-title" data-active-process={active}>
    <div className="sp-section-heading"><h2 id="idea-title">From Idea<br /><em>to Companion</em></h2><p>From a drawn idea to a physical companion. Sketches, prototypes and moments of making.</p></div>
    <div className="sm-story" data-story-track><div className="sm-composition">
      <div className="sm-desktop" data-story-screen>{stages.map((_, i) => <div className="sm-panel" data-scene-visual={i} key={i} aria-hidden={active !== i}><ProcessVisual stage={i} /></div>)}</div>
      <div className="sm-copy-area"><span className="sm-neighbour sm-before" aria-hidden="true">{active > 0 ? stages[active-1].name : ""}</span><div className="sm-steps" data-focus-window>{stages.map((stage, i) => <article key={stage.name} data-making-step={i} data-focus-copy={i} className={active === i ? "is-active" : ""}>
        <span className="sm-step-name">{stage.name}</span><h3>{stage.title}</h3><div className="sm-inline"><ProcessVisual stage={i} /></div><p>{stage.text}</p>
      </article>)}</div><span className="sm-neighbour sm-after" aria-hidden="true">{active < stages.length-1 ? stages[active+1].name : ""}</span></div>
    </div></div>
    <p className="sp-source-note">Original project studies and photographs; stages group related process evidence.</p>
  </section>;
}
