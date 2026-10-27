export const MODEL_URL = "/models/workspace_v2.glb";
export const WORKSPACE_CONFIG = {
  zoom: { initial: 1, min: 0.9, max: 1.7, damping: 9, wheelSensitivity: 0.0008 },
  chair: { maxDegrees: 18, damping: 8 },
  framing: { desktopWidth: 7.4, tabletWidth: 6.1, mobileWidth: 4.5 },
  rendering: { maxDpr: 1.5, mobileMaxDpr: 1.25, exposure: 1.25 },
} as const;
export const INTERACTIONS = [
  { id: "about", assembly: "WallFrame", surface: "FrameArtwork", href: "/about", label: "About Me" },
  { id: "projects", assembly: "Monitor", surface: "MonitorScreen", href: "/projects", label: "View Projects" },
  { id: "contact", assembly: "Smartphone", surface: "PhoneScreen", href: "/contact", label: "Get in Touch" },
] as const;
export type InteractionId = (typeof INTERACTIONS)[number]["id"];
export type Interaction = (typeof INTERACTIONS)[number];
