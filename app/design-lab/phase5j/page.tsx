import Journey from "../phase5d/Journey";
import { Contact, Projects } from "../phase5e/Destinations";
import About from "../phase5h/About";
import { size } from "./frames";

export default function Page() {
  return <Journey polish rhythm adaptive animated scrollFrames about={<About motion={
    <div className="pj-media">
      <div className="pj-images" />
      <div className="pj-video">
        <video className="pj-decoder" muted playsInline preload="none" />
        <canvas width={size} height={size} />
      </div>
      <output className="pj-diagnostics" hidden />
    </div>
  } />} projects={<Projects />} contact={<Contact />} />;
}
