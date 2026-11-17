import type { Metadata } from "next";
import Link from "next/link";
import SippyExperience, { ComponentVisual, SippyResults } from "@/components/sippy/SippyExperience";
import { sippyMedia as M } from "@/lib/sippy-assets";
import BehaviourStory from "@/components/sippy/BehaviourStory";
import ResponseArchitecture from "@/components/sippy/ResponseArchitecture";
import MakingStory from "@/components/sippy/MakingStory";
import "./sippy.css";
import "./storytelling.css";
import "./refinement.css";

const siteHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const metadata: Metadata = {
  metadataBase: new URL(siteHost ? `https://${siteHost}` : "http://localhost:3104"),
  title: "Sippy — A small companion with a little persistence",
  description: "A tangible interaction case study: a moving desktop companion, its physical construction, and what 20 showcase responses revealed about noticeability.",
  openGraph: { title: "Sippy — A small desktop companion", description: "From a playful presence to the technology inside.", images: [{ url: "/images/sippy/project-cover.jpg", width: 1200, height: 800 }] },
  other: { "page-type": "product", "site-kind": "tech" },
};

export default function SippyPage() {
  return <SippyExperience><main id="main-content" className="sp-main" tabIndex={-1}>
    <section className="sp-hero" aria-labelledby="sippy-title">
      <div className="sp-stage">
        <div className="sp-story-intro">
          <Link className="sp-back" href="/projects">← All projects</Link>
          <h1 id="sippy-title">Sippy<span aria-hidden="true">.</span></h1>
          <p>A playful desktop companion exploring<br className="sp-desktop-break" /> physical reminders during focused work.</p>
          <span className="sp-project-type">Tangible interaction · Physical computing · Group project</span>
        </div>
        <div className="sp-arena" role="img" aria-label="Sippy has colourful fur, expressive eyes and an upright coffee cup. The scroll study reveals its intact mechanism, followed by the component groups explained below."><div className="sp-desk" /><img className="sp-still" src={`${M}plush.webp`} width="571" height="633" alt="Sippy's colourful fur, expressive eyes and upright coffee cup" fetchPriority="high" /></div>
        <p className="sp-phase" aria-hidden="true">A small presence on your desk.</p>
      </div>
      <div className="sp-structure-layers" aria-hidden="true">
        {(["plush", "upper", "central", "lower"] as const).map(name => <div className={`sp-layer sp-layer-${name}`} data-structure={name} key={name}><img src={`${M}${name === "central" ? "structure-only" : name === "upper" ? "upper-shell" : name === "lower" ? "lower-shell" : "plush"}.webp`} width="1000" height="1000" alt="" /></div>)}
      </div>
    </section>

    <section id="construction" className="sp-build sp-wrap" aria-labelledby="build-title">
      <div className="sp-build-heading"><p className="sp-kicker">A soft exterior. A working system.</p><h2 id="build-title">How a Small Companion<br />Was Built</h2></div>
      <div className="sp-systems">
        <article className="sp-system sp-sensing"><div className="sp-system-copy"><h3>Sensing</h3><p>A load cell beneath the cup holder senses weight changes. The documented HX711 Load Cell Amplifier passes readings to the controller, allowing cup placement and removal to affect the interaction.</p></div><div className="sp-slot-pair"><div className="sp-slot" data-dest="sensing"><ComponentVisual id="sensing" /></div><div className="sp-slot" data-dest="amplifier"><ComponentVisual id="amplifier" /></div></div></article>
        <article className="sp-system sp-control"><div className="sp-system-copy"><h3>Control</h3><p>An ESP32 coordinates sensing and movement within the physical prototype.</p></div><div className="sp-slot" data-dest="control"><ComponentVisual id="control" /></div></article>
        <article className="sp-system sp-power"><div className="sp-system-copy"><h3>Power</h3><p>LiPo and 18650 battery systems provide portable power for sensing and movement. The three-cell holder is shown as one assembly; the visuals do not establish exact ratings or wiring.</p></div><div className="sp-slot" data-dest="power"><ComponentVisual id="power" /></div></article>
        <article className="sp-system sp-movement"><div className="sp-system-copy"><h3>Motorised movement</h3><p>A motor driver controls two DC gear motors. Two wheels and a ball caster support movement across the desk, turning a reminder into a physical presence.</p></div><div className="sp-slot-pair"><div className="sp-slot" data-dest="driver"><ComponentVisual id="driver" /></div><div className="sp-slot" data-dest="movement"><ComponentVisual id="movement" /></div></div></article>
        <article className="sp-system sp-construction"><div className="sp-system-copy"><h3>Construction</h3><p>3D-printed shells and a cup holder surround the internal assembly. Laser-cut platforms, a chassis and metal mounts support the hardware; the plush finish changes how the device feels on a desk.</p></div><div className="sp-slot" data-dest="structure"><ComponentVisual id="structure" /></div></article>
      </div>
      <p className="sp-contribution">I was a major contributor to this group project. The early Coffee Time exploration shown below is my individual work; the final device and evaluation were team efforts.</p>
    </section>

    <BehaviourStory />

    <ResponseArchitecture />

    <MakingStory />

    <section className="sp-evaluation" aria-labelledby="notice-title"><div className="sp-wrap">
      <div className="sp-section-heading"><h2 id="notice-title">Did People<br /><em>Notice?</em></h2><p>20 questionnaire responses at the showcase offer a first look at perceived noticeability.</p></div>
      <SippyResults />
      <div className="sp-evidence-note"><p><strong>Noticeability is a beginning.</strong> These short-term responses do not demonstrate changes in drinking habits, hydration or long-term acceptance.</p><p>The team also reported nine functional checks as passed. Without repeated-trial logs or error rates, that checklist is evidence of tested functions, not an independent reliability measure.</p></div>
    </div></section>

    <section className="sp-reflection sp-wrap" aria-labelledby="reflection-title"><div className="sp-reflection-heading"><p className="sp-kicker">Reflection</p><h2 id="reflection-title">When Distraction<br />Becomes <em>Care</em></h2></div><div className="sp-reflection-copy"><p className="sp-lead">A reminder needs enough presence to interrupt focus, and enough restraint to be welcome.</p><p>Sippy made that tension tangible. Movement could attract attention, but timing, user control and the freedom to pause matter just as much. More reliable sensing and motion, and observation over longer use, would be needed to understand whether that initial charm lasts.</p><Link className="sp-return" href="/projects">Back to Projects <span aria-hidden="true">↗</span></Link></div></section>

    <footer className="sp-footer sp-wrap"><p>Sippy · Tangible interaction · Group project</p><p>Hero and component arrangement: explanatory reconstruction. Demonstration clips: authentic project footage.</p><p>Controller image: <a href="https://learn.adafruit.com/assets/117185">Kattni Rembor / Adafruit</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>, background removed. Amplifier, driver and load-cell references: <a href="https://core-electronics.com.au/">Core Electronics</a>. Supplied hardware illustrations are representative; the amplifier photo is marked HX710, while the report documents HX711.</p></footer>
  </main></SippyExperience>;
}
