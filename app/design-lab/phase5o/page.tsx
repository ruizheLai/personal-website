import Journey from "../phase5d/Journey";
import { Contact, Projects } from "../phase5e/Destinations";
import { AboutWhiteFilter, CinematicAbout } from "../phase5n/AboutMedia";

export default function Page() {
  return <>
    <AboutWhiteFilter />
    <Journey polish rhythm adaptive animated cinematicLocks refinedCinematics navigationPolish bidirectionalNavigation
      about={<CinematicAbout />} projects={<Projects cleanHeaders />}
      contact={<Contact simplePhone email="bradleylai6@gmail.com" />} />
  </>;
}
