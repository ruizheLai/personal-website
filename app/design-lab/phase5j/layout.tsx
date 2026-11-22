import type { Metadata } from "next";
import "../phase5c/phase5c.css";
import "../phase5d/phase5d.css";
import "../phase5e/phase5e.css";
import "../phase5g/phase5g.css";
import "../phase5h/phase5h.css";
import "./phase5j.css";

export const metadata: Metadata = {
  title: "Workspace Journey",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="pc-study pd-study pe-study pg-study ph-study pj-study">{children}</div>;
}
