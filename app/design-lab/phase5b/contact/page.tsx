import type { Metadata } from "next";
import StudyHeader from "../StudyHeader";
import Patch from "./Patch";

export const metadata: Metadata = { title: "Make a connection" };

export default function ContactStudy() {
  return (
    <>
      <StudyHeader current="contact" />
      <main id="main-content" tabIndex={-1} className="pb-contact pb-edge">
        <div className="pb-section-lead">
          <h1>Make a connection<span>.</span></h1>
          <p>You can find me on GitHub.</p>
        </div>
        <Patch />
      </main>
    </>
  );
}
