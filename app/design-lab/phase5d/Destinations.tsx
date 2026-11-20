import Image from "next/image";
import { FixLens, Sippy, WillDo } from "../phase5c/Destinations";

const story = [
  { title: "Hi, I'm Ruizhe.", text: "I design digital experiences—and enjoy figuring out how to make them real." },
  { label: "Product Design", title: "Start with the problem.", text: "I like turning complicated experiences into something clearer and more useful." },
  { label: "Interaction Design", title: "Make it feel right.", text: "The little details—movement, feedback, timing—can change how an experience feels." },
  { label: "Technology & Building", title: "Prototype. Test. Refine.", text: "From interfaces to physical prototypes and AI experiments, I learn by making." },
  { label: "Beyond the Screen", title: "Outside the work.", text: "Football, basketball, running, and probably another coffee." },
];

export function About() {
  return <article className="pd-about">
    <div className="pd-avatar-mat">
      <Image className="pd-avatar" src="/images/phase5d/avatar.webp" alt="Ruizhe's original cartoon avatar in glasses and a navy suit" width={768} height={768} unoptimized />
    </div>
    <div className="pd-story">
      {story.map(({ title, label, text }, index) => <section className="pd-beat" data-beat={index} key={title}>
        <p className="pc-eyebrow">{label ?? "About"}</p>
        <h2>{title}</h2>
        <p className="pd-story-copy">{text}</p>
        {index === 0 && <p className="pd-background">UI/UX Design · Master of Information Technology, University of Melbourne</p>}
      </section>)}
    </div>
  </article>;
}

const exhibitions = [
  { name: "FixLens", caption: "Digital product", visual: <FixLens />, thumb: "/images/phase5d/fix-thumb.webp" },
  { name: "Sippy", caption: "Tangible interaction", visual: <Sippy />, thumb: "/images/sippy/plush.webp" },
  { name: "WillDo", caption: "In Development", visual: <WillDo /> },
];

export function Projects() {
  return <div className="pd-projects" aria-label="Projects">
    {exhibitions.map(({ name, caption, visual, thumb }, index) => <section className="pd-project" data-project={index} key={name} aria-label={name}>
      <div className="pd-project-strip">
        <span>{name}</span>
        <small>{caption}</small>
        {thumb && <Image unoptimized src={thumb} alt="" width={120} height={64} />}
      </div>
      <div className="pd-project-body">{visual}</div>
    </section>)}
  </div>;
}

export function Contact() {
  return <article className="pd-contact">
    <div className="pd-contact-copy">
      <p className="pc-eyebrow">Contact</p>
      <h2>Stay in touch.</h2>
      <p>Have something in mind? I'd love to hear about it.</p>
      <span>Thanks for stopping by.</span>
    </div>
    <div className="pd-contact-apps">
      <div className="pd-ghost-apps" aria-hidden="true">
        <span><b>••</b>WeChat</span><span><b>f</b>Facebook</span><span><b>in</b>LinkedIn</span><span><b>✉</b>Mail</span>
      </div>
      <a href="https://github.com/ruizheLai"><span className="pd-gitmark" aria-hidden="true">&lt;/&gt;</span><span><strong>GitHub</strong><small>@ruizheLai</small></span><span aria-hidden="true">↗</span></a>
      <p>GitHub is the available contact link.</p>
    </div>
  </article>;
}
