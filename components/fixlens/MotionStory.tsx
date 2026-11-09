"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import Image from "next/image";
import { ImageZoomProvider } from "./NaturalImageZoom";
import { AssetFigure as Figure } from "./CaseStudyExperience";
import { fixlensAssets as A, type FixLensAsset } from "@/lib/fixlens-assets";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const TOP = 90;
const JOURNEY_END_HOLD = 180;

/** Scroll is never intercepted. Unenhanced and reduced-motion content is a complete static story. */
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
        if (rect.bottom >= 0 && rect.top < innerHeight) {
          depth.style.setProperty("--depth", String(clamp((innerHeight - rect.top) / (innerHeight + rect.height))));
        }
      }
      for (const scene of scenes) {
        const track = scene.querySelector<HTMLElement>(".md-report-track");
        const viewport = scene.querySelector<HTMLElement>(".md-report-window");
        const travel = track && viewport ? Math.max(0, track.scrollWidth - viewport.clientWidth) : 0;
        if (track) {
          // The scroll distance follows the actual track, including the wider safety branch.
          const distance = Math.round(Math.max(innerHeight * 1.5, travel * .72));
          if (scene.style.getPropertyValue("--journey-distance") !== distance + "px") {
            scene.style.setProperty("--journey-distance", distance + "px");
          }
        }
        const rect = scene.getBoundingClientRect();
        const duration = Math.max(1, rect.height - innerHeight + TOP - (track ? JOURNEY_END_HOLD : 0));
        const progress = clamp((TOP - rect.top) / duration);
        scene.style.setProperty("--progress", String(progress));
        scene.dataset.progress = progress.toFixed(3);
        const range = scene.querySelector<HTMLInputElement>('input[type="range"]');
        if (range && scene.dataset.manual !== "true") {
          const percent = Math.round(progress * 100);
          range.value = String(percent);
          scene.style.setProperty("--reveal", percent + "%");
          scene.dataset.reveal = String(percent);
          range.setAttribute("aria-valuetext", percent + "% Hi-fi revealed");
        }
        if (track && viewport) {
          viewport.scrollLeft = 0;
          track.style.transform = `translateX(${-progress * travel}px)`;
        }
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onScroll = schedule;
    const releaseManual = () => {
      scenes.forEach(scene => { if (scene.dataset.scrubbing !== "true") delete scene.dataset.manual; });
    };
    const onWheel = (event: WheelEvent) => { if (event.deltaY) releaseManual(); };
    const onTouchMove = () => releaseManual();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("input,textarea,select,[contenteditable=true]")) return;
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) releaseManual();
    };
    const onScrollbar = (event: PointerEvent) => {
      if (event.clientX >= document.documentElement.clientWidth) releaseManual();
    };
    const configure = () => {
      root.dataset.motion = wide.matches && !reduced.matches ? "active" : "static";
      root.dataset.comparison = reduced.matches ? "static" : "interactive";
      depths.forEach(depth => depth.style.removeProperty("--depth"));
      scenes.forEach(scene => {
        delete scene.dataset.manual;
        delete scene.dataset.scrubbing;
        scene.style.removeProperty("--progress");
        const range = scene.querySelector<HTMLInputElement>('input[type="range"]');
        if (range) {
          range.value = "0";
          range.setAttribute("aria-valuetext", "0% Hi-fi revealed");
          scene.style.setProperty("--reveal", "0%");
          scene.dataset.reveal = "0";
        }
        scene.querySelector<HTMLElement>(".md-report-track")?.style.removeProperty("transform");
      });
      schedule();
    };
    configure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onScrollbar, { passive: true });
    wide.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    const observer = new ResizeObserver(schedule);
    scenes.forEach(scene => observer.observe(scene));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onScrollbar);
      wide.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
    };
  }, []);
  return <ImageZoomProvider><div ref={ref} className="md-experience">{children}</div></ImageZoomProvider>;
}

export function ChallengeScene() {
  return <div className="md-challenge" data-scroll-scene><div className="md-sticky">
    <div className="md-challenge-stage">
      <svg className="md-connections" viewBox="0 0 1000 570" preserveAspectRatio="none" aria-hidden="true"><path d="M180 160 Q300 140 400 265 M820 160 Q700 140 600 265 M760 490 Q650 490 560 340" /></svg>
      <div className="md-case-core"><span>One maintenance case</span><strong>The whole picture.</strong><p>Description. Evidence. Next steps.</p><i aria-hidden="true" /></div>
      <div className="md-fragment md-fragment-a"><span>Description</span><strong>What is happening?</strong><p>Unclear details make an issue harder to understand.</p></div>
      <div className="md-fragment md-fragment-b"><span>Evidence</span><strong>Where is the context?</strong><p>Photos and messages can become disconnected.</p></div>
      <div className="md-fragment md-fragment-c"><span>Follow-up</span><strong>Who acts next?</strong><p>Responsibility and progress are not always clear.</p></div>
    </div>
  </div></div>;
}

