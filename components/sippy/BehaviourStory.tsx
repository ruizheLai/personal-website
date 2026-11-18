"use client";

import { useEffect, useRef, useState } from "react";
import { useStoryChapter } from "./useStoryChapter";
import { sippyMedia as M } from "@/lib/sippy-assets";

const chapters = [
  { title: "Gesture", file: "gesture-story", lead: "A wave, and a response.", copy: "A hand gesture invites Sippy to move across the desk." },
  { title: "Movement", file: "movement-story", lead: "A reminder with presence.", copy: "Sippy approaches with the cup upright, bringing a reminder into the physical workspace." },
  { title: "Cup interaction", file: "cup-story", lead: "An everyday action becomes an interaction.", copy: "The cup comes off the holder, then returns. Sippy makes that familiar action part of the experience." },
] as const;

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
      <div className="sp-section-heading"><h2 id="action-title">See Sippy<br /><em>in Action</em></h2><p>A gesture, an approach, a cup in use. The physical companion in action.</p></div>
      <div className="sb-story" data-story-track><div className="sb-composition">
        <div className="sb-screen" data-story-screen>
          <div className="sb-film"><video ref={video} controls muted playsInline loop preload="none" src={`${M}gesture-story.mp4`} poster={`${M}gesture-story.webp`} aria-label={`Authentic Sippy demonstration: ${chapter.title}`} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
            <div className="sb-film-caption"><span>{chapter.title}</span><button className="sb-play" type="button" onClick={toggle} aria-label={playing ? "Pause demonstration" : "Play demonstration"}>{playing ? "Pause" : blocked ? "Play clip" : "Play"}<span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span></button></div>
          </div>
        </div>
        <div className="sb-chapters" data-focus-window>{chapters.map((c, i) => <article key={c.title} data-behaviour-step={i} data-focus-copy={i} className={i === active ? "is-active" : ""}><span className="sb-chapter-number">{String(i + 1).padStart(2, "0")} / {c.title}</span><h3>{c.lead}</h3><p>{c.copy}</p><a className="sb-static-link" href={`${M}${c.file}.mp4`}>Watch {c.title.toLowerCase()} excerpt ↗</a></article>)}</div>
      </div></div>
    </div>
  </section>;
}
