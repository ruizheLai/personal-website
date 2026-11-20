import Image from "next/image";
import Link from "next/link";
import { fixlensAssets } from "@/lib/fixlens-assets";
import { Sippy, WillDo } from "../phase5c/Destinations";

function FixLens() {
  return <Link className="pc-room pc-fixlens pe-fixlens" href="/projects/fixlens" aria-label="Open the FixLens case study">
    <div className="pc-screens">
      {[{ asset: fixlensAssets.FX02, label: "Property manager", className: "pc-manager" },
        { asset: fixlensAssets.FX03, label: "Renter", className: "pc-renter" }].map(({ asset, label, className }) =>
        <figure className={className} key={label}>
          <Image src={asset.src} width={asset.width} height={asset.height} alt={asset.alt} unoptimized />
          <figcaption>{label}</figcaption>
        </figure>
      )}
    </div>
  </Link>;
}

const exhibition = [
  { name: "FixLens", caption: "Digital product", artwork: <FixLens /> },
  { name: "Sippy", caption: "Tangible interaction", artwork: <Sippy /> },
  { name: "WillDo", caption: "In Development", artwork: <WillDo /> },
];

export function Projects() {
  return <div className="pd-projects" aria-label="Projects">
    {exhibition.map(({ name, caption, artwork }, index) =>
      <section className="pd-project" data-project={index} key={name} aria-label={name}>
        <h2 className="pe-strip-heading">
          <span className="pd-project-strip pe-strip-static"><span>{name}</span><small>{caption}</small></span>
          <button className="pd-project-strip pe-strip-control" type="button" data-project-jump={index} aria-expanded={index === 0} aria-controls={`pe-project-${index}`}>
            <span>{name}</span><small>{caption}</small><span className="pe-strip-arrow" aria-hidden="true">↗</span>
          </button>
        </h2>
        <div className="pd-project-body" id={`pe-project-${index}`} tabIndex={-1}>{artwork}</div>
      </section>
    )}
  </div>;
}

const homeApps = [
  { label: "WeChat", icon: "wechat" },
  { label: "Facebook", icon: "facebook" },
  { label: "LinkedIn", icon: "linkedin" },
  { label: "GitHub", icon: "github" },
  { label: "Camera", icon: "camera-fill" },
  { label: "Photos", icon: "image-fill" },
  { label: "Mail", icon: "envelope-fill" },
] as const;

function Icon({ name }: { name: string }) {
  return <Image src={`/images/phase5e/icons/${name}.svg`} width={24} height={24} alt="" unoptimized />;
}

function PhoneScreen() {
  return <div className="pe-phone" aria-hidden="true">
    <div className="pe-phone-status"><span>10:08</span><span><Icon name="reception-4" /><Icon name="wifi" /><Icon name="battery-full" /></span></div>
    <div className="pe-phone-grid">
      {homeApps.slice(0,4).map(({ label, icon }) => <div className="pe-app" key={icon}>
        <span className={`pe-icon pe-icon-${icon}`}><Icon name={icon} /></span><span>{label}</span>
      </div>)}
    </div>
    <div className="pe-dock">
      {homeApps.slice(4).map(({label, icon}) => <div className="pe-app" key={icon}>
        <span className={`pe-icon pe-icon-${icon}`}><Icon name={icon} /></span><span>{label}</span>
      </div>)}
    </div>
    <div className="pe-home-line" />
  </div>;
}

export function Contact() {
  return <article className="pd-contact pe-contact">
    <PhoneScreen />
    <div className="pd-contact-copy">
      <p className="pc-eyebrow">Contact</p>
      <h2>Stay in touch.</h2>
      <p>Have something in mind? I&apos;d love to hear about it.</p>
      <a className="pe-github" href="https://github.com/ruizheLai"><Icon name="github" /> GitHub <span aria-hidden="true">↗</span></a>
      <p className="pe-closing">Thanks for stopping by.</p>
    </div>
  </article>;
}
