import Journey from "../phase5d/Journey";
import { Contact, Projects } from "../phase5e/Destinations";
import About from "../phase5h/About";
import { initialPoster } from "./beats";

export default function Page() {
  return <Journey polish rhythm adaptive animated triggered about={<About motion={
    <div className="pi-player" data-state="idle">
      {/* The same image element holds frame-aligned local posters between actions. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={initialPoster} alt="" width={768} height={768} />
      <video muted playsInline preload="none" />
    </div>
  } />} projects={<Projects />} contact={<Contact />} />;
}
