import type { InteractionId, SurfaceRect } from "@/lib/workspace-config";

export type JourneyDriver = {
  pose: { id: InteractionId; approach: number } | null;
  invalidate?: () => void;
  project: (id: InteractionId, rect: SurfaceRect) => void;
};

export const journeyTextures = [
  "/images/phase5c/frame.webp",
  "/images/phase5c/monitor.webp",
  "/images/phase5c/phone.webp",
];
