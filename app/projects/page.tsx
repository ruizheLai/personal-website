import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
export const metadata: Metadata = { title: "Projects" };
const projects = ["WillDo", "MenuLab", "FixLens", "Sippy"];
export default function ProjectsPage() {
  return (
    <ContentPage title="Selected work" intro="Four projects, with more to share soon. These entries are placeholders for future project details.">
      <div className="project-grid">
        {projects.map((name, index) => <article className="project-card" key={name}><div className={`project-cover cover-${index}`} aria-hidden="true"><span>{name.slice(0, 1)}</span><small>{String(index + 1).padStart(2, "0")}</small></div><div className="project-caption"><h2>{name}</h2><span>Details coming soon</span></div><p>Project placeholder · Case study to be added.</p></article>)}
      </div>
    </ContentPage>
  );
}