export function ScrollComparison({ mid, high, title, description }: { mid: FixLensAsset; high: FixLensAsset; title: string; description: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const release = () => { if (ref.current) delete ref.current.dataset.scrubbing; };
  const keepStageVisible = () => {
    const root = ref.current;
    const stage = root?.querySelector<HTMLElement>(".md-sticky");
    if (!root || !stage || !root.closest('[data-motion="active"]')) return;
    const rect = stage.getBoundingClientRect();
    if (rect.top >= TOP - 1 && rect.bottom <= innerHeight) return;
    const top = root.getBoundingClientRect().top + scrollY;
    const progress = Math.min(.85, Number(root.dataset.progress) || 0);
    window.scrollTo({ top: top - TOP + progress * (root.offsetHeight - innerHeight + TOP), behavior: "auto" });
  };

  return <div className="md-comparison" data-scroll-scene ref={ref}>
    <div className="md-sticky md-comparison-stage">
      <div className="md-comparison-copy"><p className="fx-kicker">Mid-fi to Hi-fi</p><h3>{title}</h3><p>{description}</p></div>
      <div className="md-comparison-visual">
        <div className="md-reveal-frame"><div className="md-static-label">Hi-fi</div><Image src={high.src} width={390} height={844} alt={high.alt} unoptimized /><div className="md-mid-layer"><Image src={mid.src} width={390} height={844} alt={mid.alt} unoptimized /></div><span className="md-reveal-boundary" aria-hidden="true" /></div>
        <div className="md-compare-control"><label className="sr-only" htmlFor={id}>{title} Hi-fi reveal</label><input id={id} type="range" min="0" max="100" defaultValue="0" aria-valuetext="0% Hi-fi revealed"
          onFocus={event => { if (event.currentTarget.matches(":focus-visible")) keepStageVisible(); }}
          onPointerDown={() => { if (ref.current) ref.current.dataset.scrubbing = "true"; }} onPointerUp={release} onPointerCancel={release} onBlur={release}
          onInput={event => {
            keepStageVisible();
            const value = event.currentTarget.value;
            if (ref.current) {
              ref.current.style.setProperty("--reveal", value + "%");
              ref.current.dataset.reveal = value;
              ref.current.dataset.manual = "true";
            }
            event.currentTarget.setAttribute("aria-valuetext", value + "% Hi-fi revealed");
          }} /><div aria-hidden="true"><span>Mid-fi</span><span>Hi-fi</span></div></div>
      </div>
      <div className="md-static-mid"><span>Mid-fi</span><Image src={mid.src} width={390} height={844} alt={mid.alt} unoptimized /></div>
    </div>
  </div>;
}

const steps = [
  { asset: A.propertyClean, title: "Confirm property & contact" },
  { asset: A.descriptionClean, title: "Describe the issue" },
  { asset: A.FX38, title: "Check the structured summary" },
  { asset: A.FX39, title: "Choose a safe path", safety: true },
  { asset: A.FX41, title: "Prepare the capture" },
  { asset: A.captureOverview, title: "Capture the overview" },
  { asset: A.overviewReview, title: "Review & annotate" },
  { asset: A.captureCloseup, title: "Capture the detail" },
  { asset: A.closeupReview, title: "Check the close-up" },
  { asset: A.evidenceReady, title: "Evidence ready" },
  { asset: A.reportReviewHifi, title: "Review the report" },
  { asset: A.reportSubmittedHifi, title: "Report submitted" },
];

export function ReportingJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const alignKeyboardFocus = (index: number) => {
    const root = ref.current;
    const viewport = root?.querySelector<HTMLElement>(".md-report-window");
    const track = root?.querySelector<HTMLElement>(".md-report-track");
    const step = track?.children[index] as HTMLElement | undefined;
    if (!root || !viewport || !track || !step || !root.closest('[data-motion="active"]')) return;
    viewport.scrollLeft = 0;
    const travel = track.scrollWidth - viewport.clientWidth;
    const progress = travel > 0 ? clamp((step.offsetLeft + step.offsetWidth / 2 - viewport.clientWidth / 2) / travel) : 0;
    const top = root.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top - TOP + progress * (root.offsetHeight - innerHeight + TOP - JOURNEY_END_HOLD), behavior: "auto" });
  };
  return <div className="md-report" data-scroll-scene ref={ref}><div className="md-sticky">
    <div className="md-report-heading"><div><p className="fx-kicker">The Hi-fi reporting journey</p><h3>From first detail to submission.</h3></div></div>
    <div className="md-report-window"><ol className="md-report-track">{steps.map((step, index) => <li className={"md-report-step" + ("safety" in step ? " md-report-safety" : "")} key={step.asset.src}
      onFocusCapture={event => { if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) alignKeyboardFocus(index); }}>
      <h4>{step.title}</h4><div className="md-report-images"><Figure asset={step.asset} sizes="(max-width: 600px) 80vw, 290px" />
        {"safety" in step && <aside className="md-safety-branch"><p>Alternative: danger reported</p><Figure asset={A.FX40} sizes="(max-width: 600px) 140px, 175px" /><p>Stop unsafe capture.</p></aside>}
      </div></li>)}</ol></div>
  </div></div>;
}
