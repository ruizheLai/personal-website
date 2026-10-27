import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Ruizhe Lai", template: "%s — Ruizhe Lai" },
  description: "Ruizhe Lai's personal portfolio. Explore an interactive 3D workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        {children}
      </body>
    </html>
  );
}
