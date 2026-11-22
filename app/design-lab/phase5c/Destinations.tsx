import Image from "next/image";
import Link from "next/link";
import { fixlensAssets as assets } from "@/lib/fixlens-assets";

export function FixLens() {
  return <article className="pc-room pc-fixlens">
    <header><p>Digital product</p><h2>FixLens</h2></header>
    <div className="pc-screens">
      <Link href="/projects/fixlens" className="pc-manager" aria-label="Open FixLens case study from the property manager dashboard">
        <Image src={assets.FX02.src} width={1404} height={570} alt={assets.FX02.alt} unoptimized />
        <span>Property manager <i aria-hidden="true">↗</i></span>
      </Link>
      <Link href="/projects/fixlens" className="pc-renter" aria-label="Open FixLens case study from the renter interface">
        <Image src={assets.FX03.src} width={390} height={844} alt={assets.FX03.alt} unoptimized />
        <span>Renter <i aria-hidden="true">↗</i></span>
      </Link>
    </div>
  </article>;
}

export function Sippy() {
  return <article className="pc-room pc-sippy">
    <Link href="/projects/sippy" className="pc-sippy-link" aria-label="Open the Sippy case study">
      <header><p>Tangible interaction</p><h2>Sippy <i aria-hidden="true">↗</i></h2></header>
      <div className="pc-sippy-stage">
        <Image src="/images/sippy/plush.webp" width={571} height={633} alt="Sippy's original plush prototype with expressive eyes and a cup" unoptimized />
      </div>
    </Link>
  </article>;
}

export function WillDo() {
  return <article className="pc-room pc-willdo">
    <div className="pc-type-frame">
      <p><i aria-hidden="true" />In Development</p>
      <h2>WillDo</h2>
    </div>
  </article>;
}

export function About() {
  return <article className="pc-room pc-about">
    <div className="pc-about-intro">
      <div><p className="pc-eyebrow">About</p><h2>Ruizhe Lai</h2></div>
      <p>I design products and interactions, then build prototypes to see how they work in practice.</p>
    </div>
    <dl>
      <div><dt>Product design</dt><dd>I look at how people make decisions across a service, especially at the points where responsibility changes hands.</dd></div>
      <div><dt>Interaction design</dt><dd>I pay attention to what makes an action clear and what helps someone recover when it goes wrong.</dd></div>
      <div><dt>Technology &amp; building</dt><dd>I work across software and physical prototypes to test what the experience needs from the system behind it.</dd></div>
      <div><dt>Interests</dt><dd>I’m interested in expressive objects and the ways everyday gestures can become inputs.</dd></div>
    </dl>
  </article>;
}

export function Contact() {
  return <article className="pc-room pc-contact">
    <div className="pc-contact-note">
      <p className="pc-eyebrow">Contact</p>
      <h2>Find me<br />on GitHub.</h2>
      <a href="https://github.com/ruizheLai">@ruizheLai <i aria-hidden="true">↗</i></a>
    </div>
  </article>;
}
