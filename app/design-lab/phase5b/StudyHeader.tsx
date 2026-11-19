import Link from "next/link";

const base = "/design-lab/phase5b";
const pages = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export default function StudyHeader({ current }: { current: "home" | typeof pages[number]["id"] }) {
  return (
    <header className="pb-header">
      <Link className="pb-wordmark" href={base} aria-current={current === "home" ? "page" : undefined}>Ruizhe Lai<span>.</span></Link>
      <nav aria-label="Phase 5B navigation">
        {pages.map(({ id, label }) => <Link key={id} href={`${base}/${id}`} aria-current={current === id ? "page" : undefined}>{label}</Link>)}
      </nav>
    </header>
  );
}
