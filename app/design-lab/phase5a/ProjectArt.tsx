"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { fixlensAssets } from "@/lib/fixlens-assets";
import { projects, type Project } from "./content";

export default function ProjectArt({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);

  function follow(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const panel = event.currentTarget;
    const rect = panel.getBoundingClientRect();
    panel.style.setProperty("--dx", ((event.clientX - rect.left) / rect.width - .5) * 24 + "px");
    panel.style.setProperty("--dy", ((event.clientY - rect.top) / rect.height - .5) * 16 + "px");
  }

  function settle() {
    ref.current?.style.removeProperty("--dx");
    ref.current?.style.removeProperty("--dy");
  }

  return (
    <div className={`dl-art dl-art-${project}`} ref={ref} onPointerMove={follow} onPointerLeave={settle}>
      {project === "fixlens" ? (
        <>
          <Image className="dl-dashboard" {...fixlensAssets.FX02} unoptimized />
          <Image className="dl-phone" {...fixlensAssets.FX03} unoptimized />
        </>
      ) : (
        <Image className="dl-plush" src="/images/sippy/plush.webp" width={571} height={633} alt="Sippy’s colourful plush body, expressive eyes and upright cup" unoptimized />
      )}
    </div>
  );
}

export function ProjectIndex() {
  const [selected, setSelected] = useState<Project>("fixlens");
  const [hovered, setHovered] = useState<Project | null>(null);
  const active = hovered ?? selected;
  const project = projects[active];

  return (
    <div className="dl-index">
      <div className="dl-index-list" aria-label="Project previews">
        {(Object.keys(projects) as Project[]).map(key => (
          <button
            key={key}
            type="button"
            aria-pressed={selected === key}
            aria-controls="dl-project-preview"
            className={active === key ? "dl-index-active" : ""}
            onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(key); }}
            onPointerLeave={() => setHovered(null)}
            onClick={() => { setHovered(null); setSelected(key); }}
          >
            <span>{projects[key].name}</span><span aria-hidden="true">→</span>
          </button>
        ))}
        <div className="dl-index-future"><h3>WillDo</h3><span>In Development</span></div>
      </div>
      <Link id="dl-project-preview" href={project.href} className="dl-index-preview" aria-label={`Read the ${project.name} case study`}>
        <div key={active} className="dl-index-frame">
          <ProjectArt project={active} />
          <div className="dl-index-caption"><strong>{project.name}</strong><p>{project.description}</p><span aria-hidden="true">↗</span></div>
        </div>
      </Link>
      <noscript>
        <div className="dl-index-static">
          <a href={projects.fixlens.href}>Read the FixLens case study ↗</a>
          <a href={projects.sippy.href}>Read the Sippy case study ↗</a>
        </div>
      </noscript>
    </div>
  );
}
