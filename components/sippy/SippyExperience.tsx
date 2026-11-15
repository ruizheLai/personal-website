"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { sippyMedia, sippyParts, type SippyPart } from "@/lib/sippy-assets";

type Pose = [number, number, number, number];
type Diagnostic = { p: number; h: number; heroEnd: number; handoffStart: number; handEnd: number; reduced: boolean; coreOpacity: number; open: number; poses: Record<string, Pose>; alphas: Record<string, number>; nodeIds: string[] };
declare global { interface Window { sippyState?: Diagnostic } }

export function ComponentVisual({ id }: { id: SippyPart }) {
  const item = sippyParts[id];
  return <div className={`sp-part sp-part-${id}`} data-component={id} id={`sippy-part-${id}`}>
    <div className="sp-part-images">{item.images.map((name, i) => <img key={name} src={`${sippyMedia}${name}.webp`} alt={item.alt[i]} width="1000" height="1000" />)}</div>
    <span>{item.label}</span>
  </div>;
}

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
const band = (x: number, a: number, b: number) => smooth((x - a) / (b - a));
const lerp = (a: Pose, b: Pose, t: number): Pose => a.map((v, i) => v + (b[i] - v) * t) as Pose;

export default function SippyExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    const hero = el.querySelector<HTMLElement>(".sp-hero")!;
    const arena = el.querySelector<HTMLElement>(".sp-arena")!;
    const parts = Array.from(el.querySelectorAll<HTMLElement>("[data-component]"));
    const structures = Array.from(el.querySelectorAll<HTMLElement>("[data-structure]"));
    const slots = Object.fromEntries(Array.from(el.querySelectorAll<HTMLElement>("[data-dest]")).map(e => [e.dataset.dest!, e]));
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    // React retains ownership of every node in its semantic Construction article.
    // Only its position changes. No portals, reparenting or destination image clones.
    el.classList.add("sp-enhanced");
    const draw = () => {
      frame = 0;
      const mobile = innerWidth <= 700, W = mobile ? 700 : 1100, H = mobile ? 1120 : 900;
      const ar = arena.getBoundingClientRect(), sy = scrollY;
      const scale = Math.min(ar.width / W, ar.height / H);
      const ox = ar.left + (ar.width - W * scale) / 2;
      const heroTop = hero.getBoundingClientRect().top + sy;
      const heroEnd = heroTop + hero.offsetHeight - innerHeight;
      const handoffStart = heroEnd, handEnd = heroTop + hero.offsetHeight - innerHeight * .04;
      const p = clamp((sy - heroTop) / Math.max(1, heroEnd - heroTop));
      const h = media.matches ? 1 : clamp((sy - handoffStart) / Math.max(1, handEnd - handoffStart));
      const release = Math.max(0, sy - heroEnd);
      const oy = ar.top + release + (ar.height - H * scale) / 2;
      const world = (a: Pose): Pose => [ox + a[0] * scale, oy + a[1] * scale, a[2] * scale, a[3] * scale];
      // Read geometry before any style writes; resize/image loading can change slot sizes.
      const targets = Object.fromEntries(Object.entries(slots).map(([id, e]) => {
        const r = e.getBoundingClientRect(); return [id, [r.left + r.width / 2, r.top + sy + r.height / 2, r.width, r.height] as Pose];
      }));
      const approach = band(p, .06, .22), settle = clamp((p - .22) / .07);
      const match = band(p, .30, .345), open = band(p, .34, .43), coreOpacity = match * (1 - band(p, .52, .57));
      const sway = Math.sin(settle * Math.PI * 3) * Math.sin(settle * Math.PI) * 2.2;
      const plush = lerp(mobile ? [435, 585, 270, 300] : [760, 560, 310, 344], mobile ? [350, 580, 410, 455] : [610, 540, 470, 522], approach);
      plush[0] += Math.sin(approach * Math.PI) * 18 + sway; plush[1] += sway * .55;
      const closed: Record<string, Pose> = mobile ? { upper: [350, 490, 345, 235], lower: [350, 640, 320, 200], central: [350, 550, 340, 380] } : { upper: [610, 460, 370, 255], lower: [610, 610, 350, 218], central: [610, 530, 360, 405] };
      const opened: Record<string, Pose> = mobile ? { upper: [350, 100, 245, 167], lower: [350, 1060, 190, 118], central: [350, 560, 325, 365] } : { upper: [600, 90, 240, 165], lower: [600, 800, 250, 160], central: [600, 440, 320, 360] };
      const dest: Record<SippyPart, Pose> = mobile ? {
        sensing: [155, 300, 260, 155], amplifier: [535, 300, 155, 140], control: [165, 525, 220, 185], driver: [535, 525, 185, 165], power: [155, 765, 250, 190], movement: [535, 765, 255, 195], structure: [350, 900, 170, 140],
      } : {
        sensing: [250, 235, 260, 155], amplifier: [440, 215, 145, 125], control: [860, 255, 245, 205], driver: [280, 495, 185, 170], power: [875, 550, 255, 195], movement: [585, 475, 270, 205], structure: [300, 710, 200, 155],
      };
      const timing: Record<SippyPart, [number, number]> = { sensing: [.57, .625], amplifier: [.61, .665], control: [.655, .71], power: [.70, .755], driver: [.745, .80], movement: [.79, .855], structure: [.85, .92] };
      const poses: Record<string, Pose> = {}, alphas: Record<string, number> = {};
      function place(e: HTMLElement, a: Pose, alpha: number, baseW = 240, baseH = 200) {
        const z = Math.min(a[2] / baseW, a[3] / baseH);
        // Uniform scaling keeps image proportions intact; transforms do all spatial animation.
        e.style.transform = `translate3d(${a[0] - baseW * z / 2}px,${a[1] - baseH * z / 2}px,0) scale(${z})`;
        e.style.opacity = String(alpha);
        const label = e.querySelector<HTMLElement>("span");
        if (label) { label.style.fontSize = `${Math.max(11, (mobile ? 10 : 11) / Math.max(.1, z))}px`; label.style.opacity = String(band(p, .91, .96) * (1 - band(h, 0, .12))); }
      }
      for (const e of structures) {
        const name = e.dataset.structure!;
        if (name === "cup") {
          const a = world(lerp(mobile ? [350, 416, 145, 114] : [610, 355, 125, 98], mobile ? [320, 405, 105, 83] : [570, 290, 112, 88], open));
          a[1] -= release; place(e, a, media.matches ? 0 : coreOpacity, 240, 190); poses[name] = a; alphas[name] = media.matches ? 0 : coreOpacity;
          continue;
        }
        const a = name === "plush" ? world(plush) : world(lerp(closed[name], opened[name], open));
        a[1] -= release;
        const alpha = media.matches ? 0 : name === "plush" ? 1 - match : name === "central" ? coreOpacity : match;
        const baseH = name === "upper" ? 275 : name === "lower" ? 250 : name === "plush" ? 444 : 440;
        place(e, a, alpha, 400, baseH); poses[name] = a; alphas[name] = alpha;
      }
      parts.forEach((e, i) => {
        const id = e.dataset.component as SippyPart, t = band(p, ...timing[id]);
        const center: Pose = mobile ? [350, 560, dest[id][2] * .72, dest[id][3] * .72] : [600, 440, dest[id][2] * .72, dest[id][3] * .72];
        const exploded = world(lerp(center, dest[id], t));
        const from: Pose = [exploded[0], exploded[1] + handoffStart, exploded[2], exploded[3]];
        const q = media.matches ? 1 : band(h, i * .012, .88 + i * .012);
        const a = lerp(from, targets[id], q);
        a[0] += Math.sin(Math.PI * q) * (i % 2 ? -1 : 1) * Math.min(20, innerWidth * .02);
        a[1] -= sy;
        if (h === 0 && !media.matches) { a[0] = exploded[0]; a[1] = exploded[1]; }
        const alpha = media.matches ? 1 : band(t, 0, .25);
        place(e, a, alpha); poses[id] = a; alphas[id] = alpha;
      });
      const wash = smooth(h);
      el.style.backgroundColor = `rgb(${[7, 75, 55].map((v, i) => Math.round(v + ([241, 237, 227][i] - v) * wash)).join(",")})`;
      el.querySelectorAll<HTMLElement>(".sp-build-heading,.sp-system-copy").forEach(e => { e.style.opacity = String(media.matches ? 1 : band(h, .78, .98)); });
      const desk = el.querySelector<HTMLElement>(".sp-desk")!; desk.style.opacity = String(1 - band(p, .3, .43));
      const phase = el.querySelector<HTMLElement>(".sp-phase")!;
      phase.style.opacity = String(1 - band(h, 0, .12));
      phase.textContent = p < .3 ? "A small presence on your desk." : p < .52 ? "Soft outside. Working parts inside." : "A companion, made tangible.";
      el.querySelector<HTMLElement>(".sp-story-intro")!.style.opacity = String(1 - band(h, 0, .18));
      window.sippyState = { p, h, heroEnd, handoffStart, handEnd, reduced: media.matches, coreOpacity, open, poses, alphas, nodeIds: parts.map(e => e.id) };
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule); media.addEventListener("change", schedule);
    const observer = new ResizeObserver(schedule); observer.observe(el.querySelector(".sp-systems")!);
    el.querySelectorAll("img").forEach(im => im.addEventListener("load", schedule));
    draw();
    return () => {
      cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); media.removeEventListener("change", schedule); observer.disconnect();
      el.querySelectorAll("img").forEach(im => im.removeEventListener("load", schedule));
      el.classList.remove("sp-enhanced"); delete window.sippyState;
    };
  }, []);
  return <div ref={root} className="sp-page">{children}</div>;
}

