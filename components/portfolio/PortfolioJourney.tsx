import Journey from "@/app/design-lab/phase5d/Journey";
import { Contact, Projects } from "@/app/design-lab/phase5e/Destinations";
import { AboutWhiteFilter, CinematicAbout } from "@/app/design-lab/phase5n/AboutMedia";
import "@/app/design-lab/phase5c/phase5c.css";
import "@/app/design-lab/phase5d/phase5d.css";
import "@/app/design-lab/phase5e/phase5e.css";
import "@/app/design-lab/phase5g/phase5g.css";
import "@/app/design-lab/phase5h/phase5h.css";
import "@/app/design-lab/phase5j/phase5j.css";
import "@/app/design-lab/phase5l/phase5l.css";
import "@/app/design-lab/phase5n/phase5n.css";
import "@/app/design-lab/phase5o/phase5o.css";
import "./portfolio.css";

export default function PortfolioJourney() {
  return <div className="pc-study pd-study pe-study pg-study ph-study pj-study pl-study">
    <div className="pn-study">
      <div className="po-study pp-portfolio">
        <AboutWhiteFilter />
        <Journey polish rhythm adaptive animated cinematicLocks refinedCinematics navigationPolish bidirectionalNavigation productionExperience
          about={<CinematicAbout />} projects={<Projects cleanHeaders />}
          contact={<Contact simplePhone email="bradleylai6@gmail.com" />} />
      </div>
    </div>
  </div>;
}
