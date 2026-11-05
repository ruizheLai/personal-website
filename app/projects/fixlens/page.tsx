import type { Metadata } from "next";
import Link from "next/link";
import { AssetFigure as Figure, CaseStudyExperience, HorizontalGallery } from "@/components/fixlens/CaseStudyExperience";
import { fixlensAssets as A } from "@/lib/fixlens-assets";
import "./fixlens.css";
import EvolutionStudio from "@/components/fixlens/EvolutionStudio";
import "./fixlens-art-direction.css";
import "./evolution-studio.css";

export const metadata: Metadata = {
  title: "FixLens — From report to follow-up",
  description: "An end-to-end UX case study: eight interviews, a six-person prototype evaluation, and a deployed rental-maintenance exhibition application.",
};

const nav = [
  ["challenge", "Challenge"], ["research", "Research"], ["exploration", "Sketches"],
  ["evolution", "Design"], ["solution", "Solution"], ["evaluation", "Evaluation"], ["iteration", "Iteration"],
];
function SectionHeading({ number, label, title, children }: { number: string; label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return <div className="fx-section-heading"><p className="fx-kicker"><span>{number}</span> {label}</p><h2>{title}</h2>{children && <div className="fx-prose">{children}</div>}</div>;
}
function Stage({ label, id, caption }: { label: string; id: keyof typeof A; caption?: string }) {
  return <div className="fx-stage"><p className="fx-stage-label">{label}</p><Figure asset={A[id]} caption={caption} /></div>;
}
const tasks = [
  { label: "Start a maintenance report", score: 5.00 },
  { label: "Capture and submit evidence", score: 4.67 },
  { label: "Review a report and request evidence as PM", score: 3.67 },
  { label: "Respond to a follow-up request", score: 4.33 },
  { label: "Locate property-manager contact details", score: 3.83 },
];

export default function FixLensPage() {
  return <CaseStudyExperience><main id="main-content" className="fx-case" tabIndex={-1}>
    <div className="fx-container">
      <div className="fx-breadcrumb"><Link href="/projects"><span aria-hidden="true">←</span> All projects</Link><span>Product design · 2026</span></div>
      <section className="fx-hero" aria-labelledby="fixlens-title">
        <div className="fx-hero-heading"><div><p className="fx-kicker">A connected maintenance workflow</p><h1 id="fixlens-title">Fix<span>Lens</span><span className="fx-title-dot" aria-hidden="true">.</span></h1></div><p className="fx-hero-subtitle">Making rental maintenance clearer,<br className="fx-desktop-break" /> from first report to follow-up.</p></div>
        <div className="fx-hero-stage fx-art-hero" data-fx-reveal>
          <div className="fx-art-orbit" aria-hidden="true" />
          <div className="fx-art-hero-browser">
            <div className="fx-browser-bar"><span className="fx-browser-dots" aria-hidden="true"><i /><i /><i /></span><span>Property manager portal</span><span aria-hidden="true">↗</span></div>
            <Figure asset={A.FX02} className="fx-art-dashboard" priority sizes="(max-width: 600px) 90vw, 80vw" />
          </div>
          <div className="fx-art-hero-phone">
            <span className="fx-art-device-label">Renter experience</span>
            <Figure asset={A.FX03} className="fx-art-phone" priority sizes="(max-width: 600px) 65vw, 330px" />
          </div>
          <span className="fx-art-scene-index" aria-hidden="true">01 / Two sides. One connected workflow.</span>
        </div>
        <p className="fx-caption fx-hero-caption">Final Product — authentic client screenshots with fictional demonstration data. Independent screen layers arranged for presentation.</p>
        <div className="fx-overview"><p className="fx-lead">FixLens helps renters communicate problems more clearly and enables property managers to review evidence, request additional information, and coordinate next steps.</p><p>From August to October 2026, I independently researched, designed, evaluated and developed FixLens, using AI-assisted development to bring the concept from early exploration to a deployed exhibition application.</p></div>
        <dl className="fx-facts"><div><dt>Role</dt><dd>UX research<br />Product design · Development</dd></div><div><dt>Timeline</dt><dd>August–October 2026<br />Individual project</dd></div><div><dt>Platform</dt><dd>Mobile web app<br />Property manager portal</dd></div><div><dt>Outcome</dt><dd>Deployed functional<br />exhibition application</dd></div></dl>
      </section>
      <nav className="fx-contents" aria-label="Case study sections">{nav.map(([id, label]) => <a key={id} href={"#" + id}>{label}<span aria-hidden="true">↗</span></a>)}</nav>

      <section id="challenge" className="fx-section">
        <SectionHeading number="02" label="The challenge" title="Reporting a problem is only the beginning."><p>Renters may struggle to explain where a problem occurs, how it affects daily life, or which details help someone understand it remotely. As a case moves between messages, photographs, requests and people, important context can become fragmented.</p></SectionHeading>
        <div className="fx-diagram" data-fx-reveal><Figure asset={A.FX06} caption="The existing project's reporting-flow diagram frames the handoffs. Better evidence alone cannot remove approval, cost or contractor delays." sizes="(max-width: 767px) 100vw, 1100px" /></div>
        <div className="fx-hmw"><span className="fx-kicker">The design opportunity</span><p>How might we help renters communicate maintenance issues clearly while maintaining continuity between reporting, reviewing, and follow-up?</p></div>
      </section>

      <section id="research" className="fx-section">
        <SectionHeading number="03" label="Research & design direction" title="Understanding both sides of reporting."><p>I conducted eight semi-structured interviews with six renters and two landlords. The research explored how issues were reported, what information was needed, and where communication became difficult.</p></SectionHeading>
        <div className="fx-research-intro"><p className="fx-sample"><strong>8</strong><span>exploratory interviews<br /><b>6 renters · 2 landlords</b></span></p><p>Through coding and thematic analysis, I identified recurring patterns that shifted the focus from collecting more photographs to collecting the right information and preserving its context.</p></div>
        <div className="fx-insights">
          <article><span className="fx-insight-number">01</span><div><h3>Evidence depends on the issue.</h3><p>An overview can establish context; a close-up may reveal visible damage. Intermittent faults also need descriptions of timing, triggers and functional impact that a photograph cannot easily communicate.</p></div><div className="fx-principle"><span>Design principle</span><h4>Capture relevant context.</h4><p>Guide people toward useful information rather than assuming more photos are always better.</p></div></article>
          <article><span className="fx-insight-number">02</span><div><h3>Renters need guidance before submitting.</h3><p>Renters do not always know which details will help someone assess an issue. Without useful upfront guidance, important information may be missed and additional questions follow.</p></div><div className="fx-principle"><span>Design principle</span><h4>Guide, don't overwhelm.</h4><p>Use manageable prompts, structured information and explicit confirmation.</p></div></article>
          <article><span className="fx-insight-number">03</span><div><h3>A maintenance case needs continuity.</h3><p>An issue does not end at submission. Follow-up, approvals and handoffs can spread across channels, leaving renters unsure who is responsible or whether they need to act.</p></div><div className="fx-principle"><span>Design principle</span><h4>Keep the conversation connected.</h4><p>Keep requests, responses, status and next steps attached to the same case.</p></div></article>
        </div>
        <p className="fx-editorial-note">A shift in perspective: I initially approached the problem through spatial and visual evidence. Research revealed a broader opportunity—capture the right information for each issue, then keep it understandable as the case progresses.</p>
      </section>

      <section id="exploration" className="fx-section">
        <SectionHeading number="04" label="Low-fi — Hand-drawn sketches" title="Explore alternatives before committing to a flow."><p>I began with hand-drawn sketches to explore conversational reporting, step-by-step capture guidance and different representations of case progress.</p></SectionHeading>
        <div data-fx-reveal><Figure asset={A.FX08} className="fx-sketch-lead" caption="Alternative starting points: conversational entry, a prominent report action, an active-case timeline and issue categories." sizes="(max-width: 767px) 95vw, 1100px" /></div>
        <div className="fx-sketch-support"><Figure asset={A.FX09} caption="Capture approaches and case progress: checklists, contextual prompts and next-step information." /><Figure asset={A.FX10} caption="A connected concept: confirm details, describe the issue, review understanding, capture evidence and review the report." /></div>
        <p className="fx-prose fx-narrow">A key decision was to make reporting conversational without removing user control. Instead of a completely open-ended chatbot, the design combines guided steps with structured information and explicit confirmation.</p>
      </section>

      <section id="evolution" className="fx-section">
        <SectionHeading number="05" label="Mid-fi to Hi-fi" title={<>Structure the journey.<br />Then refine the interaction.</>}><p>I translated the sketches into Mid-fi wireframes, then a Hi-fi interactive prototype to examine how the renter journey and management experience could work together.</p></SectionHeading>
        <EvolutionStudio topics={[
          { id: "home", label: "Home & navigation", description: <p>Three clear entry points, a recent case and persistent navigation.</p>, stages: [
            { label: "Low-fi — Sketch detail", asset: A.homeSketch },
            { label: "Mid-fi — Wireframe", asset: A.FX11 },
            { label: "Hi-fi — Interactive Prototype", asset: A.FX16 },
          ] },
          { id: "capture", label: "Evidence capture", description: <p>From a framing prompt to a dedicated camera workspace. </p>, note: <p>Early exploration established the capture sequence. The final product's camera-recovery and safety paths appear in the solution below.</p>, stages: [
            { label: "Low-fi — Capture detail", asset: A.captureSketch },
            { label: "Mid-fi — Overview wireframe", asset: A.FX12 },
          ] },
          { id: "tracking", label: "Case tracking", description: <p>Progress, responsibility and next steps develop from the original sketches. The timeline already existed before evaluation.</p>, stages: [
            { label: "Low-fi — Progress detail", asset: A.trackingSketch },
            { label: "Mid-fi — Case progress", asset: A.FX13 },
            { label: "Hi-fi — Timeline & activity", asset: A.FX19 },
          ] },
        ]} />
        <div className="fx-evolution-topic"><div className="fx-topic-heading"><h3>Guided reporting</h3><p>One conversation, six states. Confirmation and editing keep the renter in control.</p></div>
          <HorizontalGallery label="Prototype reporting flow">
            <Figure asset={A.FX17} caption="01 / Confirm property details. Personal values redacted." />
            <Figure asset={A.FX37} caption="02 / Describe the issue in your own words." />
            <Figure asset={A.FX38} caption="03 / Check or edit the structured interpretation." />
            <Figure asset={A.FX39} caption="04 / Choose the safety branch." />
          </HorizontalGallery>
          <div className="fx-branch-label"><span>After the safety choice</span><span aria-hidden="true">↙ &nbsp; ↘</span></div>
          <div className="fx-branches"><div><p className="fx-stage-label">Danger reported →</p><Figure asset={A.FX40} caption="05 / Avoid approaching the area; contact the relevant help." /></div><span className="fx-or">or</span><div><p className="fx-stage-label">Safe to continue →</p><Figure asset={A.FX41} caption="06 / Introduce the planned evidence sequence." /></div></div>
          <p className="fx-caption fx-centered">The safety choice leads to one of two paths. Video was proposed in the prototype and is not delivered as a complete recording flow.</p>
        </div>
      </section>

      <section id="solution" className="fx-section fx-solution">
        <SectionHeading number="06" label="Final Product — Deployed Application" title="One connected experience for renters and property managers."><p>FixLens brings together guided reporting, evidence collection, case tracking and follow-up management.</p></SectionHeading>
        <p className="fx-provenance-note">The implemented screens below use fictional demonstration data in an isolated local client. They show the delivered interface, not production records or a new evaluation of live AI/backend services.</p>
        <article className="fx-story fx-story-guided">
          <div className="fx-story-lead"><div><span className="fx-kicker">A / Guided issue reporting</span><h3>Turn descriptions into structured reports.</h3></div><div className="fx-story-body"><p>Renters describe a problem in their own words. The system interprets it into issue type, location and observed condition. Before proceeding, renters can review the summary and correct their description.</p><p>The aim is to reduce the effort of organizing an unfamiliar problem while keeping the renter in control of what is submitted.</p></div></div>
          <div className="fx-product-scene fx-guided-scene" data-fx-reveal>
            <span className="fx-scene-word" aria-hidden="true">Clarity.</span>
            <div className="fx-guided-first"><span className="fx-product-number" aria-hidden="true">01</span><Figure asset={A.FX25} className="fx-art-phone" caption="Review the interpreted description." /></div>
            <div className="fx-guided-second"><span className="fx-product-number" aria-hidden="true">02</span><Figure asset={A.FX26} className="fx-art-phone" caption="Edit details and replace evidence before submission." /></div>
            <span className="fx-scene-connector" aria-hidden="true">↗</span>
          </div>
        </article>
        <article className="fx-story fx-story-recovery">
          <div className="fx-recovery-copy"><span className="fx-kicker">B / Contextual evidence</span><h3>Support useful capture.<br />Make room for recovery.</h3><div className="fx-story-body"><p>Ordinary reports guide renters through overview and close-up photographs, with previews, retaking or selecting images and final review.</p><p>If approaching the area may be dangerous, a separate reporting path continues without photos. Camera-permission recovery offers the device picker or Gallery as alternatives.</p><p className="fx-caption">Normal reports still require two photos. These captures do not validate physical camera/torch performance or computer vision.</p></div></div>
          <div className="fx-recovery-scene" data-fx-reveal>
            <Figure asset={A.FX29} className="fx-art-phone fx-recovery-primary" caption="Recover when camera access is unavailable." />
            <Figure asset={A.FX30} className="fx-art-phone fx-recovery-secondary" caption="Danger reports can continue without photographs; report detail shown." />
          </div>
        </article>
        <article className="fx-story fx-story-followup">
          <div className="fx-story-lead"><div><span className="fx-kicker">C / Connected follow-up</span><h3>Know what is happening—and when to act.</h3></div><div className="fx-story-body"><p>A prominent Action Required section on Home links directly to outstanding requests. Case details show status, the responsible party and next steps.</p><p>Responses stay associated with the original case, so users do not have to reconstruct the problem through a separate conversation.</p></div></div>
          <div className="fx-product-scene fx-followup-scene" data-fx-reveal>
            <div className="fx-followup-orbit" aria-hidden="true" />
            <Figure asset={A.FX01} className="fx-art-phone fx-followup-home" caption="Outstanding requests are visible on Home." />
            <Figure asset={A.FX27} className="fx-interface-detail fx-followup-status" caption="Case status and the renter's action are distinct." />
            <Figure asset={A.FX33} className="fx-interface-detail fx-followup-history" caption="A resolved request retains the renter response and PM review state within the case." sizes="(max-width: 600px) 90vw, 650px" />
          </div>
        </article>
        <article className="fx-story fx-story-manager">
          <div className="fx-story-lead"><div><span className="fx-kicker">D / Property manager workflow</span><h3>Connect evidence to the next decision.</h3></div><div className="fx-story-body"><p>The portal provides a dashboard for finding and reviewing cases. Managers can inspect structured reports, request specific additional evidence, review responses and record workflow actions.</p></div></div>
          <div className="fx-manager-scene" data-fx-reveal>
            <div className="fx-manager-browser"><div className="fx-browser-bar"><span className="fx-browser-dots" aria-hidden="true"><i /><i /><i /></span><span>Property manager portal</span><span aria-hidden="true">↗</span></div><Figure asset={A.FX02} caption="A focused maintenance-case overview, with status filters and attention markers." sizes="(max-width: 767px) 95vw, 1200px" /></div>
          </div>
          <div className="fx-manager-story-detail"><div className="fx-story-body"><span className="fx-detail-rule" aria-hidden="true" /><h4>Specific requests. Explicit actions.</h4><p>Typed requests clarify what is needed next. Controlled manual actions and review confirmations connect that information to the management workflow.</p><p>The exhibition scope is deliberately focused. It does not provide a working general PM inbox, real contractor integration or email/SMS delivery.</p></div><Figure asset={A.FX32} className="fx-manager-request fx-interface-detail" caption="Request an overview, close-up or written details. Dialog shown; a new request was not sent in this capture." /></div>
        </article>
      </section>

      <section id="evaluation" className="fx-section">
        <SectionHeading number="07" label="High-fidelity Prototype Evaluation" title={<>Strong scores.<br />Specific interaction problems.</>}><p>I conducted a moderated formative evaluation with six participants completing five tasks. Think-aloud feedback, task-ease ratings and SUS helped identify where the prototype needed refinement.</p></SectionHeading>
        <div className="fx-metrics"><div><strong>91.7<span>/100</span></strong><p>Mean System Usability Scale</p></div><div><strong>4.30<span>/5</span></strong><p>Mean adapted task ease</p></div><div><strong>6<span> people</span></strong><p>Five tasks · Hi-fi prototype</p></div></div>
        <div className="fx-evaluation-grid"><figure className="fx-task-chart"><figcaption><h3>Where the friction appeared</h3><p>Mean adapted task ease · 1 very difficult → 5 very easy</p></figcaption><ol>{tasks.map((task, i) => <li key={task.label}><div className="fx-task-label"><span><small>T{i + 1}</small>{task.label}</span><strong>{task.score.toFixed(2)}</strong></div><div className="fx-task-track" aria-hidden="true"><span style={{ width: (task.score / 5 * 100) + "%" }} className={i === 2 || i === 4 ? "fx-task-lower" : ""} /></div></li>)}</ol></figure><div className="fx-evaluation-findings"><h3>What the scores didn't resolve</h3><ul><li>Follow-up requests were not always noticeable.</li><li>Status could leave responsibility unclear.</li><li>Emphasized PM recommendations could influence decisions.</li><li>Contact details were difficult to find; some participants wanted more capture flexibility.</li></ul><p>PM review was the lowest-rated task at 3.67/5, followed by contact discovery at 3.83/5.</p></div></div>
        <div className="fx-study-limit"><strong>A formative study, not a final-product validation.</strong><p>PM tasks were role-played rather than completed by professional property managers. These metrics belong to the Hi-fi prototype. There was no formal usability retest of the deployed application.</p></div>
      </section>

      <section id="iteration" className="fx-section">
        <SectionHeading number="08" label="Iteration & AI-assisted development" title="Turn design intentions into working interactions."><p>Moving beyond individual screens meant reconsidering feedback, recovery and state consistency. The following are implemented refinements, not measured usability improvements.</p></SectionHeading>
        <article className="fx-comparison"><div className="fx-comparison-copy"><span className="fx-kicker">01 / Follow-up visibility</span><h3>Surface the next action before opening the case.</h3><p>The prototype Home shows a recent case; outstanding requests were easier to miss. The implementation brings eligible requests onto Home with a direct response action.</p><p className="fx-limitation">Different case data and states are shown. Discoverability was not retested.</p></div><div className="fx-comparison-images fx-compare-phones"><Stage label="Hi-fi prototype" id="FX16" /><Stage label="Implemented product" id="FX01" /></div></article>
        <article className="fx-comparison"><div className="fx-comparison-copy"><span className="fx-kicker">02 / Report review & editing</span><h3>Make the designed controls functional.</h3><p>Editable fields were already present in the prototype. The implemented flow supports report edits, photo replacement and safe retry handling, responding to the need for greater control during reporting.</p><p className="fx-limitation">This is a prototype detail versus a product viewport. The planned video step was not delivered.</p></div><div className="fx-comparison-images"><Stage label="Hi-fi prototype · editable-field detail" id="FX18" /><Stage label="Implemented product · review viewport" id="FX26" /></div></article>
        <article className="fx-comparison"><div className="fx-comparison-copy"><span className="fx-kicker">03 / PM decision controls</span><h3>Make management actions explicit.</h3><p>The evaluation raised concerns about recommendation emphasis. The implemented portal uses controlled manual workflow actions and confirmation steps instead of recommendation-style prompts. AI does not make PM decisions.</p><p className="fx-limitation">Approval remains visually primary. Decision bias was not shown to be eliminated, and contact functionality remains limited.</p></div><div className="fx-comparison-images"><Stage label="Hi-fi prototype · recommendation-style controls" id="FX22" /><Stage label="Implemented product · manual workflow" id="FX31" /></div></article>
        <div className="fx-build"><div><p className="fx-kicker">Building FixLens</p><h3>From Figma to a deployed exhibition application.</h3></div><div className="fx-prose"><p>I developed FixLens with AI assistance. React and TypeScript support the frontend; Supabase provides database services, private evidence storage and server-side functions. The frontend is hosted on Vercel.</p><p>Bounded AI-assisted interpretation returns structured information for renter confirmation, rather than automatic diagnosis. Persisted cases, evidence, requests and review states connect the two sides of the workflow.</p><p>Building the product exposed constraints less visible in Figma: permissions, error recovery, data handling and state consistency. The result is a functional exhibition experience, not a fully validated commercial platform. Experimental network vision is disabled; complete video recording and full AR are outside delivered scope.</p></div></div>
      </section>

      <section id="reflection" className="fx-section fx-reflection">
        <SectionHeading number="09" label="Reflection" title="Good evidence is not always more evidence."><p>Improving maintenance communication requires more than adding photographs or AI. Research shifted my focus toward the relevance of evidence, clarity of responsibility and continuity across the reporting journey.</p><p>Designing for both renters and property managers taught me to connect interaction decisions across a service. Building the application showed me the difference between what a prototype communicates and what a working system must reliably support.</p></SectionHeading>
        <div className="fx-next-steps"><p className="fx-kicker">If I continued</p><p>Evaluate with professional property managers. Make evidence requirements more adaptable. Improve contact pathways. Test the deployed experience with real users.</p></div>
        <div className="fx-end-nav"><Link href="/projects">← Back to selected work</Link><Link href="/">Return to the workspace ↗</Link></div>
      </section>
    </div>
  </main></CaseStudyExperience>;
}
