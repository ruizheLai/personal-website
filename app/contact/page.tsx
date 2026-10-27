import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <ContentPage title="Contact" intro="A place to connect. More contact details will be added soon.">
      <div className="contact-list">
        <section><span className="section-note">Find me online</span><h2>GitHub</h2><a className="contact-link" href="https://github.com/ruizheLai" target="_blank" rel="noopener noreferrer">github.com/ruizheLai <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></section>
        <section><span className="section-note">To be added</span><h2>Contact details</h2><p>Email and any additional verified social links will appear here.</p></section>
      </div>
    </ContentPage>
  );
}
