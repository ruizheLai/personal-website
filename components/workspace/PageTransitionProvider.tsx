"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { INTERACTIONS, type InteractionId, type SurfaceRect } from "@/lib/workspace-config";
import { useReducedMotion } from "./useReducedMotion";

type Transition = { id: InteractionId; rect: SurfaceRect; origin: string };
const TransitionContext = createContext({ enter: (_id: InteractionId, _rect: SurfaceRect) => {}, cancel: () => {}, resetRevision: 0 });
export const usePageTransition = () => useContext(TransitionContext);
export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [resetRevision, setResetRevision] = useState(0);
  const [transition, setTransition] = useState<Transition | null>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const locked = useRef(false);
  const navigated = useRef(false);
  const cancel = useCallback(() => { animation.current?.cancel(); locked.current = false; setTransition(null); setResetRevision(value => value + 1); }, []);
  const enter = useCallback((id: InteractionId, rect: SurfaceRect) => {
    if (locked.current) return;
    locked.current = true;
    navigated.current = false;
    router.prefetch(INTERACTIONS.find(item => item.id === id)!.href);
    setTransition({ id, rect, origin: pathname });
  }, [pathname, router]);
  useEffect(() => {
    if (!transition || !overlay.current) return;
    const target = INTERACTIONS.find(item => item.id === transition.id)!;
    const { rect } = transition;
    const element = overlay.current;
    let cancelled = false;
    animation.current = element.animate([
      { left: rect.left + "px", top: rect.top + "px", width: rect.width + "px", height: rect.height + "px", borderRadius: transition.id === "contact" ? "8px" : "0px" },
      { left: "0px", top: "0px", width: window.innerWidth + "px", height: window.innerHeight + "px", borderRadius: "0px" },
    ], { duration: reducedMotion ? 80 : 720, easing: "cubic-bezier(.22,.7,.18,1)", fill: "forwards" });
    animation.current.finished.then(() => {
      if (!cancelled) { navigated.current = true; router.push(target.href); }
    }).catch(() => {});
    return () => { cancelled = true; animation.current?.cancel(); };
  }, [transition, router, reducedMotion]);
  useEffect(() => {
    if (!transition || pathname === transition.origin) return;
    const target = INTERACTIONS.find(item => item.id === transition.id)!;
    if (pathname !== target.href || !navigated.current) {
      animation.current?.cancel(); locked.current = false; setTransition(null); return;
    }
    // Pathname changes after Next commits the destination. Fade only after its DOM is present.
    const element = overlay.current;
    if (!element) return;
    const reveal = element.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reducedMotion ? 50 : 320, fill: "forwards", easing: "ease-out" });
    let cancelled = false;
    reveal.finished.then(() => {
      if (cancelled) return;
      animation.current?.cancel();
      locked.current = false;
      setTransition(null);
      document.querySelector<HTMLElement>("#main-content")?.focus({ preventScroll: true });
    }).catch(() => {});
    return () => { cancelled = true; reveal.cancel(); };
  }, [pathname, transition, reducedMotion]);
  useEffect(() => () => { animation.current?.cancel(); }, []);
  const item = transition && INTERACTIONS.find(item => item.id === transition.id);
  return <TransitionContext.Provider value={{ enter, cancel, resetRevision }}>
    {children}
    {transition && item && <div className="page-transition-shell" aria-hidden="true">
      <div ref={overlay} className={`page-transition-image transition-${item.id}`} style={{ left: transition.rect.left, top: transition.rect.top, width: transition.rect.width, height: transition.rect.height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt="" />
      </div>
    </div>}
  </TransitionContext.Provider>;
}
