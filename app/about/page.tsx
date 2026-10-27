import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
export const metadata: Metadata = { title: "About" };
export default function AboutPage() {
  return (
    <ContentPage title="About" intro="A space for the story behind the work. More about me will be added here soon.">
      <div className="about-grid">
        {[{ title: "Background", text: "A personal introduction and background will be added here." }, { title: "Experience", text: "Selected experience and roles will be added here." }, { title: "Education", text: "Education details will be added here." }, { title: "Focus areas", text: "Interests and areas of focus will be added here." }].map(section => <section className="text-section" key={section.title}><span className="section-note">To be added</span><h2>{section.title}</h2><p>{section.text}</p></section>)}
      </div>
    </ContentPage>
  );
}
