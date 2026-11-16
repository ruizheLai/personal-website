"use client";

import { useEffect, useState, type RefObject } from "react";

/** Choose from measured chapter centres. Direction and playback time never drive story state. */
export function useStoryChapter(root: RefObject<HTMLElement | null>, selector: string) {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = root.current!;
    const steps = [...el.querySelectorAll<HTMLElement>(selector)];
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const stage = el.querySelector<HTMLElement>("[data-story-screen]")!.getBoundingClientRect();
      const target = innerWidth <= 700 ? Math.min(innerHeight * .82, stage.bottom + (innerHeight - stage.bottom) * .45) : innerHeight * .52;
      let best = 0, distance = Infinity;
      steps.forEach((e, i) => { const r = e.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - target); if (d < distance) { best = i; distance = d; } });
      setActive(best);
      setVisible(stage.bottom > 0 && stage.top < innerHeight && el.getBoundingClientRect().bottom > 0);
      setReduced(media.matches);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    el.classList.add("story-ready");
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule); media.addEventListener("change", schedule);
    const observer = new ResizeObserver(schedule); observer.observe(el);
    el.querySelectorAll("img").forEach(im => im.addEventListener("load", schedule));
    measure();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); media.removeEventListener("change", schedule); el.querySelectorAll("img").forEach(im => im.removeEventListener("load", schedule)); el.classList.remove("story-ready"); };
  }, [root, selector]);
  return { active, reduced, visible };
}
