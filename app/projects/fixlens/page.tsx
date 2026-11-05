import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { AssetFigure as Figure, CaseStudyExperience, HorizontalGallery } from "@/components/fixlens/CaseStudyExperience";
import StoryNavigation from "@/components/fixlens/StoryNavigation";
import ChallengeVisual from "@/components/fixlens/ChallengeVisual";
import MatchedComparison from "@/components/fixlens/MatchedComparison";
import EvaluationResults from "@/components/fixlens/EvaluationResults";
import { fixlensAssets as A } from "@/lib/fixlens-assets";
import "./fixlens.css";
import "./challenge-visual.css";
import "./matched-comparison.css";
import "./evaluation-results.css";
import "./natural-zoom.css";
import "./fixlens-refinement.css";
import "./story-navigation.css";
import "./fixlens-editorial.css";
import "./editorial-motion.css";

export const metadata: Metadata = {
  title: "FixLens — From report to follow-up",
  description: "An end-to-end UX case study: eight interviews, a six-person prototype evaluation, and a deployed rental-maintenance exhibition application.",
};

function SectionHeading({ number, label, title, children }: { number: string; label: string; title: ReactNode; children?: ReactNode }) {
  return <div className="fx-section-heading" data-fx-motion="heading"><p className="fx-kicker"><span>{number}</span> {label}</p><h2>{title}</h2>{children && <div className="fx-prose">{children}</div>}</div>;
}

