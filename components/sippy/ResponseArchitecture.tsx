"use client";

import { useEffect, useRef } from "react";

const path = [
  ["Camera", "Hand-gesture input"],
  ["MediaPipe + Python", "Recognise the gesture"],
  ["Bleak / BLE", "Send the movement command"],
  ["ESP32", "Arduino C++ controls the driver"],
  ["Motor driver + motors", "Move the companion"],
];

export default function ResponseArchitecture() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!, media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const draw = () => {
      frame = 0;
      const r = el.getBoundingClientRect(), p = media.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .8 - r.top) / Math.max(1, r.height * .75)));
      el.style.setProperty("--response-progress", String(p));
      el.querySelectorAll<HTMLElement>("[data-response-node]").forEach((node, i) => node.style.setProperty("--node-focus", String(.55 + .45 * Math.max(0, Math.min(1, p * 6 - i * .7)))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule); media.addEventListener("change", schedule); draw();
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); media.removeEventListener("change", schedule); };
  }, []);
  return <section className="sr-section" ref={ref} aria-labelledby="response-title">
    <div className="sp-wrap">
      <div className="sp-section-heading"><h2 id="response-title">Behind<br /><em>the Response</em></h2><p>Seeing a hand. Sensing a cup. Coordinating a physical response.</p></div>
      <div className="sr-gesture"><h3>From a gesture to movement.</h3><ol className="sr-path" aria-label="Gesture recognition and movement path">{path.map(([name, detail], i) => <li key={name} data-response-node={i}><i aria-hidden="true" /><h4>{name}</h4><p>{detail}</p></li>)}</ol></div>
      <div className="sr-cup"><div className="sr-cup-intro"><h3>The cup sets the state.</h3><p>Weight readings from the load cell and documented HX711 amplifier reach the ESP32. BLE carries cup status to the Python control program.</p><p className="sr-channel">Load cell / amplifier <span aria-hidden="true">→</span> ESP32 <span aria-hidden="true">→</span> BLE / Python</p></div>
        <div className="sr-states"><article data-response-node="5"><span>Cup present</span><h4>CUP_ON</h4><p>Gesture control is enabled.</p></article><article data-response-node="6"><span>Cup removed</span><h4>CUP_OFF</h4><p>Gesture control is disabled. Python coordinates Unity’s drink animation until the cup returns.</p></article></div>
      </div>
      <p className="sp-source-note sr-source">Reported system architecture, not live telemetry. The team’s 10-second demo interval was a technical test setting, not a validated everyday reminder schedule.</p>
    </div>
  </section>;
}
