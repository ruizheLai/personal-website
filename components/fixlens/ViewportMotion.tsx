"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

export const METRIC_DURATION = 1250;

/** Server HTML is final. A one-shot enhancement starts only when the value is comfortably in view. */
export function useOnceViewportProgress(ref: RefObject<HTMLElement | null>, duration = METRIC_DURATION) {
  const [progress, setProgress] = useState(1);
  const played = useRef(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    let observer: IntersectionObserver | null = null;
    const finish = () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      played.current = true;
      if (!disposed) setProgress(1);
    };
    const begin = () => {
      if (played.current || preference.matches) { finish(); return; }
      played.current = true;
      observer?.disconnect();
      const start = performance.now();
      setProgress(0);
      const tick = (time: number) => {
        if (disposed) return;
        if (preference.matches) { finish(); return; }
        const t = Math.min(1, (time - start) / duration);
        setProgress(1 - Math.pow(1 - t, 3));
        if (t < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    };
    const onPreferenceChange = () => { if (preference.matches) finish(); };
    if (preference.matches || played.current || !("IntersectionObserver" in window)) finish();
    else {
      setProgress(0);
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) begin();
      }, { threshold: .35, rootMargin: "0px 0px -12% 0px" });
      observer.observe(element);
    }
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [ref, duration]);
  return progress;
}

export function InterviewCount() {
  const ref = useRef<HTMLElement>(null);
  const progress = useOnceViewportProgress(ref);
  return <strong ref={ref} data-animation-complete={progress === 1}><span aria-hidden="true">{Math.round(8 * progress)}</span><span className="sr-only">8</span></strong>;
}

/** Themes stay visible in CSS; WAAPI adds a restrained arrival once per theme. */
export function ResearchThemes({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const played = new Set<Element>();
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || played.has(entry.target)) return;
        played.add(entry.target);
        observer.unobserve(entry.target);
        if (preference.matches) return;
        const position = Array.from(root.children).indexOf(entry.target);
        const animation = entry.target.animate(
          [{ opacity: .35, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
          { duration: 720, delay: position * 85, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: .22, rootMargin: "0px 0px -8% 0px" });
    Array.from(root.children).forEach(child => observer.observe(child));
    const finish = () => { if (preference.matches) { animations.forEach(animation => animation.cancel()); animations.clear(); } };
    preference.addEventListener("change", finish);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      preference.removeEventListener("change", finish);
    };
  }, []);
  return <div className="fx-insights" ref={ref}>{children}</div>;
}
