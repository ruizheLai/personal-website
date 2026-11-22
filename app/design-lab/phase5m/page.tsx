import Journey from "../phase5d/Journey";
import { Contact, Projects } from "../phase5e/Destinations";
import About from "../phase5h/About";
import { initialPose } from "../phase5l/timeline";

export default function Page() {
  return <Journey polish rhythm adaptive animated cinematicLocks refinedCinematics about={<About motion={
    <div className="pl-media">
      {/* The single image is updated to the current decoded hold frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={initialPose} width={768} height={768} alt="" />
      <video muted playsInline preload="none" />
    </div>
  } />} projects={<Projects />} contact={<Contact />} />;
}
