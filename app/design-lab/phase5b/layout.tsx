import type { Metadata } from "next";
import "./phase5b.css";

export const metadata: Metadata = {
  title: "Phase 5B Design Lab",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="pb-study">{children}</div>;
}
