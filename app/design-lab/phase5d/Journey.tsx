"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import WorkspaceHero from "@/components/workspace/WorkspaceHero";
import type { JourneyDriver } from "@/components/workspace/journey";
import type { InteractionId } from "@/lib/workspace-config";
import { pacingChapters, pacingWindows } from "../phase5g/pacing";
import { glide, presentScroll, projectCurves, projectStops, readingBeat, readingCrossfadeHalf, rhythmChapters } from "../phase5f/rhythm";

const query = "(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
const phase5dChapters = [
  { id: "about", label: "About", start: .22, enter: .88, leave: 2.62, end: 3.19 },
  { id: "projects", label: "Projects", start: 3.25, enter: 3.9, leave: 5.48, end: 6.10 },
  { id: "contact", label: "Contact", start: 6.16, enter: 6.78, leave: 7.2, end: 7.8 },
] as const;
const phase5eChapters = [
  { id: "about", label: "About", start: .22, enter: .88, leave: 4.58, end: 5.15 },
  { id: "projects", label: "Projects", start: 5.21, enter: 5.86, leave: 7.44, end: 8.06 },
  { id: "contact", label: "Contact", start: 8.12, enter: 8.74, leave: 9.18, end: 9.76 },
] as const;
const storyBeat = .74;
const transitionHalf = .07;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => { const t = clamp(x); return t * t * (3 - 2 * t); };