function SupportNotes({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <details className={"fx-support " + className}><summary>{label}<span aria-hidden="true">+</span></summary><div className="fx-support-content">{children}</div></details>;
}

function Stage({ label, id }: { label: string; id: keyof typeof A }) {
  return <div className={"fx-stage fx-stage-" + id.toLowerCase()} data-fx-motion-item><p className="fx-stage-label">{label}</p><Figure asset={A[id]} /></div>;
}

function BrowserBar() {
  return <div className="fx-browser-bar"><span className="fx-browser-dots" aria-hidden="true"><i /><i /><i /></span><span>Property manager portal</span><span aria-hidden="true">↗</span></div>;
}

export default function FixLensPage() {
  return <CaseStudyExperience><main id="main-content" className="fx-case" tabIndex={-1}>
    <div className="fx-container">
      <div className="fx-breadcrumb"><Link href="/projects"><span aria-hidden="true">←</span> All projects</Link><span>Product design · 2026</span></div>
      <section className="fx-hero" aria-labelledby="fixlens-title">
        <div className="fx-hero-heading" data-fx-motion="heading"><div><p className="fx-kicker">A connected maintenance workflow</p><h1 id="fixlens-title">Fix<span>Lens</span><span className="fx-title-dot" aria-hidden="true">.</span></h1></div><p className="fx-hero-subtitle">Making rental maintenance clearer, from first report to <span className="fx-nowrap">follow-up.</span></p></div>
        <div className="fx-scroll-scene" data-fx-motion="image"><div className="fx-parallax-layer fx-parallax-slow"><div className="fx-hero-stage fx-art-hero">
          <div className="fx-art-hero-browser"><BrowserBar /><Figure asset={A.FX02} className="fx-art-dashboard" priority sizes="(max-width: 600px) 95vw, 85vw" /></div>
          <div className="fx-art-hero-phone"><span className="fx-art-device-label">Renter experience</span><Figure asset={A.FX03} className="fx-art-phone" priority sizes="(max-width: 600px) 240px, 310px" /></div>
        </div></div></div>
        <div className="fx-overview" data-fx-motion="body"><p className="fx-lead">Help renters explain the problem. Give property managers the context to move it forward.</p><div><p>I independently researched, designed, evaluated and developed FixLens from August–October 2026. AI-assisted development brought the mobile web app and management portal into a functional exhibition application.</p><a className="fx-live-link" href="https://fix-lens.app/" target="_blank" rel="noopener noreferrer">Visit the live application <span aria-hidden="true">↗</span></a></div></div>
      </section>
      <StoryNavigation />

      <section id="challenge" className="fx-section">
        <SectionHeading number="02" label="The challenge" title="Reporting a problem is only the beginning." />
        <ChallengeVisual />
        <div className="fx-hmw"><span className="fx-kicker">The design opportunity</span><p>How might we make issues easier to explain—and keep the context connected through review and follow-up?</p></div>
        <SupportNotes label="The limits of better evidence"><p>Clearer evidence alone cannot remove approval, cost or contractor delays. The design opportunity concerns communication and continuity, rather than a claim to resolve every barrier to maintenance.</p></SupportNotes>
      </section>

      <section id="research" className="fx-section">
        <SectionHeading number="03" label="Research & design direction" title="Understand both sides of reporting."><p>Eight semi-structured interviews explored how issues were reported, which information mattered, and where communication became difficult.</p></SectionHeading>
        <div className="fx-research-intro" data-fx-motion="body"><p className="fx-sample"><strong>8</strong><span>exploratory interviews<br /><b>6 renters · 2 landlords</b></span></p><p>The focus shifted from collecting more photographs to collecting the right information—and preserving its context.</p></div>
        <div className="fx-insights" data-fx-motion="research">
          <article data-fx-motion-item><span className="fx-insight-number">01</span><div><h3>Evidence depends on the issue.</h3><p>An overview establishes context; a close-up reveals detail. Intermittent faults also need timing, triggers and functional impact.</p></div><div className="fx-principle"><h4>Capture relevant context.</h4><p>Guide people toward useful information for the issue.</p></div></article>
          <article data-fx-motion-item><span className="fx-insight-number">02</span><div><h3>Guidance belongs before submission.</h3><p>Renters do not always know what will help someone assess an issue. Missing details lead to more questions.</p></div><div className="fx-principle"><h4>Guide, don't overwhelm.</h4><p>Use manageable prompts and explicit confirmation.</p></div></article>
          <article data-fx-motion-item><span className="fx-insight-number">03</span><div><h3>A case needs continuity.</h3><p>Requests and handoffs can spread across channels, leaving renters unsure who is responsible or whether to act.</p></div><div className="fx-principle"><h4>Keep it connected.</h4><p>Attach requests, responses and next steps to the case.</p></div></article>
        </div>
        <SupportNotes label="Research approach & change in direction"><p>I used coding and thematic analysis to identify recurring patterns across the interviews. I initially approached the problem through spatial and visual evidence; the research broadened the opportunity to relevant information, guidance and continuity as a case progresses.</p></SupportNotes>
      </section>

      <section id="exploration" className="fx-section">
        <SectionHeading number="04" label="Low-fi exploration" title="Find the shape of the conversation." />
        <p className="fx-hand-note" aria-hidden="true">early explorations</p>
        <div className="fx-scroll-scene" data-fx-motion="image"><div className="fx-parallax-layer fx-parallax-slow"><div className="fx-curated-sketches">
          <Figure asset={A.homeSketch} className="fx-sketch-main" caption="A clear starting point" sizes="(max-width: 600px) 78vw, 420px" />
          <Figure asset={A.captureSketch} className="fx-sketch-capture" caption="Guidance at capture" sizes="(max-width: 600px) 55vw, 310px" />
          <Figure asset={A.trackingSketch} className="fx-sketch-tracking" caption="Progress and next steps" sizes="(max-width: 600px) 50vw, 290px" />
        </div></div></div>
        <p className="fx-prose fx-narrow fx-design-takeaway" data-fx-motion="body">The direction became a guided conversation with structured information and explicit confirmation, keeping the renter in control.</p>
        <SupportNotes label="View the original sketch sheets" className="fx-sketch-sources"><div className="fx-source-sheets"><Figure asset={A.FX08} caption="Navigation alternatives" /><Figure asset={A.FX09} caption="Capture and progress" /><Figure asset={A.FX10} caption="Connected reporting flow" /></div></SupportNotes>
      </section>

      <section id="evolution" className="fx-section">
        <SectionHeading number="05" label="Mid-fi → Hi-fi" title={<>Structure the journey.<br />Refine the interaction.</>} />
        <div className="fx-home-comparison"><div className="fx-comparison-intro"><span className="fx-kicker">Home & navigation</span><h3>Same starting point.<br />A more considered interface.</h3><p>Three clear entry points. A recent case. Navigation always within reach.</p></div><MatchedComparison mid={A.FX11} high={A.FX16} label="Home & navigation" /></div>
        <div className="fx-tracking-comparison"><div className="fx-topic-heading"><h3>Give progress a place.</h3><p>From case progress to a timeline of activity.</p></div><div className="fx-two-stages" data-fx-motion="comparison"><Stage label="Mid-fi" id="FX13" /><Stage label="Hi-fi" id="FX19" /></div></div>
        <SupportNotes label="Explore the reporting flow"><HorizontalGallery label="Prototype reporting flow"><Figure asset={A.FX17} caption="Confirm property details · personal values redacted" /><Figure asset={A.FX37} caption="Describe the issue" /><Figure asset={A.FX38} caption="Check or edit the interpretation" /><Figure asset={A.FX39} caption="Choose the safety branch" /></HorizontalGallery><div className="fx-branch-label"><span>After the safety choice</span><span aria-hidden="true">↙ &nbsp; ↘</span></div><div className="fx-branches"><div><p className="fx-stage-label">Danger reported →</p><Figure asset={A.FX40} caption="Avoid approaching the area; contact relevant help." /></div><span className="fx-or">or</span><div><p className="fx-stage-label">Safe to continue →</p><Figure asset={A.FX41} caption="Introduce the planned evidence sequence." /></div></div></SupportNotes>
        <SupportNotes label="Prototype scope & capture exploration"><div className="fx-capture-note"><Figure asset={A.FX12} caption="Mid-fi capture wireframe" /><div><p>The Mid-fi capture wireframe established framing prompts and the planned evidence sequence. A corresponding cleared Hi-fi capture screen is unavailable, so it is not used in the slider.</p><p>The timeline and editable fields already existed before evaluation. Video was proposed in the prototype, but a complete recording flow was not delivered.</p></div></div></SupportNotes>
      </section>

      <section id="solution" className="fx-section fx-solution">
        <SectionHeading number="06" label="The implemented experience" title="One case. Two connected perspectives." />
        <article className="fx-story fx-story-guided"><div className="fx-story-lead" data-fx-motion="heading"><div><span className="fx-kicker">Guided reporting</span><h3>Turn descriptions into structured reports.</h3></div><div className="fx-story-body"><p>Describe the problem in your own words, then review the interpreted issue type, location and observed condition. Correct the details before proceeding.</p></div></div><div className="fx-product-scene fx-guided-scene" data-fx-motion="image"><div className="fx-guided-first"><Figure asset={A.FX25} className="fx-art-phone" /></div><div className="fx-guided-second"><Figure asset={A.FX26} className="fx-art-phone" /></div></div></article>
        <article className="fx-story fx-story-recovery"><div className="fx-recovery-copy" data-fx-motion="heading"><span className="fx-kicker">Evidence capture & safety</span><h3>Useful guidance.<br />Room for recovery.</h3><div className="fx-story-body"><p>Overview and close-up photos add context. Previews, retaking and the device picker support recovery when camera access fails.</p><p>If approaching the area may be dangerous, a separate reporting path continues without photographs.</p></div></div><div className="fx-recovery-scene" data-fx-motion="image"><Figure asset={A.FX29} className="fx-art-phone fx-recovery-primary" /><Figure asset={A.FX30} className="fx-art-phone fx-recovery-secondary" /></div></article>
        <article className="fx-story fx-story-followup"><div className="fx-story-lead" data-fx-motion="heading"><div><span className="fx-kicker">Connected follow-up</span><h3>Know what is happening—and when to act.</h3></div><div className="fx-story-body"><p>Action Required on Home links to outstanding requests. Status, responsibility and next steps stay with the case, alongside the renter's response and PM review state.</p></div></div><div className="fx-scroll-scene" data-fx-motion="image"><div className="fx-parallax-layer fx-parallax-slow"><div className="fx-product-scene fx-followup-scene"><Figure asset={A.FX01} className="fx-art-phone fx-followup-home" /><Figure asset={A.FX27} className="fx-interface-detail fx-followup-status" /><Figure asset={A.FX33} className="fx-interface-detail fx-followup-history" sizes="(max-width: 600px) 90vw, 650px" /></div></div></div></article>
        <article className="fx-story fx-story-manager"><div className="fx-story-lead" data-fx-motion="heading"><div><span className="fx-kicker">Property manager workflow</span><h3>Connect evidence to the next decision.</h3></div><div className="fx-story-body"><p>Find and review cases, request specific evidence, inspect responses and record the next workflow action.</p></div></div><div className="fx-manager-scene" data-fx-motion="image"><div className="fx-manager-browser"><BrowserBar /><Figure asset={A.FX02} sizes="(max-width: 767px) 95vw, 1200px" /></div></div><div className="fx-manager-story-detail"><div className="fx-story-body"><span className="fx-detail-rule" aria-hidden="true" /><h4>Specific requests.<br />Explicit actions.</h4><p>Typed requests clarify what is needed. Manual actions and review confirmations connect the response to the management workflow.</p></div><Figure asset={A.FX32} className="fx-manager-request fx-interface-detail" /></div></article>
        <SupportNotes label="About the product captures & delivered scope"><p>These authentic implemented screens use fictional demonstration data in an isolated local client. Independent screen layers are arranged for presentation. They are not production records or a new validation of live AI/backend services.</p><p>Ordinary reports still require two photos; danger reports can continue without them. The captures do not validate physical camera or torch performance, or computer vision. The PM request dialog is shown without sending a new request.</p><p>The exhibition application does not provide a working general PM inbox, real contractor integration or email/SMS delivery. Experimental network vision is disabled; complete video recording and full AR are outside delivered scope.</p></SupportNotes>
      </section>

      <section id="evaluation" className="fx-section">
        <SectionHeading number="07" label="Hi-fi prototype evaluation" title={<>Strong scores.<br />Specific interaction problems.</>}><p>A moderated formative evaluation combined five tasks, think-aloud feedback, adapted task-ease ratings and SUS.</p></SectionHeading>
        <EvaluationResults><div className="fx-evaluation-findings"><h3>What the scores didn't resolve</h3><ul><li>Follow-up requests were not always noticeable.</li><li>Status could leave responsibility unclear.</li><li>Emphasized PM recommendations could influence decisions.</li><li>Contact details were difficult to find; some participants wanted more capture flexibility.</li></ul><p>PM review and contact discovery were the lowest-rated tasks.</p></div></EvaluationResults>
        <SupportNotes label="Study scope & interpretation"><p>Six participants completed five tasks with the Hi-fi prototype. PM tasks were role-played rather than completed by professional property managers. These metrics belong to that formative prototype study, not the implemented application. There was no formal usability retest of the deployed product.</p></SupportNotes>
      </section>

      <section id="iteration" className="fx-section">
        <SectionHeading number="08" label="Iteration & development" title="Make the intended interactions work." />
        <article className="fx-comparison"><div className="fx-comparison-copy"><span className="fx-kicker">Follow-up visibility</span><h3>Surface the next action on Home.</h3><p>The prototype shows a recent case. The implementation brings eligible outstanding requests onto Home with a direct response action.</p></div><div className="fx-comparison-images fx-compare-phones" data-fx-motion="comparison"><Stage label="Hi-fi prototype" id="FX16" /><Stage label="Implemented product" id="FX01" /></div></article>
        <article className="fx-comparison fx-comparison-review" data-fx-motion="comparison"><div className="fx-review-reason" data-fx-motion-item><div className="fx-comparison-copy"><span className="fx-kicker">Report review & editing</span><h3>Make the designed controls functional.</h3><p>Editable fields were already designed. Implementation adds report edits, photo replacement and safe retries.</p></div><Stage label="Hi-fi prototype · field detail" id="FX18" /></div><div className="fx-review-implemented" data-fx-motion-item><Stage label="Implemented product · review" id="FX26" /></div></article>
        <article className="fx-comparison"><div className="fx-comparison-copy"><span className="fx-kicker">PM decision controls</span><h3>Make management actions explicit.</h3><p>Controlled manual actions and confirmations replace recommendation-style prompts. AI does not make PM decisions.</p></div><div className="fx-comparison-images" data-fx-motion="comparison"><Stage label="Hi-fi prototype" id="FX22" /><Stage label="Implemented product" id="FX31" /></div></article>
        <SupportNotes label="Reading these comparisons"><p>The Home comparison uses different case data and states; discoverability was not retested. The report review comparison places a prototype field detail beside a product viewport, rather than matching whole screens. Editing and the timeline predate evaluation, and the planned video step was not delivered.</p><p>Approval remains visually primary in the implemented PM controls. Decision bias was not shown to be eliminated, and contact functionality remains limited. No post-implementation usability improvement is claimed.</p></SupportNotes>
        <SupportNotes label="Implementation notes"><p>Implementation brought feedback, recovery and state consistency into focus. These are delivered refinements, not measured usability improvements.</p><p>I developed FixLens with AI assistance. React and TypeScript support the frontend; Supabase provides database services, private evidence storage and server-side functions. The frontend is hosted on Vercel.</p><p>Bounded AI-assisted interpretation returns structured information for renter confirmation rather than automatic diagnosis. Persisted cases, evidence, requests and review states connect the workflow. Permissions, error recovery, data handling and state consistency required decisions beyond the Figma prototype.</p><p>The result is a functional exhibition experience, not a fully validated commercial platform.</p></SupportNotes>
      </section>

      <section id="reflection" className="fx-section fx-reflection">
        <SectionHeading number="09" label="Reflection" title="Good evidence is not always more evidence."><p>Research shifted my focus from photographs and AI toward relevant information, clear responsibility and continuity across the reporting journey.</p><p>Designing for both sides taught me to connect decisions across a service. Building the application revealed what a working system must reliably support beyond what a prototype communicates.</p></SectionHeading>
        <div className="fx-next-steps"><p className="fx-kicker">If I continued</p><p>Evaluate with professional property managers. Adapt evidence requirements. Improve contact pathways. Test the deployed experience with real users.</p></div>
        <div className="fx-end-nav"><Link href="/projects">← Back to selected work</Link><Link href="/">Return to the workspace ↗</Link></div>
      </section>
    </div>
  </main></CaseStudyExperience>;
}
