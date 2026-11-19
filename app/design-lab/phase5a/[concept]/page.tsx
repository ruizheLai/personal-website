import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorkspaceHero from "@/components/workspace/WorkspaceHero";
import ProjectArt, { ProjectIndex } from "../ProjectArt";
import { concepts, conceptIds, lab, projects, workspaceStill, type ConceptId, type Project } from "../content";

export const dynamicParams = false;
export function generateStaticParams() {
  return conceptIds.map(concept => ({ concept }));
}

async function resolve(params: Promise<{ concept: string }>) {
  const { concept } = await params;
  if (!conceptIds.includes(concept as ConceptId)) notFound();
  return concept as ConceptId;
}

export async function generateMetadata({ params }: { params: Promise<{ concept: string }> }) {
  const concept = await resolve(params);
  return { title: concepts[concept].name };
}

function ProjectFeature({ name }: { name: Project }) {
  const project = projects[name];
  return (
    <article className={`dl-feature dl-feature-${name}`}>
      <Link href={project.href} aria-label={`Read the ${project.name} case study`}>
        <div className="dl-feature-copy">
          <p className="dl-detail">{project.category}</p>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <span className="dl-arrow" aria-hidden="true">↗</span>
        </div>
        <ProjectArt project={name} />
      </Link>
    </article>
  );
}

export default async function ConceptPage({ params }: { params: Promise<{ concept: string }> }) {
  const id = await resolve(params);
  const theme = concepts[id];
  const live = id === "concept-a";

  return (
    <main id="main-content" tabIndex={-1} className={`dl dl-${theme.letter.toLowerCase()}`}>
      <header className="dl-nav dl-edge">
        <a className="dl-wordmark" href="#home" aria-label="Ruizhe Lai, concept home">Ruizhe Lai</a>
        <nav aria-label="Concept navigation">
          <a href="#work">Projects</a><a href="#about">About</a><a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="dl-home dl-edge" id="home" aria-labelledby="dl-home-title">
        <div className="dl-identity" data-enter>
          <p className="dl-detail">{live ? "Interactive workspace" : id === "concept-b" ? "Ruizhe Lai / Portfolio" : "Studio portfolio"}</p>
          <h1 id="dl-home-title">{theme.headline[0]}<br /><span>{theme.headline[1]}</span></h1>
          <p>Product design · Interaction · AI</p>
        </div>
        <div className={`dl-workspace ${live ? "dl-live" : "dl-still"}`}>
          <Image className="dl-workspace-image" src={workspaceStill} width={800} height={535} alt={live ? "" : "Ruizhe Lai’s 3D workspace with monitor, chair, wall portrait, mug and backpack"} loading="eager" unoptimized />
          {live && <WorkspaceHero />}
        </div>
        <div className="dl-home-foot">
          <a className="dl-text-link" href="#work">Selected work <span aria-hidden="true">↓</span></a>
          <Link href={live ? lab : "/"}>{live ? "Compare concepts" : "Open live workspace"} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="dl-work dl-edge" id="work" aria-labelledby="dl-work-title">
        <header className="dl-section-head">
          <h2 id="dl-work-title">{id === "concept-b" ? "Project index" : id === "concept-c" ? "The exhibits" : "Selected work"}</h2>
          <p className="dl-detail">Digital products &amp; physical interactions</p>
        </header>
        {id === "concept-b" ? <ProjectIndex /> : (
          <div className="dl-features">
            <ProjectFeature name="fixlens" />
            <ProjectFeature name="sippy" />
            <article className="dl-future"><div><p className="dl-detail">In Development</p><h3>WillDo</h3></div></article>
          </div>
        )}
      </section>

      <section className="dl-about dl-edge" id="about" aria-labelledby="dl-about-title">
        <div>
          <p className="dl-detail">About · Content study</p>
          <h2 id="dl-about-title">The person behind the work.</h2>
          <p>Personal statement to be added.</p>
          <div className="dl-about-details"><p>Background <span>To be added</span></p><p>Interests <span>To be added</span></p></div>
        </div>
        <Image src="/images/about-avatar-v3.png" alt="Ruizhe Lai’s illustrated workspace avatar" width={320} height={400} unoptimized />
      </section>

      <footer className="dl-contact dl-edge" id="contact">
        <p className="dl-detail">Contact</p>
        <h2>Let’s connect.</h2>
        <a className="dl-text-link" href="https://github.com/ruizheLai">GitHub <span aria-hidden="true">↗</span></a>
        <div className="dl-contact-foot"><span>{theme.name}</span><Link href={lab}>Compare concepts <span aria-hidden="true">↗</span></Link></div>
      </footer>
    </main>
  );
}