export default function Journey({ about, projects, contact, polish = false, rhythm = false, adaptive = false }: { about: ReactNode; projects: ReactNode; contact: ReactNode; polish?: boolean; rhythm?: boolean; adaptive?: boolean }) {
  const chapters = adaptive ? pacingChapters : rhythm ? rhythmChapters : polish ? phase5eChapters : phase5dChapters;
  const beatLength = rhythm ? readingBeat : storyBeat;
  const crossfadeHalf = rhythm ? readingCrossfadeHalf : transitionHalf;
  const jump = useRef<(index: number) => void>(() => {});
  const track = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const navigate = useRef<(id: InteractionId | "home", fromObject?: boolean) => void>(() => {});
  const dimensions = useRef({ width: 0, height: 0, header: 0 });
  const crop = useRef<{ element: HTMLElement; reveal: number; opacity?: number } | null>(null);
  const handoff = useRef<{
    monitor: HTMLElement | null;
    phone: HTMLElement | null;
    phoneCenter: { x: number; y: number; width: number; height: number };
  } | null>(null);
  const [locked, setLocked] = useState(false);
  const [driver] = useState<JourneyDriver>(() => ({
    pose: null,
    textures: ["/images/phase5d/avatar.webp", `/images/${polish ? "phase5e" : "phase5d"}/monitor.webp`, `/images/${polish ? "phase5e" : "phase5d"}/phone.webp`],
    project(id, rect) {
      const active = crop.current;
      if (!active) return;
      const { width, height, header } = dimensions.current;
      if (active.opacity !== undefined) {
        active.element.style.opacity = String(active.opacity);
        if (id === "contact") active.element.style.setProperty("--contact-arrival", String(ease((active.reveal - .3) / .7)));
      }
      const k = 1 - active.reveal;
      const mapped = handoff.current;
      if (id === "projects" && mapped?.monitor) {
        const sx = 1 + (rect.width / width - 1) * k;
        const sy = 1 + (rect.height / (height - header) - 1) * k;
        mapped.monitor.style.transform = `translate(${rect.left * k}px,${rect.top * k}px) scale(${sx},${sy})`;
      }
      if (id === "contact" && mapped?.phone) {
        const original = mapped.phoneCenter;
        if (original.width > 0 && original.height > 0) {
          const scale = 1 + (Math.min(rect.width / original.width, rect.height / original.height) - 1) * k;
          const x = (rect.left + rect.width / 2 - original.x) * k;
          const y = (rect.top + rect.height / 2 - original.y) * k;
          mapped.phone.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
        }
      }
      const inset = [rect.top, width - rect.left - rect.width, height - header - rect.top - rect.height, rect.left];
      active.element.style.clipPath = `inset(${inset.map(n => (Math.max(0,n)*k).toFixed(1) + "px").join(" ")} round ${(10*k).toFixed(1)}px)`;
    },
  }));

  useEffect(() => {
    const root = track.current!;
    const view = viewport.current!;
    const header = nav.current!;
    const media = matchMedia(query);
    const layers = Array.from(view.querySelectorAll<HTMLElement>(".pd-layer"));
    const beats = Array.from(view.querySelectorAll<HTMLElement>(".pd-beat"));
    const entries = Array.from(view.querySelectorAll<HTMLElement>(".pd-project"));
    const identity = view.querySelector<HTMLElement>(".pd-identity")!;
    const workspace = view.querySelector<HTMLElement>(".pc-workspace")!;
    const avatar = view.querySelector<HTMLElement>(".pd-avatar")!;
    const monitor = polish ? view.querySelector<HTMLElement>(".pd-projects") : null;
    const phone = polish ? view.querySelector<HTMLElement>(".pe-phone") : null;
    function resetHandoff(index: number) {
      if (index === 1 && monitor) monitor.style.transform = "";
      if (index === 2 && phone) phone.style.transform = "";
    }
    const navigation = Array.from(header.querySelectorAll<HTMLAnchorElement>("a"));
    let frame = 0;
    let previousChapter = -1;
    let previousFocus = -1;
    let previousProject = -1;
    let previousStory = -1;
    let previousStoryTime = -1;
    let previousStack = "";
    let previousApproach = -1;
    let previousReveal = -1;
    let offset = 0;
    let direct: { index: number; start: number; scroll: number; fromHome: boolean } | null = null;
    let darkTheme = false;
    let previousIntro = 1;
    let flowObserver: IntersectionObserver | undefined;
    let flowBand = "";

    function setTheme(dark: boolean) {
      if (darkTheme === dark) return;
      darkTheme = dark;
      header.dataset.theme = dark ? "dark" : "light";
    }

    function watchFlow() {
      if (!adaptive) return;
      const start = dimensions.current.header + 2;
      const end = Math.max(0, window.innerHeight - start - 8);
      const band = media.matches ? "" : `-${start}px 0px -${end}px 0px`;
      if (band === flowBand) return;
      flowBand = band;
      flowObserver?.disconnect();
      if (!band) return;
      const regions = [workspace, ...layers];
      const coverage = new Map<Element, number>();
      flowObserver = new IntersectionObserver(records => {
        if (media.matches) return;
        records.forEach(record => coverage.set(record.target, record.intersectionRect.height));
        const ranked = regions.map(region => coverage.get(region) ?? 0);
        const largest = Math.max(...ranked);
        if (largest > 0) setTheme(ranked.indexOf(largest) >= 2);
      }, { rootMargin: band, threshold: [0, .001, .004, .008, .016, .032] });
      regions.forEach(region => flowObserver?.observe(region));
    }
    let focus: number | null = null;
    let projectFocus: number | null = null;
    let previousAvatar = "";
    let presentation = 0;
    let lastRawProgress = 0;
    let resizeTarget: number | null = null;
    let sampledScroll = window.scrollY;
    let scrollChanged = true;
    let lastSample = 0;
    let snapPresentation = true;

    function update(now: number) {
      frame = 0;
      if (!media.matches) return;
      const { height } = dimensions.current;
      if (resizeTarget !== null) {
        const target = offset + resizeTarget * height;
        resizeTarget = null;
        window.scrollTo({ top: target, behavior: "instant" });
        if (direct) direct.scroll = target;
        scrollChanged = true;
      }
      if (!rhythm || scrollChanged) sampledScroll = window.scrollY;
      scrollChanged = false;
      const y = sampledScroll;
      if (direct && Math.abs(direct.scroll - y) > 3) direct = null;
      const rawProgress = (y - offset) / height;
      lastRawProgress = rawProgress;
      const elapsed = lastSample && now - lastSample < 80 ? now - lastSample : 16.7;
      const progress = rhythm ? presentScroll(rawProgress, presentation, elapsed, snapPresentation || Boolean(direct), adaptive ? pacingWindows : undefined) : rawProgress;
      presentation = progress;
      lastSample = now;
      snapPresentation = false;
      if (progress !== rawProgress) queue();
      const index = direct?.index ?? chapters.findIndex(v => progress >= v.start && progress < v.end);
      const visit = chapters[index];
      const tapAmount = direct ? clamp((now - direct.start) / (rhythm ? 850 : 720)) : 1;
      const passage = direct ? tapAmount : visit
        ? clamp(Math.min((progress - visit.start) / (visit.enter - visit.start), (visit.end - progress) / (visit.end - visit.leave)))
        : 0;
      // The camera parks before the shared passage finishes opening the projected screen.
      const approach = rhythm ? glide(passage / .92) : ease(passage);
      const reveal = rhythm ? glide((passage - .67) / .33) : ease((approach - .69) / .31);
      const revealChanged = reveal !== previousReveal;
      if (adaptive) {
        // A dark surface must be visibly open before it takes over the header.
        setTheme(index > 0 && reveal >= (darkTheme ? .62 : .72));
        const intro = direct?.fromHome ? 1 - glide(passage / .40) : 1 - glide((progress - .24) / .27);
        if (intro !== previousIntro) {
          identity.style.setProperty("--intro-opacity", intro.toFixed(3));
          identity.inert = intro === 0;
          previousIntro = intro;
        }
      }
      const active = reveal > .98 ? index : -1;
      const switched = index !== previousChapter;

      if (switched) {
        if (previousChapter >= 0) {
          layers[previousChapter].style.opacity = "0";
          layers[previousChapter].style.clipPath = "";
          resetHandoff(previousChapter);
        }
        setLocked(index >= 0);
        root.dataset.away = String(index >= 0);
        navigation.forEach((link,i) => {
          if (i === index + 1) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
        previousChapter = index;
      }
      if (active !== previousFocus) {
        layers.forEach((layer,i) => { layer.inert = i !== active; });
        if (!rhythm) header.dataset.dark = String(active > 0);
        root.dataset.destination = chapters[active]?.id ?? "";
        previousFocus = active;
      }

      if (visit && (switched || revealChanged)) {
        const layer = layers[index];
        const layerOpacity = polish && index > 0 ? ease(reveal / (rhythm ? .24 : .38)) : reveal;
        const projected = rhythm && reveal > 0 && reveal < 1 && Boolean(driver.invalidate);
        if (!projected) layer.style.opacity = String(layerOpacity);
        if (polish && index === 2 && !projected) layer.style.setProperty("--contact-arrival", String(ease((reveal - .3) / .7)));
        if (!reveal || reveal === 1) {
          layer.style.clipPath = "";
          resetHandoff(index);
        }
        crop.current = reveal > 0 && reveal < 1 ? { element: layer, reveal, opacity: projected ? layerOpacity : undefined } : null;
        driver.portal = Boolean(crop.current);
      } else if (!visit) {
        crop.current = null;
        driver.portal = false;
      }
      if (switched || approach !== previousApproach || (rhythm && revealChanged && driver.portal)) {
        driver.pose = visit ? { id: visit.id, approach } : null;
        driver.invalidate?.();
      }
      previousApproach = approach;
      previousReveal = reveal;

      if (index === 0 && reveal > 0) {
        const t = clamp((progress - chapters[0].enter) / (chapters[0].leave - chapters[0].enter));
        const storyProgress = (progress - chapters[0].enter) / beatLength;
        const boundary = Math.round(storyProgress);
        const crossing = storyProgress * beatLength - boundary * beatLength;
        const holding = Math.max(0, Math.min(4, Math.floor(storyProgress)));
        const position = polish
          ? boundary >= 1 && boundary <= 4 && Math.abs(crossing) < crossfadeHalf
            ? boundary - 1 + (rhythm ? glide : ease)((crossing + crossfadeHalf) / (2 * crossfadeHalf))
            : holding
          : clamp((t - .07) / .87) * 4;
        const story = Math.round(position);
        if (position !== previousStoryTime) {
          beats.forEach((beat,i) => {
            const delta = i - position;
            beat.style.opacity = String(1 - ease(Math.abs(delta)));
            beat.style.transform = `translateY(${Math.max(-1,Math.min(1,delta))*(rhythm ? 19 : 34)}px)`;
          });
          previousStoryTime = position;
        }
        if (story !== previousStory) {
          beats.forEach((beat,i) => { beat.inert = i !== story; });
          root.dataset.story = String(story);
          previousStory = story;
        }
        const exit = progress > chapters[0].leave ? 1 - reveal : 0;
        const avatarTransform = `translate3d(${(position*1.8 - exit*16).toFixed(1)}px,${(-Math.sin(position/4*Math.PI)*8 + exit*14).toFixed(1)}px,0) rotate(${(Math.sin(position*1.3)*2 - exit*4).toFixed(2)}deg) scale(${(1.03 + Math.sin(position/4*Math.PI)*.045-exit*.06).toFixed(3)})`;
        if (avatarTransform !== previousAvatar) {
          avatar.style.transform = avatarTransform;
          previousAvatar = avatarTransform;
        }
      }

      if (index === 1 && reveal > 0) {
        const exhibitionProgress = progress - chapters[1].enter;
        const second = rhythm ? glide((exhibitionProgress - projectCurves[0][0]) / (projectCurves[0][1] - projectCurves[0][0])) : ease((exhibitionProgress - .37) / .25);
        const third = rhythm ? glide((exhibitionProgress - projectCurves[1][0]) / (projectCurves[1][1] - projectCurves[1][0])) : ease((exhibitionProgress - 1.01) / .25);
        const weights = [1 - second, second - third, third];
        const stack = weights.map(n => n.toFixed(3)).join("/");
        if (stack !== previousStack) {
          let preceding = 0;
          entries.forEach((entry,i) => {
            entry.style.setProperty("--share", weights[i].toFixed(3));
            entry.style.setProperty("--preceding", preceding.toFixed(3));
            preceding += weights[i];
          });
          previousStack = stack;
        }
        const project = weights.indexOf(Math.max(...weights));
        if (project !== previousProject) {
          entries.forEach((entry,i) => {
            entry.dataset.expanded = String(i === project);
            (entry.lastElementChild as HTMLElement).inert = i !== project;
            entry.querySelector("button")?.setAttribute("aria-expanded", String(i === project));
          });
          root.dataset.project = String(project);
          previousProject = project;
        }
        if (projectFocus === project && weights[project] > .999) {
          (entries[project].lastElementChild as HTMLElement).focus({ preventScroll: true });
          projectFocus = null;
        }
      }

      if (focus !== null && active === focus && !direct) {
        layers[focus].focus({ preventScroll: true });
        focus = null;
      }
      if (direct) {
        if (tapAmount === 1) direct = null;
        queue();
      }
    }
    function onScroll() {
      scrollChanged = true;
      queue();
    }
    function queue() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function measure(retainProgress = true) {
      snapPresentation = true;
      scrollChanged = true;
      const oldHeight = dimensions.current.height;
      const extent = view.clientHeight;
      dimensions.current = { width: view.clientWidth, height: extent, header: header.offsetHeight };
      offset = root.getBoundingClientRect().top + scrollY;
      if (rhythm && retainProgress && media.matches && oldHeight && oldHeight !== extent) {
        resizeTarget ??= lastRawProgress;
      }
      if (phone && media.matches) {
        handoff.current = {
          monitor,
          phone,
          phoneCenter: {
            x: phone.offsetLeft + phone.offsetWidth / 2,
            y: phone.offsetTop + phone.offsetHeight / 2,
            width: phone.offsetWidth,
            height: phone.offsetHeight,
          },
        };
      } else handoff.current = null;
      watchFlow();
      queue();
    }

    const changeLocation = (id: InteractionId | "home", fromObject = false, push = true) => {
      const index = chapters.findIndex(item => item.id === id);
      const hash = id === "home" ? "" : "#" + id;
      if (push && location.hash !== hash) history.pushState(null, "", hash || location.pathname);
      if (!media.matches) {
        const target = document.getElementById(id);
        target?.scrollIntoView({ behavior: "instant" });
        if (push) target?.focus({ preventScroll: true });
        return;
      }
      const y = Math.min(offset + (chapters[index]?.enter ?? 0) * dimensions.current.height, root.offsetHeight - dimensions.current.height + offset);
      resizeTarget = null;
      const fromHome = lastRawProgress < .24;
      lastRawProgress = (y - offset) / dimensions.current.height;
      snapPresentation = true;
      direct = fromObject && index >= 0 ? { index, start: performance.now(), scroll: y, fromHome } : null;
      focus = push && index >= 0 ? index : null;
      window.scrollTo({ top: y, behavior: "instant" });
      scrollChanged = true;
      if (push && id === "home") root.focus({ preventScroll: true });
      queue();
    };
    navigate.current = changeLocation;
    jump.current = index => {
      if (!polish || !media.matches) return;
      projectFocus = index;
      const target = chapters[1].enter + (rhythm ? projectStops : [.09, .78, 1.39])[index];
      window.scrollTo({ top: offset + target * dimensions.current.height, behavior: "smooth" });
    };
    function restoreLocation() {
      snapPresentation = true;
      const hasLocation = chapters.find(item => "#" + item.id === location.hash);
      const saved = history.state?.phase5dReturn;
      if (Number.isFinite(saved)) window.scrollTo({ top: saved, behavior: "instant" });
      else if (hasLocation) changeLocation(hasLocation.id, false, false);
      queue();
    }
    function adapt() {
      resizeTarget = null;
      root.dataset.cinematic = String(media.matches);
      direct = null;
      focus = null;
      previousFocus = -2;
      previousProject = -1;
      previousStory = -1;
      if (!media.matches) {
        setLocked(false);
        root.dataset.away = "false";
        if (!rhythm) header.dataset.dark = "false";
        navigation.forEach(link => link.removeAttribute("aria-current"));
        layers.forEach(layer => { layer.inert = false; layer.style.cssText = ""; });
        beats.forEach(beat => { beat.inert = false; beat.style.cssText = ""; });
        entries.forEach(entry => { (entry.lastElementChild as HTMLElement).inert = false; });
        if (adaptive) {
          identity.style.removeProperty("--intro-opacity");
          identity.inert = false;
          previousIntro = 1;
        }
        avatar.style.transform = "";
        resetHandoff(1);
        resetHandoff(2);
        driver.pose = null;
        driver.invalidate?.();
      }
      previousChapter = -2;
      previousStoryTime = -1;
      previousAvatar = "";
      measure(false);
      restoreLocation();
    }
    const observer = new ResizeObserver(() => measure());
    observer.observe(view);
    adapt();
    media.addEventListener("change", adapt);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("hashchange", restoreLocation);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      flowObserver?.disconnect();
      media.removeEventListener("change", adapt);
      removeEventListener("scroll", onScroll);
      removeEventListener("hashchange", restoreLocation);
    };
  }, [adaptive, beatLength, chapters, crossfadeHalf, driver, polish, rhythm]);

  function follow(event: MouseEvent<HTMLAnchorElement>, id: InteractionId | "home") {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate.current(id);
  }

  function rememberCaseStudy(event: MouseEvent<HTMLElement>) {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;
    const strip = event.target.closest<HTMLButtonElement>("[data-project-jump]");
    if (strip) {
      jump.current(Number(strip.dataset.projectJump));
      return;
    }
    if (!event.target.closest(".pd-project-body a")) return;
    history.replaceState({ ...history.state, phase5dReturn: window.scrollY }, "");
  }

  return <main onClickCapture={rememberCaseStudy} ref={track} id="main-content" tabIndex={-1} className="pd-journey" data-cinematic="false">
    <header ref={nav} className="pc-header" data-theme={adaptive ? "light" : undefined}>
      <a href="#home" onClick={e => follow(e,"home")}>Ruizhe Lai</a>
      <nav aria-label="Workspace navigation">
        {chapters.map(item => <a href={`#${item.id}`} key={item.id} onClick={e => follow(e,item.id)}>{item.label}</a>)}
      </nav>
    </header>
    <div ref={viewport} className="pd-viewport">
      <div className="pc-workspace" id="home" tabIndex={-1}>
        <WorkspaceHero driver={driver} onNavigate={id => navigate.current(id,true)} locked={locked} />
        <div className="pd-identity">
          <h1>Welcome to my workplace.</h1>
          <p>Try interacting with everything—or scroll down for a guided walkthrough.</p>
        </div>
      </div>
      {([["about",about],["projects",projects],["contact",contact]] as const).map(([id,body]) =>
        <section key={id} id={id} className="pd-layer" tabIndex={-1} aria-label={chapters.find(item => item.id === id)!.label}>{body}</section>
      )}
    </div>
  </main>;
}
