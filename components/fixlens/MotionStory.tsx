"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import Image from "next/image";
import { ImageZoomProvider } from "./NaturalImageZoom";
import { AssetFigure as Figure } from "./CaseStudyExperience";
import { fixlensAssets as A, type FixLensAsset } from "@/lib/fixlens-assets";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** Native scroll only. Server-rendered and reduced-motion compositions never depend on this effect. */
export function MotionExperience({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const wide = matchMedia("(min-width: 1000px) and (min-height: 650px)");
    const depths = Array.from(root.querySelectorAll<HTMLElement>("[data-depth-scene]"));
    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-scene]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!wide.matches || reduced.matches) return;
      for (const depth of depths) {
        const rect = depth.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top < innerHeight) depth.style.setProperty("--depth", String(clamp((innerHeight - rect.top) / (innerHeight + rect.height))));
      }
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();

        const p = clamp((90 - rect.top) / Math.max(1, rect.height - innerHeight + 90));
        scene.style.setProperty("--progress", String(p));
        scene.dataset.progress = p.toFixed(3);
        const range = scene.querySelector<HTMLInputElement>('input[type="range"]');
        // Manual controls own the reveal until the visitor scrolls again.
        if (range && scene.dataset.manual !== "true") {
          const value = Math.round(p * 100);
          range.value = String(value);
          scene.style.setProperty("--reveal", value + "%");
          range.setAttribute("aria-valuetext", value + "% Hi-fi revealed");
        }
        const track = scene.querySelector<HTMLElement>(".md-report-track");
        const windowEl = scene.querySelector<HTMLElement>(".md-report-window");
        if (track && windowEl) {
          track.style.transform = `translateX(${-p * Math.max(0, track.scrollWidth - windowEl.clientWidth)}px)`;
        }
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onScroll = () => {
      scenes.forEach(scene => { delete scene.dataset.manual; });
      schedule();
    };
    const configure = () => {
      root.dataset.motion = wide.matches && !reduced.matches ? "active" : "static";
      depths.forEach(depth => depth.style.removeProperty("--depth"));
      scenes.forEach(scene => {
        const range = scene.querySelector<HTMLInputElement>('input[type="range"]');
        if (range && (!wide.matches || reduced.matches)) {
          range.value = "100";
          range.setAttribute("aria-valuetext", "100% Hi-fi revealed");
          scene.style.setProperty("--reveal", "100%");
        }
        scene.style.removeProperty("--progress");
        const track = scene.querySelector<HTMLElement>(".md-report-track");
        if (track) track.style.removeProperty("transform");
      });
      schedule();
    };
    configure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    wide.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    const ro = new ResizeObserver(schedule);
    scenes.forEach(s => ro.observe(s));
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      wide.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
    };
  }, []);
  return <ImageZoomProvider><div ref={ref} className="md-experience">{children}</div></ImageZoomProvider>;
}

export function ChallengeScene() {
  return <div className="md-challenge" data-scroll-scene>
    <div className="md-sticky"><div className="md-challenge-stage"><svg className="md-connections" viewBox="0 0 1000 570" preserveAspectRatio="none" aria-hidden="true"><path d="M180 160 Q300 140 400 265 M820 160 Q700 140 600 265 M760 490 Q650 490 560 340" /></svg>
      <div className="md-case-core"><span>One maintenance case</span><strong>The whole picture.</strong><p>Description. Evidence. Next steps.</p><i aria-hidden="true" /></div>
      <div className="md-fragment md-fragment-a"><span>Description</span><strong>What is happening?</strong><p>Unclear details make an issue harder to understand.</p></div>
      <div className="md-fragment md-fragment-b"><span>Evidence</span><strong>Where is the context?</strong><p>Photos and messages can become disconnected.</p></div>
      <div className="md-fragment md-fragment-c"><span>Follow-up</span><strong>Who acts next?</strong><p>Responsibility and progress are not always clear.</p></div>
    </div><p className="md-scene-note">From fragmented information to connected context. An editorial interpretation of the research; not a tested interface.</p></div>
  </div>;
}

export function ScrollComparison({ mid, high, title, description }: { mid: FixLensAsset; high: FixLensAsset; title: string; description: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  return <div className="md-comparison" data-scroll-scene ref={ref}>
    <div className="md-sticky md-comparison-stage"><div className="md-comparison-copy"><p className="fx-kicker">Mid-fi to Hi-fi</p><h3>{title}</h3><p>{description}</p><p className="md-scroll-hint">Scroll to reveal. Or move the control.</p><label htmlFor={id}>Hi-fi reveal</label><input id={id} type="range" min="0" max="100" defaultValue="0" aria-valuetext="0% Hi-fi revealed" onInput={e => {
      const value = e.currentTarget.value;
      ref.current?.style.setProperty("--reveal", value + "%");
      if (ref.current) ref.current.dataset.manual = "true";
      e.currentTarget.setAttribute("aria-valuetext", value + "% Hi-fi revealed");
    }} /><div className="md-comparison-links"><a href={mid.src}>View Mid-fi</a><a href={high.src}>View complete Hi-fi</a></div></div>
    <div className="md-reveal-frame"><div className="md-static-label">Hi-fi</div><Image src={high.src} width={390} height={844} alt={high.alt} unoptimized className="md-hi-image" /><div className="md-mid-layer"><Image src={mid.src} width={390} height={844} alt={mid.alt} unoptimized /></div><span className="md-reveal-boundary" aria-hidden="true" /></div>
    <div className="md-static-mid"><span>Mid-fi</span><Figure asset={mid} /></div></div>
  </div>;
}

const steps = [
  { asset: A.propertyClean, title: "Confirm the context", text: "Start with the right property and contact details." },
  { asset: A.descriptionClean, title: "Describe the issue", text: "Explain what happened in your own words." },
  { asset: A.FX38, title: "Check the interpretation", text: "Review the structured summary. Correct what is wrong." },
  { asset: A.FX39, title: "Choose a safe path", text: "Establish whether approaching the area is safe." },
  { asset: A.FX41, title: "Prepare useful evidence", text: "Introduce the guided capture sequence." },
];

export function ReportingJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const go = (index: number) => {
    const root = ref.current;
    if (!root) return;
    if (root.closest('[data-motion="active"]')) {
      const top = root.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 90 + index / 4 * (root.offsetHeight - innerHeight + 90), behavior: "auto" });
    } else root.querySelectorAll<HTMLElement>(".md-report-step")[index]?.scrollIntoView({ block: "center", behavior: "auto" });
  };
  return <div className="md-report" data-scroll-scene ref={ref}><div className="md-sticky">
    <div className="md-report-heading"><div><p className="fx-kicker">The Hi-fi reporting journey</p><h3>A conversation, one step at a time.</h3></div><p>Property. Problem. Understanding. Safety. Evidence.</p></div>
    <div className="md-report-window"><div className="md-report-track">{steps.map((s, i) => <article className="md-report-step" key={s.title} onFocusCapture={() => go(i)}><header><span>0{i + 1}</span><div><h4>{s.title}</h4><p>{s.text}</p></div></header><Figure asset={s.asset} sizes="(max-width: 600px) 80vw, 260px" /></article>)}</div></div>
    <div className="md-report-controls" aria-label="Reporting step shortcuts">{steps.map((s, i) => <button type="button" key={s.title} onClick={() => go(i)} aria-label={"Show step " + (i + 1) + ": " + s.title}>{i + 1}</button>)}<span>Scroll through the journey · steps also available by keyboard</span></div>
  </div></div>;
}
