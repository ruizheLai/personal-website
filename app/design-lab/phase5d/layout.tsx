import type { Metadata } from "next";
import "../phase5c/phase5c.css";
import "./phase5d.css";

export const metadata: Metadata = {
  title: "Welcome to my workplace",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="pc-study pd-study">{children}</div>;
}
