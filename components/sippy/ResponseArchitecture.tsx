"use client";

import { useEffect, useRef } from "react";

const path = [
  ["Camera", "Hand-gesture input"],
  ["MediaPipe + Python", "Recognise the gesture"],
  ["Bleak / BLE", "Send the movement command"],
  ["ESP32", "Arduino C++ controls the driver"],
  ["Motor driver + motors", "Move the companion"],
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function ResponseArchitecture() {
  const pathRef = useRef<HTMLOListElement>(null);
  const cupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = pathRef.current;
    const cup = cupRef.current;
    if (!track || !cup) return;
    const nodes = Array.from(track.querySelectorAll("li"));
    const markers = nodes.map(node => node.querySelector("i")!);
    const states = cup.querySelector(".sr-states")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const vertical = matchMedia("(max-width: 900px)");
    let frame = 0;

    const draw = () => {
      frame = 0;
      const reduced = motion.matches;
      const bounds = track.getBoundingClientRect();
      const positions = markers.map(marker => {
        const rect = marker.getBoundingClientRect();
        return vertical.matches ? rect.top + rect.height / 2 - bounds.top : rect.left + rect.width / 2 - bounds.left;
      });
      const start = positions[0];
      const length = positions.at(-1)! - start;
      const travel = innerHeight * .48 + (vertical.matches ? length : 0);
      const progress = reduced ? 1 : clamp((innerHeight * .82 - bounds.top) / travel);
      const signal = length * progress;
      const cupProgress = clamp((innerHeight * .62 - states.getBoundingClientRect().top) / (innerHeight * .32));

      track.style.setProperty("--signal-start", `${start}px`);
      track.style.setProperty("--signal-length", `${length}px`);
      track.style.setProperty("--signal-distance", `${signal}px`);
      track.style.setProperty("--signal-opacity", String(reduced ? 0 : Math.min(1, progress * 22, (1 - progress) * 22)));
      nodes.forEach((node, index) => {
        const distance = positions[index] - start;
        const strength = reduced ? 0 : clamp(1 - Math.abs(signal - distance) / Math.max(1, length * .19));
        node.style.setProperty("--arrival", String(strength));
        node.dataset.reached = String(signal + .01 >= distance);
      });
      cup.style.setProperty("--cup-on", String(reduced ? 1 : 1 - cupProgress));
      cup.style.setProperty("--cup-off", String(reduced ? 1 : cupProgress));
      cup.style.setProperty("--cup-lift", `${reduced ? 7 : cupProgress * 7}px`);
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    observer.observe(cup);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);
  return <section className="sr-section" aria-labelledby="response-title">
    <div className="sp-wrap">
      <div className="sp-section-heading"><h2 id="response-title">Behind<br /><em>the Response</em></h2><p>Seeing a hand. Sensing a cup. Coordinating a physical response.</p></div>
      <div className="sr-gesture">
        <h3>From a gesture to movement.</h3>
        <ol className="sr-path" ref={pathRef} aria-label="Gesture recognition and movement path">
          {path.map(([name, detail], i) => (
            <li key={name} data-response-node={i}><i aria-hidden="true" /><h4>{name}</h4><p>{detail}</p></li>
          ))}
        </ol>
      </div>
      <div className="sr-cup" ref={cupRef}>
        <div className="sr-cup-intro">
          <h3>The cup sets the state.</h3>
          <p>The load cell and HX711 amplifier send weight readings to the ESP32, which relays cup status to Python over BLE.</p>
        </div>
        <div className="sr-states">
          <article className="sr-cup-on"><div className="sr-cup-icon" aria-hidden="true"><i /></div><span>Cup present</span><h4>CUP_ON</h4><p>Gesture control is enabled.</p></article>
          <article className="sr-cup-off"><div className="sr-cup-icon" aria-hidden="true"><i /></div><span>Cup removed</span><h4>CUP_OFF</h4><p>Gesture control is disabled. Python coordinates Unity’s drink animation until the cup returns.</p></article>
        </div>
      </div>
    </div>
  </section>;
}
