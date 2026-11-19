import type { Metadata } from "next";
import "./phase5c.css";

export const metadata: Metadata = {
  title: "Workspace Journey",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="pc-study">{children}</div>;
}
