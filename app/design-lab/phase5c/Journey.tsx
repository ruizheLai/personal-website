"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import WorkspaceHero from "@/components/workspace/WorkspaceHero";
import type { JourneyDriver } from "@/components/workspace/journey";
import type { InteractionId } from "@/lib/workspace-config";

const mediaQuery = "(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
const chapters = [
  { id: "home", label: "Ruizhe Lai", at: 0 },
  { id: "projects", label: "Projects", at: .9 },
  { id: "about", label: "About", at: 3.91 },
  { id: "contact", label: "Contact", at: 5.52 },
] as const;
const panelsOrder = ["projects", "sippy", "willdo", "about", "contact"] as const;
const surfaces: InteractionId[] = ["projects", "projects", "projects", "about", "contact"];
const visits = [
  { id: "projects", start: .22, enter: .9, leave: 2.56, end: 3.24 },
  { id: "about", start: 3.29, enter: 3.91, leave: 4.35, end: 4.97 },
  { id: "contact", start: 5.02, enter: 5.52, leave: 6, end: 6.5 },
] as const;
const steps = [.9, 1.58, 2.26];
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => { const t = clamp(x); return t * t * (3 - 2 * t); };

export default function Journey({ panels }: { panels: ReactNode[] }) {
  const track = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const layers = useRef<Array<HTMLElement | null>>([]);
  const initialAnchor = useRef(false);
  const pendingFocus = useRef<string | null>(null);
  const blend = useRef<number[]>([]);
  const [cinematic, setCinematic] = useState(false);
  const [sceneLocked, setSceneLocked] = useState(false);
  const [chapter, setChapter] = useState<string>("home");
  const [panel, setPanel] = useState(-1);
  const [driver] = useState<JourneyDriver>(() => ({
    pose: null,
    project(id, rect) {
      if (driver.pose?.id !== id || !viewport.current) return;
      const view = viewport.current.getBoundingClientRect();
      for (let i = 0; i < surfaces.length; i++) {
        if (surfaces[i] !== id || (blend.current[i] ?? 1) >= 1) continue;
        const expansion = 1 - blend.current[i];
        const left = Math.max(0, rect.left - view.left) * expansion;
        const top = Math.max(0, rect.top - view.top) * expansion;
        const right = Math.max(0, view.right - rect.left - rect.width) * expansion;
        const bottom = Math.max(0, view.bottom - rect.top - rect.height) * expansion;
        layers.current[i]?.style.setProperty("--crop", `inset(${top}px ${right}px ${bottom}px ${left}px round ${12 * expansion}px)`);
      }
    },
  }));

  const go = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const hash = id === "home" ? location.pathname : "#" + id;
    if ((id === "home" && location.hash) || (id !== "home" && location.hash !== hash)) {
      history.pushState(null, "", hash);
    }
    pendingFocus.current = id;
    target.scrollIntoView({ behavior: "instant", block: "start" });
    if (!matchMedia(mediaQuery).matches || id === "home") {
      target.focus({ preventScroll: true });
      pendingFocus.current = null;
    }
  }, []);

  function follow(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    go(id);
  }

  useEffect(() => {
    const media = matchMedia(mediaQuery);
    let frame = 0;
    function render() {
      frame = 0;
      if (!track.current || !viewport.current) return;
      const useCamera = media.matches;
      if (!initialAnchor.current && track.current.dataset.cinematic === String(useCamera)) {
        initialAnchor.current = true;
        const anchor = location.hash.slice(1);
        if (chapters.some(item => item.id === anchor)) {
          document.getElementById(anchor)?.scrollIntoView({ behavior: "instant" });
        }
      }
      const progress = -track.current.getBoundingClientRect().top / viewport.current.clientHeight;
      const visit = useCamera ? visits.find(v => progress >= v.start && progress < v.end) : undefined;
      const approach = visit ? Math.min(ease((progress - visit.start) / (visit.enter - visit.start)), ease((visit.end - progress) / (visit.end - visit.leave))) : 0;
      driver.pose = visit ? { id: visit.id, approach } : null;
      const expansion = ease((approach - .70) / .30);
      const next = ease((progress - (steps[1] - .17)) / .27);
      const last = ease((progress - (steps[2] - .17)) / .27);
      const weights = visit?.id === "projects" ? [1 - next, next * (1 - last), last, 0, 0]
        : [0, 0, 0, Number(visit?.id === "about"), Number(visit?.id === "contact")];
      let current = -1;
      layers.current.forEach((el, i) => {
        if (!el) return;
        const presence = visit?.id === "projects" && i < 3 ? [Number(next < 1), next * Number(last < 1), last][i] : weights[i];
        const opacity = presence * expansion;
        blend.current[i] = expansion;
        el.style.setProperty("--presence", String(opacity));
        if (expansion === 1 || opacity === 0) el.style.setProperty("--crop", "inset(0)");
        if (weights[i] >= .5 && expansion > .98) current = i;
      });
      setPanel(current);
      setSceneLocked(Boolean(visit));
      setChapter(visit?.id ?? "home");
      driver.invalidate?.();
      if (current >= 0 && pendingFocus.current === surfaces[current]) {
        const target = layers.current[current];
        // React first applies the new inert state, then the heading can receive focus.
        requestAnimationFrame(() => target?.focus({ preventScroll: true }));
        pendingFocus.current = null;
      }
    }
    function queue() {
      if (!frame) frame = requestAnimationFrame(render);
    }
    function adapt() {
      setCinematic(media.matches);
      queue();
    }
    adapt();
    const observer = new ResizeObserver(queue);
    if (track.current) observer.observe(track.current);
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    addEventListener("hashchange", queue);
    media.addEventListener("change", adapt);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
      removeEventListener("hashchange", queue);
      media.removeEventListener("change", adapt);
    };
  }, [driver]);

  const open = useCallback((id: InteractionId) => go(id), [go]);

  return <main ref={track} className="pc-journey" id="main-content" tabIndex={-1} data-cinematic={cinematic} data-active-panel={panelsOrder[panel] ?? ""}>
    <header className="pc-header" data-dark={panel >= 0 && panel !== 3}>
      <a href="#home" onClick={event => follow(event, "home")} aria-current={chapter === "home" ? "location" : undefined}>Ruizhe Lai</a>
      <nav aria-label="Workspace navigation">
        {chapters.slice(1).map(({ id, label }) => <a key={id} href={`#${id}`} onClick={event => follow(event, id)} aria-current={cinematic && chapter === id ? "location" : undefined}>{label}</a>)}
      </nav>
    </header>
    <div className="pc-markers">
      <span id="home" tabIndex={-1} className="pc-home-marker" />
      {cinematic && chapters.slice(1).map(({ id, at }) => <span key={id} id={id} style={{ top: `calc(${at} * 100svh)` }} />)}
    </div>
    <div className="pc-viewport" ref={viewport}>
      <div className="pc-workspace">
        <WorkspaceHero driver={driver} onNavigate={open} locked={sceneLocked} />
        <h1 className="pc-identity" data-away={sceneLocked}>Design &amp; interaction</h1>
      </div>
      {panels.map((content, i) => (
        <section key={panelsOrder[i]} ref={element => { layers.current[i] = element; }}
          className="pc-layer" id={cinematic ? undefined : panelsOrder[i]} tabIndex={-1}
          inert={cinematic && panel !== i} data-panel={panelsOrder[i]} aria-label={["FixLens", "Sippy", "WillDo", "About", "Contact"][i]}>
          {content}
        </section>
      ))}
    </div>
  </main>;
}
