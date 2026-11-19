"use client";

import { useEffect, useRef, type PointerEvent } from "react";

export default function Patch() {
  const patch = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLDivElement>(null);
  const output = useRef<HTMLAnchorElement>(null);
  const point = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

  function draw() {
    frame.current = 0;
    if (!patch.current || !origin.current || !output.current) return;
    const rect = patch.current.getBoundingClientRect();
    const from = origin.current.getBoundingClientRect();
    const to = output.current.getBoundingClientRect();
    const x = from.left + from.width / 2;
    const y = from.top + from.height / 2;
    const tx = to.left + to.width / 2;
    const ty = to.top + to.height / 2;
    const p = point.current;
    const connected = !p || Math.hypot(p.x - tx, p.y - ty) < to.width * .82 || output.current.matches(":focus-visible");
    const dx = (connected ? tx : tx + (p!.x - tx) * .46) - x;
    const dy = (connected ? ty : ty + (p!.y - ty) * .46) - y;

    patch.current.style.setProperty("--wire-x", x - rect.left + "px");
    patch.current.style.setProperty("--wire-y", y - rect.top + "px");
    patch.current.style.setProperty("--wire-angle", Math.atan2(dy, dx) + "rad");
    patch.current.style.setProperty("--wire-span", String(Math.hypot(dx, dy) / rect.width));
    patch.current.style.setProperty("--tip-x", dx + "px");
    patch.current.style.setProperty("--tip-y", dy + "px");
    patch.current.dataset.connected = String(connected);
  }

  function queue() {
    if (!frame.current) frame.current = requestAnimationFrame(draw);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    point.current = { x: event.clientX, y: event.clientY };
    queue();
  }

  function dock() {
    point.current = null;
    queue();
  }

  useEffect(() => {
    const element = patch.current;
    if (!element) return;
    const observer = new ResizeObserver(dock);
    observer.observe(element);
    const preferred = matchMedia("(prefers-reduced-motion: reduce)");
    preferred.addEventListener("change", dock);
    draw();
    return () => {
      observer.disconnect();
      preferred.removeEventListener("change", dock);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="pb-patch" ref={patch} data-connected="true" onPointerMove={move} onPointerLeave={dock}>
      <p className="pb-patch-mark pb-mono">Ruizhe Lai <span> / </span> Contact</p>
      <div className="pb-origin" ref={origin} aria-hidden="true"><i /><b /></div>
      <div className="pb-wire" aria-hidden="true" />
      <div className="pb-wire-tip" aria-hidden="true" />
      <div className="pb-output-halo" aria-hidden="true" />
      <a className="pb-output" ref={output} onFocus={dock} href="https://github.com/ruizheLai">
        <span>GitHub</span>
        <span className="pb-mono">@ruizheLai <span aria-hidden="true">↗</span></span>
      </a>
      <div className="pb-patch-status pb-mono" aria-hidden="true"><i /> <span>Connection ready</span></div>
    </div>
  );
}
