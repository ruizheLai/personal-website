"use client";
import dynamic from "next/dynamic";
import HeroFallback from "./HeroFallback";
const WorkspaceScene = dynamic(() => import("./WorkspaceScene"), {
  ssr: false,
  loading: () => <div className="workspace-stage"><HeroFallback status="loading" /></div>,
});
export default function WorkspaceHero() {
  return <WorkspaceScene />;
}
