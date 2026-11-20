import Journey from "../phase5d/Journey";
import { About } from "../phase5d/Destinations";
import { Contact, Projects } from "./Destinations";

export default function Page() {
  return <Journey polish about={<About />} projects={<Projects />} contact={<Contact />} />;
}
