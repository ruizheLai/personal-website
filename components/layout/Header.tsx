"use client";
import { usePageTransition } from "@/components/workspace/PageTransitionProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [{ href: "/about", label: "About" }, { href: "/projects", label: "Projects" }, { href: "/contact", label: "Contact" }];
export default function Header() {
  const pathname = usePathname();
  const { cancel } = usePageTransition();
  return (
    <header className="site-header">
      <Link onClick={cancel} href="/" className="wordmark" aria-label="Ruizhe Lai — Home" aria-current={pathname === "/" ? "page" : undefined}>Ruizhe Lai</Link>
      <nav aria-label="Main navigation">
        {links.map(({ href, label }) => <Link onClick={cancel} key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
      </nav>
    </header>
  );
}
