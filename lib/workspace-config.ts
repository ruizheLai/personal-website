export const MODEL_URL = "/models/workspace_v3.glb";
export const ARTWORK = { default: "/images/about-avatar-v3.png" } as const;
export const SCREEN_ASSETS = { projects: "/images/projects-preview.png", contact: "/images/phone-home.svg" } as const;
export const WORKSPACE_CONFIG = {
  zoom: { initial: 1, min: 0.9, max: 1.7, damping: 9, wheelSensitivity: 0.0008 },
  chair: { maxDegrees: 18, damping: 8, direction: -1 },
  framing: { desktopWidth: 7.4, tabletWidth: 6.1, mobileWidth: 4.5 },
  rendering: { maxDpr: 1.5, mobileMaxDpr: 1.25, exposure: 1.25 },
  focus: { duration: 760, returnDuration: 680, widthFraction: 0.66, heightFraction: 0.65 },
} as const;
export const INTERACTIONS = [
  { id: "about", assembly: "WallFrame", surface: "FrameArtwork", href: "/about", label: "About Me", image: ARTWORK.default },
  { id: "projects", assembly: "Monitor", surface: "MonitorScreen", href: "/projects", label: "View Projects", image: SCREEN_ASSETS.projects },
  { id: "contact", assembly: "Smartphone", surface: "PhoneScreen", href: "/contact", label: "Get in Touch", image: SCREEN_ASSETS.contact },
] as const;
export type InteractionId = (typeof INTERACTIONS)[number]["id"];
export type Interaction = (typeof INTERACTIONS)[number];
export type InteractionPhase = "idle" | "hovered" | "focusing" | "focused" | "transitioning";
export type SurfaceRect = { left: number; top: number; width: number; height: number };
