import Image from "next/image";
import { mediaRoot } from "./timeline";

const capabilities = [
  ["Understand the Problem", "Break down complex challenges and identify meaningful problems to solve."],
  ["Research the People", "Understand users, behaviours and needs through research."],
  ["Design the Experience", "Translate insights into intuitive flows, interactions and interfaces."],
  ["Build & Iterate", "Turn ideas into working prototypes and products, then test and improve them."],
];

function Still({ name }: { name: string }) {
  return <Image className="ph-still" src={`${mediaRoot}/${name}.webp`} alt="" width={940} height={940} unoptimized />;
}

export default function About() {
  return <article className="ph-about">
    <div className="ph-screen" aria-hidden="true">
      <canvas className="ph-film" width="940" height="940" />
    </div>
    <div className="ph-copy">
      <section data-copy="intro">
        <Still name="intro" />
        <h2>Hi, I&apos;m Ruizhe.</h2>
        <p className="ph-lede">Product Designer &amp; Builder.</p>
        <p>I like understanding real problems, designing thoughtful experiences, and bringing ideas to life through technology.</p>
      </section>
      <section data-copy="education">
        <Still name="education" />
        <h2>From Design to Technology.</h2>
        <dl className="ph-list"><div data-step="0"><dt>Design</dt><dd>Undergraduate background.</dd></div>
        <div data-step="1"><dt>Master of Information Technology</dt><dd>University of Melbourne.</dd></div></dl>
      </section>
      <section data-copy="capabilities">
        <Still name="capabilities" />
        <h2>From Problems to Products.</h2>
        <ol className="ph-list">
          {capabilities.map(([title, text], index) => <li data-step={index} key={title}>
            <span aria-hidden="true">0{index+1}</span><div><h3>{title}</h3><p>{text}</p></div>
          </li>)}
        </ol>
      </section>
      <section data-copy="interests">
        <Still name="interests" />
        <h2>Beyond Work.</h2>
        <ul className="ph-interests">{["Football","Basketball","Running","Cycling"].map(interest => <li key={interest}>{interest}</li>)}</ul>
      </section>
    </div>
  </article>;
}
