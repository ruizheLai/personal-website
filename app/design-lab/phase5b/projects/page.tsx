import type { Metadata } from "next";
import Link from "next/link";
import StudyHeader from "../StudyHeader";
import Exhibition from "./Exhibition";

export const metadata: Metadata = { title: "Two projects, two worlds" };

export default function ProjectsStudy() {
  return (
    <>
      <StudyHeader current="projects" />
      <main id="main-content" tabIndex={-1} className="pb-projects pb-edge">
        <div className="pb-projects-entry">
          <h1>Two projects, <span>two worlds.</span></h1>
          <nav aria-label="Open a case study" className="pb-case-links">
            <Link href="/projects/fixlens"><span className="pb-case-dot" />FixLens <span aria-hidden="true">↗</span></Link>
            <Link href="/projects/sippy"><span className="pb-case-dot pb-case-dot-green" />Sippy <span aria-hidden="true">↗</span></Link>
          </nav>
        </div>
        <Exhibition />
        <aside className="pb-willdo" aria-label="Future project">
          <span className="pb-mono">03 / Future work</span>
          <h2>WillDo</h2>
          <p>In Development</p>
        </aside>
      </main>
    </>
  );
}
