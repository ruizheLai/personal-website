import Journey from "../phase5d/Journey";
import { Contact, Projects } from "../phase5e/Destinations";
import { AboutWhiteFilter, CinematicAbout } from "./AboutMedia";

export default function Page() {
  return <>
    <AboutWhiteFilter />
    <Journey polish rhythm adaptive animated cinematicLocks refinedCinematics navigationPolish
      about={<CinematicAbout />} projects={<Projects cleanHeaders />} contact={<Contact />} />
  </>;
}
