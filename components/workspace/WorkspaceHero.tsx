"use client";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type Scene from "./WorkspaceScene";
import HeroFallback from "./HeroFallback";
const WorkspaceScene = dynamic(() => import("./WorkspaceScene"), {
  ssr: false,
  loading: () => <div className="workspace-stage"><HeroFallback status="loading" /></div>,
});
export default function WorkspaceHero(props: ComponentProps<typeof Scene>) {
  return <WorkspaceScene {...props} />;
}