export function SippyResults() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, start = 0;
    const finish = () => { cancelAnimationFrame(frame); el.classList.add("sp-results-ready"); el.querySelectorAll<HTMLElement>("[data-value]").forEach(n => n.textContent = n.dataset.value!); };
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      if (media.matches) return finish();
      start = performance.now(); el.classList.add("sp-results-ready");
      const tick = (time: number) => { const p = smooth((time - start) / 650); el.querySelectorAll<HTMLElement>("[data-value]").forEach(n => n.textContent = String(Math.round(Number(n.dataset.value) * p))); if (p < 1) frame = requestAnimationFrame(tick); };
      frame = requestAnimationFrame(tick);
    }, { threshold: .25 });
    observer.observe(el); media.addEventListener("change", finish);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); media.removeEventListener("change", finish); };
  }, []);
  return <div className="sp-results" ref={ref}>
    <div className="sp-result"><p className="sp-stat" role="img" aria-label="65 percent"><span aria-hidden="true" data-value="65">65</span><i aria-hidden="true">%</i></p><h3>More likely to notice movement.</h3><p>Physical movement was chosen over screen-based changes by 13 of the 20 respondents.</p><div className="sp-preference" role="img" aria-label="65 percent physical movement, 35 percent screen changes"><span /><span /></div><div className="sp-chart-key"><span>Physical · 65%</span><span>Screen · 35%</span></div></div>
    <div className="sp-result"><p className="sp-stat" role="img" aria-label="90 percent"><span aria-hidden="true" data-value="90">90</span><i aria-hidden="true">%</i></p><h3>Rated movement 4 or 5.</h3><p>18 of 20 rated movement noticeability at the top two points of a five-point scale.</p><div className="sp-ratings" role="img" aria-label="Five-point ratings: 1 zero, 2 zero, 3 two, 4 seven, 5 eleven respondents">{[0, 0, 2, 7, 11].map((count, i) => <div key={i}><span>{i + 1}</span><div><i style={{ width: `${count / 11 * 100}%` }} /></div><b>{count}</b></div>)}</div></div>
  </div>;
}
