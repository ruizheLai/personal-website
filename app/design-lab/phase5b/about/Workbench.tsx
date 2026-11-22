"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { fixlensAssets } from "@/lib/fixlens-assets";

const evidence = [
  {
    id: "design", label: "Design", question: "What needs to be clearer?", title: "Give a task a clear shape.",
    text: "In FixLens, a repair has to make sense to the person reporting it and the person who acts on it.",
    image: fixlensAssets.FX02.src, alt: "FixLens maintenance dashboard", width: 1404, height: 570,
    href: "/projects/fixlens", project: "FixLens",
  },
  {
    id: "technology", label: "Technology", question: "How should it respond?", title: "Connect sensing to action.",
    text: "Sippy turns a gesture into a movement. That link between sensing and behaviour is part of what draws me to interactive technology and AI.",
    image: "/images/sippy/structure-only.webp", alt: "Sippy’s actual internal assembly", width: 400, height: 450,
    href: "/projects/sippy", project: "Sippy",
  },
  {
    id: "interaction", label: "Interaction", question: "What does the user notice?", title: "Make the response perceptible.",
    text: "Sippy explores a reminder that approaches in the physical workspace. A movement can make an interaction felt.",
    image: "/images/sippy/process/gesture-test-still.webp", alt: "Camera-preview test with hand landmarks detected", width: 360, height: 490,
    href: "/projects/sippy", project: "Sippy",
  },
  {
    id: "making", label: "Making", question: "What can I learn by building?", title: "Work it out at actual scale.",
    text: "An open prototype makes the trade-offs between the cup, shell and electronics easier to see.",
    image: "/images/sippy/process/open-shell.webp", alt: "An open grey Sippy shell beside a prototype cup holder and electronics", width: 468, height: 832,
    href: "/projects/sippy", project: "Sippy",
  },
] as const;

export default function Workbench() {
  const [active, setActive] = useState(0);
  const item = evidence[active];

  return (
    <section className="pb-board" aria-label="Working methods and project evidence" data-active={item.id}>
      <div className="pb-board-head">
        <span className="pb-mono"><i /> The workbench</span>
        <span className="pb-mono">Select a discipline</span>
      </div>
      <div className="pb-circuit">
        <div className="pb-traces" aria-hidden="true">{evidence.map(method => <i key={method.id} className={`pb-trace pb-trace-${method.id}`} />)}</div>
        <div className="pb-terminals" role="group" aria-label="Working disciplines">
          {evidence.map((method, index) => (
            <button key={method.id} type="button" className={`pb-terminal pb-terminal-${method.id}`} onClick={() => setActive(index)} aria-pressed={active === index} aria-controls="pb-evidence">
              <i aria-hidden="true" />
              <span><strong>{method.label}</strong><small>{method.question}</small></span>
            </button>
          ))}
        </div>
        <div className={`pb-evidence-viewport pb-evidence-${item.id}`} aria-hidden="true">
          <div className="pb-evidence-pins"><i /><i /><i /><i /></div>
          <Image key={item.id} src={item.image} alt="" width={item.width} height={item.height} unoptimized />
        </div>
      </div>
      <div id="pb-evidence" className="pb-evidence-readout">
        <div aria-live="polite">
          <h2>{item.title}</h2>
          <p>{item.text}</p>
          <p className="sr-only">Shown here: {item.alt}</p>
        </div>
        <Link href={item.href}>See {item.project} <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
