import Link from "next/link";
import WorkspaceHero from "@/components/workspace/WorkspaceHero";
import StudyHeader from "./StudyHeader";

export default function HomeStudy() {
  return (
    <>
      <StudyHeader current="home" />
      <main id="main-content" tabIndex={-1} className="pb-home">
        <WorkspaceHero />
        <div className="pb-home-identity">
          <p className="pb-mono">Product Design / Interaction / AI</p>
          <h1>Ideas take shape.</h1>
        </div>
        <Link className="pb-lab-return" href="/design-lab/phase5a">Earlier studies <span aria-hidden="true">↗</span></Link>
      </main>
    </>
  );
}
