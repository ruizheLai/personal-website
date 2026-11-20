import Journey from "./Journey";
import { About, Projects, Contact } from "./Destinations";

export default function Page() {
  return <Journey about={<About />} projects={<Projects />} contact={<Contact />} />;
}
