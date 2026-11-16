"use client";

import { useEffect, useRef, useState } from "react";
import { useStoryChapter } from "./useStoryChapter";
import { sippyMedia as M } from "@/lib/sippy-assets";

const chapters = [
  { title: "Gesture", file: "gesture-story", lead: "A hand becomes an input.", copy: "Camera frames feed MediaPipe. Python sends recognised gesture commands over Bluetooth Low Energy using Bleak, linking a movement of the hand to the physical companion.", path: "Camera frames → MediaPipe and Python → Bleak BLE → ESP32 → motor driver → movement" },
  { title: "Movement", file: "movement-story", lead: "The response leaves the screen.", copy: "The ESP32's Arduino C++ program controls the motor driver and DC motors. With a cup present, gestures can move Sippy away or bring it closer. The reported reminder cycle also included a timed return.", path: "Camera frames → MediaPipe and Python → Bleak BLE → ESP32 → motor driver → movement" },
  { title: "Cup interaction", file: "cup-story", lead: "Cup status changes the behaviour.", copy: "The load cell and documented HX711 amplifier report weight changes. CUP_OFF disables gesture control; Python coordinates the drink animation in Unity until the cup returns. The excerpt shows cup handling, not a complete unbroken cycle.", path: "Cup weight → load cell and HX711 → ESP32 → Bleak BLE → Python CUP_OFF → Unity status" },
] as const;

function SystemFlow({ active }: { active: number }) {
  const labels = active === 2 ? [["Cup", "weight"], ["Load cell", "+ HX711"], ["ESP32", "cup state"], ["BLE", "Bleak"], ["Python", "CUP_OFF"], ["Unity", "status"]] : [["Camera", "frames"], ["MediaPipe", "+ Python"], ["BLE", "Bleak"], ["ESP32", "Arduino C++"], ["Motor", "driver"], ["Physical", "movement"]];
  const points = [[50, 24], [245, 24], [440, 24], [440, 106], [245, 106], [50, 106]];
  return <div className="sb-system"><p>How the response travels <span>Reported system flow</span></p><svg viewBox="0 0 490 146" role="img" aria-label={chapters[active].path}>
    <path className="sb-route" d="M50 24H440V106H50" />
    <path className={`sb-route-active sb-route-${active}`} d="M50 24H440V106H50" />
    {points.map(([x, y], i) => <g key={i} className={active === 2 || (active === 0 ? i < 3 : i >= 3) ? "sb-node is-lit" : "sb-node"}><circle cx={x} cy={y} r="4" /><text x={x} y={y + 19} textAnchor="middle">{labels[i][0]}</text><text className="sb-node-detail" x={x} y={y + 33} textAnchor="middle">{labels[i][1]}</text></g>)}
  </svg></div>;
}

export default function BehaviourStory() {
  const root = useRef<HTMLElement>(null), video = useRef<HTMLVideoElement>(null);
  const { active, reduced, visible } = useStoryChapter(root, "[data-behaviour-step]");
  const [paused, setPaused] = useState(false), [blocked, setBlocked] = useState(false), [playing, setPlaying] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const chapter = chapters[active];
  useEffect(() => {
    const v = video.current!;
    const observer = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: .25 }); observer.observe(v);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const v = video.current!;
    let cancelled = false;
    v.muted = true; v.defaultMuted = true; v.controls = reduced;
    v.preload = visible && onScreen ? "metadata" : "none";
    const desired = `${M}${chapter.file}.mp4`;
    if (v.getAttribute("src") !== desired) { v.pause(); v.src = desired; v.poster = `${M}${chapter.file}.webp`; if (visible && onScreen) v.load(); }
    if (visible && onScreen && !reduced && !paused && !document.hidden) {
      v.preload = "metadata";
      const promise = v.play();
      if (promise) promise.then(() => { if (!cancelled) setBlocked(false); }).catch(error => { if (!cancelled && error.name !== "AbortError") setBlocked(true); });
    } else v.pause();
    const hide = () => { if (document.hidden) v.pause(); };
    document.addEventListener("visibilitychange", hide);
    return () => { cancelled = true; v.pause(); document.removeEventListener("visibilitychange", hide); };
  }, [chapter, reduced, visible, onScreen, paused]);
  const toggle = () => {
    const v = video.current!;
    if (!v.paused) { setPaused(true); v.pause(); }
    else { setPaused(false); v.muted = true; void v.play().then(() => setBlocked(false)).catch(() => setBlocked(true)); }
  };
  return <section className="sp-action sb-section" ref={root} aria-labelledby="action-title" data-active-chapter={active}>
    <div className="sp-wrap">
      <div className="sp-section-heading"><h2 id="action-title">See Sippy<br /><em>in Action</em></h2><p>A hand, a moving companion, a cup. Three moments reveal the system behind the personality.</p></div>
      <div className="sb-story">
        <div className="sb-screen" data-story-screen>
          <div className="sb-film"><video ref={video} controls muted playsInline loop preload="none" src={`${M}gesture-story.mp4`} poster={`${M}gesture-story.webp`} aria-label={`Authentic Sippy demonstration: ${chapter.title}`} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
            <div className="sb-film-caption"><span>{chapter.title}</span><button className="sb-play" type="button" onClick={toggle} aria-label={playing ? "Pause demonstration" : "Play demonstration"}>{playing ? "Pause" : blocked ? "Play clip" : "Play"}<span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span></button></div>
          </div>
          <SystemFlow active={active} />
        </div>
        <div className="sb-chapters">{chapters.map((c, i) => <article key={c.title} data-behaviour-step={i} className={i === active ? "is-active" : ""}><span className="sb-chapter-number">{String(i + 1).padStart(2, "0")} / {c.title}</span><h3>{c.lead}</h3><p>{c.copy}</p><a className="sb-static-link" href={`${M}${c.file}.mp4`}>Watch {c.title.toLowerCase()} excerpt ↗</a></article>)}</div>
      </div>
      <div className="sb-evidence"><p>These are separate, silent excerpts from the original project film. They are not one continuous test cycle.</p><p>The team used a 10-second interval in its technical demonstration. Unity reflected system states; the diagram is explanatory, not live telemetry. Neither establishes a validated everyday reminder schedule.</p></div>
    </div>
  </section>;
}
