import Journey from "../phase5d/Journey";
import { Contact, Projects } from "../phase5e/Destinations";
import About from "./About";

export default function Page() {
  return <Journey polish rhythm adaptive animated about={<About />} projects={<Projects />} contact={<Contact />} />;
}
