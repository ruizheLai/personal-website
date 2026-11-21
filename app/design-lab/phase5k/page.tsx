import Journey from "../phase5d/Journey";
import { Contact, Projects } from "../phase5e/Destinations";
import About from "../phase5h/About";
import FrameStage from "../phase5j/FrameStage";

export default function Page() {
  return <Journey polish rhythm adaptive animated scrollFrames pausedPolish
    about={<About motion={<FrameStage />} />} projects={<Projects />} contact={<Contact />} />;
}
