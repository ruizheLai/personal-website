import Journey from "../phase5d/Journey";
import { Contact, Projects } from "../phase5e/Destinations";
import About from "../phase5h/About";
import { initialPose } from "../phase5l/timeline";

// Keep midtones intact and roll the brightest source pixels up to page white.
const whitePoint = Array.from({ length: 65 }, (_, index) => {
  const value = index / 64;
  return Math.min(1, value + Math.max(0, value - .89) * .3).toFixed(4);
}).join(" ");

export default function Page() {
  return <>
    <svg className="pn-filters" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="pn-white" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="table" tableValues={whitePoint} />
            <feFuncG type="table" tableValues={whitePoint} />
            <feFuncB type="table" tableValues={whitePoint} />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
    <Journey polish rhythm adaptive animated cinematicLocks refinedCinematics navigationPolish about={<About educationDetails motion={
      <div className="pl-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={initialPose} width={768} height={768} alt="" />
        <video muted playsInline preload="none" />
      </div>
    } />} projects={<Projects cleanHeaders />} contact={<Contact />} />
  </>;
}
