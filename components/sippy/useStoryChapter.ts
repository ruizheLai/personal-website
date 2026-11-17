"use client";

import { useEffect, useState, type RefObject } from "react";
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { n = clamp(n); return n * n * (3 - 2 * n); };

/** Native document progress: centred desktop compositions, natural-flow mobile/static fallback. */
export function useStoryChapter(root: RefObject<HTMLElement | null>, selector: string) {
  const [active, setActive] = useState(0), [reduced, setReduced] = useState(true), [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = root.current!, steps = [...el.querySelectorAll<HTMLElement>(selector)];
    const copies = [...el.querySelectorAll<HTMLElement>("[data-focus-copy]")];
    const panels = [...el.querySelectorAll<HTMLElement>("[data-scene-visual]")];
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const centred = innerWidth > 900 && !media.matches;
      el.classList.toggle("story-centered", centred);
      const screen = el.querySelector<HTMLElement>("[data-story-screen]")!;
      let position = 0;
      if (centred) {
        const header = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect();
        const pad = Math.max(18, Math.min(32, innerHeight * .03));
        const inset = header && header.bottom > 0 && header.top < innerHeight ? Math.max(pad, header.bottom + 12) : pad;
        const space = Math.max(360, innerHeight - inset - pad);
        el.style.setProperty("--story-inset", `${inset}px`); el.style.setProperty("--story-space", `${space}px`);
        const track = el.querySelector<HTMLElement>("[data-story-track]")!, r = track.getBoundingClientRect();
        position = clamp((inset - r.top) / Math.max(1, track.offsetHeight - space)) * (steps.length - 1);
        const windowEl = el.querySelector<HTMLElement>("[data-focus-window]")!;
        copies.forEach((e, i) => {
          const d = i - position, distance = Math.abs(d), focus = 1 - ease(distance);
          const making = el.classList.contains("sm-section");
          const stride = windowEl.offsetHeight * .5 + e.offsetHeight * .3;
          e.style.transform = `translate3d(0,calc(-50% + ${d * (making ? 12 : stride)}px),0) scale(${making ? .97 + .03 * focus : .88 + .12 * focus})`;
          e.style.opacity = String(making ? (i === Math.round(position) ? 1 : 0) : distance > 1.25 ? 0 : .15 + .85 * focus);
          e.style.filter = making ? "none" : `blur(${Math.min(3.5, distance * 3.5)}px)`;
        });
        const base = Math.floor(position), reveal = ease((position - base - .35) / .3);
        panels.forEach((e, i) => {
          const d = i - position;
          e.style.opacity = i === base || i === base + 1 ? "1" : "0";
          e.style.zIndex = String(i);
          e.style.clipPath = i === base + 1 ? `inset(${(1 - reveal) * 100}% 0 0 0)` : "none";
          e.querySelector<HTMLElement>(".sm-visual")!.style.transform = `translate3d(${d * (i % 2 ? -8 : 8)}px,${d * 10}px,0) scale(${.99 + .01 * (1 - Math.min(1, Math.abs(d)))})`;
          e.style.pointerEvents = "none";
        });
      } else {
        copies.forEach(e => { e.style.removeProperty("transform"); e.style.removeProperty("opacity"); e.style.removeProperty("filter"); });
        panels.forEach(e => { e.style.removeProperty("transform"); e.style.removeProperty("opacity"); e.style.removeProperty("clip-path"); e.style.removeProperty("z-index"); e.querySelector<HTMLElement>(".sm-visual")?.style.removeProperty("transform"); });
        const stage = screen.getBoundingClientRect();
        const target = innerWidth <= 900 ? Math.min(innerHeight * .82, stage.bottom + (innerHeight - stage.bottom) * .45) : innerHeight * .5;
        let distance = Infinity;
        steps.forEach((e, i) => { const r = e.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - target); if (d < distance) { position = i; distance = d; } });
      }
      const rect = screen.getBoundingClientRect();
      el.dataset.storyPosition = position.toFixed(5);
      setActive(Math.round(position)); setReduced(media.matches);
      setVisible(rect.bottom > 0 && rect.top < innerHeight && el.getBoundingClientRect().bottom > 0);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    el.classList.add("story-ready");
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule); media.addEventListener("change", schedule);
    const observer = new ResizeObserver(schedule); observer.observe(el);
    const images = [...el.querySelectorAll("img")]; images.forEach(im => im.addEventListener("load", schedule));
    measure();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); media.removeEventListener("change", schedule); images.forEach(im => im.removeEventListener("load", schedule)); el.classList.remove("story-ready", "story-centered"); };
  }, [root, selector]);
  return { active, reduced, visible };
}
