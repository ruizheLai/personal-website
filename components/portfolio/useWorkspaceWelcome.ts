"use client";

import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import type { WorkspaceStatus } from "@/components/workspace/WorkspaceScene";

const minimumDisplayMs = 1740;
const revealMs = 850;
const maximumWaitMs = 9000;
const directDestinations = new Set(["#about", "#projects", "#contact"]);
let visitedInDocument = false;

export function useWorkspaceWelcome(
  enabled: boolean,
  track: RefObject<HTMLElement | null>,
  identity: RefObject<HTMLDivElement | null>,
) {
  const [covering, setCovering] = useState(enabled);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const status = useRef<WorkspaceStatus>("loading");
  const returning = useRef<boolean | null>(null);
  const finish = useRef<() => void>(() => {});
  const reevaluate = useRef<() => void>(() => {});
  const onWorkspaceStatus = useCallback((next: WorkspaceStatus) => {
    status.current = next;
    if (next !== "loading") setLoadingPreview(false);
    reevaluate.current();
  }, []);
  const dismiss = useCallback(() => finish.current(), []);

  useLayoutEffect(() => {
    const root = track.current;
    const copy = identity.current;
    if (!enabled || !root || !copy) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const events = new AbortController();
    const { signal } = events;
    const animations: Animation[] = [];
    const started = performance.now();
    let done = false;
    let moving = false;
    let holdTimer = 0;
    let deadline = 0;

    function settle() {
      if (done) return;
      done = true;
      root!.dataset.welcome = "done";
      events.abort();
      clearTimeout(holdTimer);
      clearTimeout(deadline);
      animations.forEach(animation => animation.cancel());
      setCovering(false);
    }

    function reveal() {
      if (done || moving) return;
      if (motion.matches) {
        settle();
        return;
      }
      const elements = Array.from(copy!.children) as HTMLElement[];
      const centered = elements.map(element => element.getBoundingClientRect());
      moving = true;
      root!.dataset.welcome = "revealing";
      const options = { duration: revealMs, easing: "cubic-bezier(.22,.65,.29,1)", fill: "both" } satisfies KeyframeAnimationOptions;
      elements.forEach((element, index) => {
        const from = centered[index];
        const to = element.getBoundingClientRect();
        animations.push(element.animate([
          { transformOrigin: "top left", transform: `translate(${from.left - to.left}px,${from.top - to.top}px) scale(${from.width / to.width})` },
          { transformOrigin: "top left", transform: "none" },
        ], options));
      });
      const scene = root!.querySelector(".workspace-stage");
      if (scene) animations.push(scene.animate([{ opacity: 0 }, { opacity: 1 }], options));
      void Promise.all(animations.map(animation => animation.finished)).then(settle, () => {});
    }

    function advance() {
      if (done || moving || status.current === "loading") return;
      const remaining = motion.matches ? 0 : minimumDisplayMs - (performance.now() - started);
      clearTimeout(holdTimer);
      if (remaining > 0) holdTimer = window.setTimeout(reveal, remaining);
      else reveal();
    }

    finish.current = settle;
    reevaluate.current = advance;
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    returning.current ??= visitedInDocument || Boolean(navigation && new URL(navigation.name).pathname !== location.pathname);
    visitedInDocument = true;
    if (returning.current || directDestinations.has(location.hash) || navigation?.type === "back_forward" || Number.isFinite(history.state?.phase5dReturn)) {
      settle();
      return;
    }

    root.dataset.welcome = "intro";
    addEventListener("wheel", event => {
      if (!event.ctrlKey && !event.metaKey) event.preventDefault();
    }, { passive: false, capture: true, signal });
    addEventListener("resize", () => { if (moving) settle(); }, { signal });
    addEventListener("pageshow", event => { if (event.persisted) settle(); }, { signal });
    motion.addEventListener("change", () => {
      if (moving && motion.matches) settle();
      else advance();
    }, { signal });
    deadline = window.setTimeout(() => {
      if (status.current === "loading") {
        setLoadingPreview(true);
        settle();
      }
    }, maximumWaitMs);
    advance();

    return () => {
      done = true;
      events.abort();
      clearTimeout(holdTimer);
      clearTimeout(deadline);
      animations.forEach(animation => animation.cancel());
      finish.current = () => {};
      reevaluate.current = () => {};
    };
  }, [enabled, identity, track]);

  return { covering, dismiss, loadingPreview, onWorkspaceStatus, status };
}
