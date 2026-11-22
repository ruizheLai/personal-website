import Link from "next/link";
import { concepts, conceptIds, lab } from "./content";

export default function DesignLab() {
  return (
    <main className="dl dl-compare" id="main-content" tabIndex={-1}>
      <header className="dl-nav dl-edge"><span className="dl-wordmark">Ruizhe Lai</span><Link href="/">Live portfolio ↗</Link></header>
      <div className="dl-edge">
        <header className="dl-compare-lead">
          <p className="dl-detail">Phase 5A · Art direction</p>
          <h1>Three ways<br />to show the work.</h1>
          <p>Explore each homepage and project gallery, then compare the type and motion in context.</p>
        </header>
        <div className="dl-compare-grid">
          {conceptIds.map(id => {
            const concept = concepts[id];
            return (
              <Link href={`${lab}/${id}`} key={id} className={`dl-choice dl-${concept.letter.toLowerCase()}`}>
                <div className="dl-choice-art" aria-hidden="true"><span>{concept.letter}</span><i /><img src="/images/sippy/plush.webp" alt="" width="571" height="633" /></div>
                <div className="dl-choice-copy"><p className="dl-detail">{concept.method}</p><h2>{concept.name}</h2><p>{concept.intro}</p><span aria-hidden="true">↗</span></div>
              </Link>
            );
          })}
        </div>
        <section className="dl-specimens" aria-labelledby="dl-type-title">
          <h2 id="dl-type-title">Type in comparison</h2>
          {conceptIds.map(id => {
            const concept = concepts[id];
            return <article key={id} className={`dl-specimen dl-${concept.letter.toLowerCase()}`}><p className="dl-detail">{concept.letter} · {concept.type}</p><p>Ideas made tangible.</p><p>Product design · Interaction · AI</p></article>;
          })}
        </section>
      </div>
    </main>
  );
}
