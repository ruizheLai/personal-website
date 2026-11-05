import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContentPage from "@/components/layout/ContentPage";
import { fixlensAssets as A } from "@/lib/fixlens-assets";
import "./projects.css";

export const metadata: Metadata = { title: "Projects" };
const projects = ["WillDo", "MenuLab", "FixLens", "Sippy"];
export default function ProjectsPage() {
  return (
    <ContentPage title="Selected work" intro="Exploring how thoughtful design can make everyday experiences clearer. Start with FixLens, from research to a working product.">
      <div className="project-grid">
        {projects.map((name, index) => name === "FixLens" ? (
          <article className="project-card project-fixlens" key={name}>
            <Link href="/projects/fixlens" className="project-fixlens-link" aria-label="FixLens — Read the UX case study">
              <div className="project-cover project-fixlens-cover">
                <Image className="project-fixlens-dashboard" src={A.FX02.src} width={A.FX02.width} height={A.FX02.height} alt="FixLens property manager maintenance dashboard" unoptimized />
                <Image className="project-fixlens-phone" src={A.FX03.src} width={A.FX03.width} height={A.FX03.height} alt="FixLens renter Home screen" unoptimized />
                <small>UX RESEARCH · PRODUCT DESIGN · DEVELOPMENT</small>
              </div>
              <div className="project-caption"><h2>FixLens</h2><span>View case study ↗</span></div>
              <p>Connecting rental maintenance, from first report to follow-up.</p>
            </Link>
          </article>
        ) : (
          <article className="project-card" key={name}>
            <div className={`project-cover cover-${index}`} aria-hidden="true"><span>{name.slice(0, 1)}</span><small>{String(index + 1).padStart(2, "0")}</small></div>
            <div className="project-caption"><h2>{name}</h2><span>Details coming soon</span></div>
            <p>Project placeholder · Case study to be added.</p>
          </article>
        ))}
      </div>
    </ContentPage>
  );
}
