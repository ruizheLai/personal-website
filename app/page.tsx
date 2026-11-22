import type { Metadata } from "next";
import PortfolioJourney from "@/components/portfolio/PortfolioJourney";

const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const title = "Ruizhe Lai — Product Designer & Builder";
const description = "Explore Ruizhe Lai's interactive 3D workspace, design process and selected projects.";

export const metadata: Metadata = {
  metadataBase: new URL(host ? `https://${host}` : "http://localhost:3000"),
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    images: [{ url: "/images/workspace_v3_preview.png", width: 1600, height: 1067, alt: "Ruizhe Lai's interactive 3D workspace" }],
  },
};

export default function HomePage() {
  return <PortfolioJourney />;
}
