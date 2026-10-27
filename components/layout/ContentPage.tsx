import Link from "next/link";
export default function ContentPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main id="main-content" className="content-page" tabIndex={-1}>
      <div className="page-intro"><p className="eyebrow">Ruizhe Lai</p><h1>{title}</h1><p>{intro}</p></div>
      {children}
      <footer className="content-footer"><Link href="/">Back to the workspace <span aria-hidden="true">↗</span></Link><span>Portfolio in progress</span></footer>
    </main>
  );
}
