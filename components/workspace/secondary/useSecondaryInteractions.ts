"use client";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { SECONDARY_CONFIG, type SecondaryId } from "@/lib/secondary-config";
export type BinSignal = { type: "tip" | "reset"; revision: number };
export function useWorkspaceVisibility(stage: RefObject<HTMLDivElement | null>) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let inView = true;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener("visibilitychange", update); update();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [stage]);
  return visible;
}
export function useSecondaryInteractions(enabled: boolean) {
  const [bagOpen, setBagOpen] = useState(false);
  const [hovered, setHovered] = useState<SecondaryId | null>(null);
  const [mugPulse, setMugPulse] = useState(0);
  const [mugMessage, setMugMessage] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [binPhase, setBinPhase] = useState<"upright" | "moving" | "settled">("upright");
  const [binSignal, setBinSignal] = useState<BinSignal>({ type: "reset", revision: 0 });
  const pinned = useRef(false);
  const bagTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelExit = useCallback(() => { if (bagTimer.current) clearTimeout(bagTimer.current); bagTimer.current = null; }, []);
  const closeBag = useCallback(() => { cancelExit(); pinned.current = false; setBagOpen(false); }, [cancelExit]);
  const leaveBag = useCallback(() => {
    cancelExit();
    if (!pinned.current) bagTimer.current = setTimeout(() => setBagOpen(false), SECONDARY_CONFIG.exitDelay);
  }, [cancelExit]);
  const keepBag = useCallback(() => { if (enabled) { cancelExit(); setBagOpen(true); } }, [enabled, cancelExit]);
  const hover = useCallback((id: SecondaryId | null) => {
    if (!enabled || dragging) return;
    setHovered(id);
    if (id === "backpack") { cancelExit(); setBagOpen(true); } else leaveBag();
  }, [enabled, dragging, cancelExit, leaveBag]);
  const activate = useCallback((id: SecondaryId) => {
    if (!enabled || dragging) return;
    if (id === "backpack") {
      cancelExit();
      pinned.current = !pinned.current;
      setBagOpen(pinned.current);
    } else {
      closeBag();
      if (id === "mug") {
        setMugPulse(value => value + 1); setMugMessage(true);
        if (mugTimer.current) clearTimeout(mugTimer.current);
        mugTimer.current = setTimeout(() => setMugMessage(false), 2400);
      } else if (binPhase === "upright") setBinSignal(value => ({ type: "tip", revision: value.revision + 1 }));
    }
  }, [enabled, dragging, binPhase, closeBag, cancelExit]);
  const resetBin = useCallback(() => {
    if (!enabled || dragging) return;
    setBinPhase("upright");
    setBinSignal(value => ({ type: "reset", revision: value.revision + 1 }));
  }, [enabled, dragging]);
  useEffect(() => {
    if (!enabled) { closeBag(); setHovered(null); setMugMessage(false); }
  }, [enabled, closeBag]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") closeBag(); };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [closeBag]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("canvas, #backpack-content, .secondary-control")) return;
      closeBag();
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [closeBag]);
  useEffect(() => () => { cancelExit(); if (mugTimer.current) clearTimeout(mugTimer.current); }, [cancelExit]);
  return { enabled, bagOpen, hovered, mugPulse, mugMessage, dragging, setDragging, binPhase, setBinPhase, binSignal, hover, activate, keepBag, leaveBag, closeBag, resetBin };
}
export type SecondaryState = ReturnType<typeof useSecondaryInteractions>;
