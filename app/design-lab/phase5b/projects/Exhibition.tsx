"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { fixlensAssets } from "@/lib/fixlens-assets";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => n * n * (3 - 2 * n);

export default function Exhibition() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [room, setRoom] = useState<"fixlens" | "sippy">("fixlens");
  const [role, setRole] = useState<"manager" | "renter">("manager");
  const [close, setClose] = useState(false);

  useEffect(() => {
    const trackElement = track.current;
    const stageElement = stage.current;
    if (!trackElement || !stageElement) return;
    const media = matchMedia("(min-width: 901px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;

    function update() {
      frame = 0;
      const el = trackElement!;
      const viewport = stageElement!;
      const travel = Math.max(1, el.offsetHeight - viewport.offsetHeight);
      const inset = Number.parseFloat(getComputedStyle(viewport).top) || 0;
      const progress = media.matches ? clamp((inset - el.getBoundingClientRect().top) / travel) : 0;
      const approach = smooth(clamp((progress - .37) / .63));
      viewport.style.setProperty("--split", (71 - 43 * smooth(progress)) + "%");
      viewport.style.setProperty("--seam", String(progress));
      viewport.style.setProperty("--arrival-x", (1 - approach) * 38 + "px");
      viewport.style.setProperty("--arrival-y", (1 - approach) * 20 + "px");
      viewport.style.setProperty("--arrival-scale", String(.82 + approach * .18));
      viewport.dataset.progress = progress.toFixed(3);
      setRoom(progress < .57 ? "fixlens" : "sippy");
    }

    function queue() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function adapt() {
      setScrubbing(media.matches);
      queue();
    }

    const observer = new ResizeObserver(queue);
    observer.observe(trackElement);
    adapt();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    media.addEventListener("change", adapt);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
      media.removeEventListener("change", adapt);
    };
  }, []);

  function findWorld(next: "fixlens" | "sippy") {
    if (!scrubbing || !track.current || !stage.current) return;
    const travel = track.current.offsetHeight - stage.current.offsetHeight;
    const inset = Number.parseFloat(getComputedStyle(stage.current).top) || 0;
    const start = track.current.getBoundingClientRect().top + window.scrollY - inset;
    window.scrollTo({ top: start + (next === "sippy" ? travel : 0), behavior: "smooth" });
  }

  function aim(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--aim-x", ((event.clientX - rect.left) / rect.width - .5) * 12 + "px");
    element.style.setProperty("--aim-y", ((event.clientY - rect.top) / rect.height - .5) * 9 + "px");
  }

  function resetAim(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.removeProperty("--aim-x");
    event.currentTarget.style.removeProperty("--aim-y");
  }

  return (
    <div className="pb-exhibit-track" ref={track} data-scroll={scrubbing}>
      <div className="pb-exhibit" ref={stage} data-room={room}>
        <div className="pb-worlds">
          <article className="pb-world pb-fixlens" data-role={role} aria-labelledby="pb-fixlens-title">
            <header className="pb-world-heading">
              <p className="pb-mono">01 / Digital product</p>
              <h2 id="pb-fixlens-title">FixLens</h2>
              <p className="pb-world-line">One repair. Two perspectives.</p>
            </header>
            <div className="pb-fix-art" onPointerMove={aim} onPointerLeave={resetAim}>
              <div className="pb-plane pb-manager">
                <Image src={fixlensAssets.FX02.src} alt={fixlensAssets.FX02.alt} width={1404} height={570} priority unoptimized />
                <span className="pb-mono">Property manager</span>
              </div>
              <div className="pb-plane pb-renter">
                <Image src={fixlensAssets.FX03.src} alt="FixLens renter Home screen with the report and case status actions" width={390} height={844} priority unoptimized />
                <span className="pb-mono">Renter</span>
              </div>
              <div className="pb-interface-trace" aria-hidden="true"><i /><b /><i /></div>
            </div>
            <div className="pb-world-controls">
              <div className="pb-role-switch" role="group" aria-label="FixLens perspectives">
                <button type="button" aria-pressed={role === "manager"} onClick={() => setRole("manager")}>Manager</button>
                <button type="button" aria-pressed={role === "renter"} onClick={() => setRole("renter")}>Renter</button>
              </div>
              <p className="pb-role-detail" aria-live="polite">{role === "manager" ? "Review cases and coordinate follow-up." : "Report an issue and see what happens next."}</p>
            </div>
            <Link href="/projects/fixlens" className="pb-world-link" aria-label="Read the FixLens case study">Case study <span aria-hidden="true">↗</span></Link>
          </article>
          <article className="pb-world pb-sippy" data-close={close} aria-labelledby="pb-sippy-title">
            <header className="pb-world-heading">
              <p className="pb-mono">02 / Tangible interaction</p>
              <h2 id="pb-sippy-title">Sippy</h2>
              <p className="pb-world-line">A reminder you can meet.</p>
            </header>
            <div className="pb-sippy-art">
              <div className="pb-sippy-shadow" aria-hidden="true" />
              <div className="pb-arrival">
                <Image src="/images/sippy/plush.webp" alt="The real plush Sippy prototype with a cup, colourful fur and expressive eyes" width={571} height={633} priority unoptimized />
              </div>
            </div>
            <div className="pb-world-controls">
              <button className="pb-object-control" type="button" aria-pressed={close} onClick={() => setClose(!close)}>
                {close ? "Step back" : "Come closer"} <span aria-hidden="true">{close ? "−" : "+"}</span>
              </button>
            </div>
            <Link href="/projects/sippy" className="pb-world-link" aria-label="Read the Sippy case study">Case study <span aria-hidden="true">↗</span></Link>
          </article>
        </div>
        <div className="pb-exhibit-rail">
          <div className="pb-world-jumps" role="group" aria-label="Exhibition view">
            <button type="button" aria-pressed={room === "fixlens"} onClick={() => findWorld("fixlens")}>01 FixLens</button>
            <button type="button" aria-pressed={room === "sippy"} onClick={() => findWorld("sippy")}>02 Sippy</button>
          </div>
          <div className="pb-rail-track" aria-hidden="true"><i /></div>
          <span className="pb-mono">Scroll between worlds <span aria-hidden="true">↓</span></span>
        </div>
      </div>
    </div>
  );
}
