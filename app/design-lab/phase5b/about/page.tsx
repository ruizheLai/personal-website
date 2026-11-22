import type { Metadata } from "next";
import StudyHeader from "../StudyHeader";
import Workbench from "./Workbench";

export const metadata: Metadata = { title: "How I work" };

export default function AboutStudy() {
  return (
    <>
      <StudyHeader current="about" />
      <main id="main-content" tabIndex={-1} className="pb-about pb-edge">
        <div className="pb-section-lead">
          <h1>How I work<span>.</span></h1>
          <p>I use design, technology and prototypes to find out how an idea feels in practice.</p>
        </div>
        <Workbench />
      </main>
    </>
  );
}
