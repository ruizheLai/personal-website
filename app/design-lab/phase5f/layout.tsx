import type { Metadata } from "next";
import "../phase5c/phase5c.css";
import "../phase5d/phase5d.css";
import "../phase5e/phase5e.css";
import "./phase5f.css";

export const metadata: Metadata = {
  title: "Workspace Journey",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="pc-study pd-study pe-study pf-study">{children}</div>;
}
