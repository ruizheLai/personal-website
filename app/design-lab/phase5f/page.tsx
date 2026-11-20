import Journey from "../phase5d/Journey";
import { About } from "../phase5d/Destinations";
import { Contact, Projects } from "../phase5e/Destinations";

export default function Page() {
  return <Journey polish rhythm about={<About />} projects={<Projects />} contact={<Contact />} />;
}
