"use client";

import { useEffect, useId, useRef, useState } from "react";

/** An explanatory diagram of the documented problem, not a product UI or research metric. */
export default function ChallengeVisual() {
  const rootRef = useRef<HTMLElement>(null);
  const captionId = useId();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.24 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={"fx-challenge-visual" + (entered ? " fx-cv-entered" : "")} ref={rootRef} aria-labelledby={captionId}>
      <figcaption className="sr-only" id={captionId}>
        Three connected reporting problems: unclear issue descriptions, fragmented evidence and communication, and uncertain responsibilities and follow-up.
      </figcaption>
      <svg className="fx-cv-thread" viewBox="0 0 1120 430" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={captionId + "-line"} x1="130" y1="210" x2="1010" y2="210" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8eafd3" /><stop offset=".5" stopColor="#4789d0" /><stop offset="1" stopColor="#b4c9e0" />
          </linearGradient>
        </defs>
        <path className="fx-cv-line" d="M134 225C261 225 270 156 398 156" stroke={"url(#" + captionId + "-line)"} strokeWidth="1.5" />
        <path className="fx-cv-line fx-cv-line-fragment" d="M416 156C477 156 491 234 550 234" stroke="#a3c0e0" strokeWidth="1.5" strokeDasharray="5 8" />
        <path className="fx-cv-line fx-cv-line-fragment" d="M574 234C665 234 659 168 751 168" stroke="#8baed6" strokeWidth="1.5" strokeDasharray="4 10" />
        <path className="fx-cv-line" d="M775 168C877 168 885 225 992 225" stroke={"url(#" + captionId + "-line)"} strokeWidth="1.5" />
        <circle cx="398" cy="156" r="3" fill="#6797cc" /><circle cx="416" cy="156" r="3" fill="#c1d2e6" />
        <circle cx="550" cy="234" r="3" fill="#9fbddd" /><circle cx="574" cy="234" r="3" fill="#7aa2d1" />
        <circle cx="751" cy="168" r="3" fill="#c1d2e6" /><circle cx="775" cy="168" r="3" fill="#7a9fc9" />
      </svg>

      <ol className="fx-cv-flow">
        <li className="fx-cv-step fx-cv-description">
          <div className="fx-cv-symbol" aria-hidden="true">
            <svg viewBox="0 0 180 150" fill="none">
              <path d="M37 16H125L145 37V132H37Z" fill="#fff" stroke="#a9bfd7" strokeWidth="1.2" />
              <path d="M125 17V37H144" stroke="#a9bfd7" strokeWidth="1.2" />
              <path d="M56 49H121M56 65H112M56 81H90" stroke="#bac9d9" strokeWidth="3" strokeLinecap="round" />
              <path d="M98 81H119" stroke="#bac9d9" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6" />
              <circle cx="133" cy="112" r="23" fill="#eff6ff" stroke="#b2cae6" />
              <path d="M127 105C127 97 140 97 140 105C140 110 133 109 133 114" stroke="#527fab" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="133" cy="121" r="1.2" fill="#527fab" />
            </svg>
          </div>
          <p className="fx-cv-number">01</p>
          <h3>Unclear issue<br />descriptions</h3>
        </li>

        <li className="fx-cv-step fx-cv-fragments">
          <div className="fx-cv-fragment-composition" aria-hidden="true">
            <div className="fx-cv-photo">
              <svg viewBox="0 0 190 146" fill="none">
                <rect x=".7" y=".7" width="188.6" height="144.6" rx="3" fill="#fff" stroke="#b2c8e0" strokeWidth="1.4" />
                <rect x="16" y="17" width="158" height="107" rx="2" fill="#edf5fe" />
                <circle cx="130" cy="47" r="12" fill="#cfdfef" />
                <path d="M24 111L66 65L100 99L119 81L167 124H24Z" fill="#c7daef" />
                <path d="M25 134H98" stroke="#d3dfe9" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="fx-cv-message">
              <svg viewBox="0 0 154 104" fill="none">
                <path d="M4 4H150V84H34L15 99V84H4Z" fill="#fff" stroke="#a7c3e2" strokeWidth="1.2" />
                <path d="M22 25H120M22 40H134M22 55H96" stroke="#c0d3e8" strokeWidth="3" strokeLinecap="round" />
                <circle cx="118" cy="65" r="3" fill="#89aed7" /><circle cx="130" cy="65" r="3" fill="#cfdeef" />
              </svg>
            </div>
            <span className="fx-cv-fragment-dot fx-cv-dot-one" />
            <span className="fx-cv-fragment-dot fx-cv-dot-two" />
          </div>
          <p className="fx-cv-number">02</p>
          <h3>Evidence and conversation,<br />pulled apart.</h3>
        </li>

        <li className="fx-cv-step fx-cv-responsibility">
          <div className="fx-cv-symbol" aria-hidden="true">
            <svg viewBox="0 0 180 150" fill="none">
              <circle cx="90" cy="73" r="49" stroke="#bbcee2" strokeWidth="1.2" strokeDasharray="4 7" />
              <circle cx="46" cy="35" r="16" fill="#fff" stroke="#a9bfd7" />
              <circle cx="135" cy="51" r="16" fill="#fff" stroke="#a9bfd7" />
              <circle cx="108" cy="120" r="16" fill="#fff" stroke="#a9bfd7" />
              <circle cx="46" cy="31" r="4" stroke="#90abc9" /><path d="M39 42C40 35 52 35 53 42" stroke="#90abc9" strokeLinecap="round" />
              <circle cx="135" cy="47" r="4" stroke="#90abc9" /><path d="M128 58C129 51 141 51 142 58" stroke="#90abc9" strokeLinecap="round" />
              <circle cx="108" cy="116" r="4" stroke="#90abc9" /><path d="M101 127C102 120 114 120 115 127" stroke="#90abc9" strokeLinecap="round" />
              <path d="M83 64C83 54 99 54 99 64C99 71 90 70 90 78" stroke="#4d7fad" strokeWidth="2" strokeLinecap="round" />
              <circle cx="90" cy="86" r="1.6" fill="#4d7fad" />
            </svg>
          </div>
          <p className="fx-cv-number">03</p>
          <h3>Uncertain responsibility<br />and follow-up</h3>
        </li>
      </ol>
    </figure>
  );
}
