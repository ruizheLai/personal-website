export const SECONDARY_OBJECTS = { backpack: "Backpack_Root", mug: "CoffeeMug", bin: "TrashBin" } as const;
export type SecondaryId = keyof typeof SECONDARY_OBJECTS;
export const BAG_CONTENT = [
  { label: "Football", file: "football", group: "Interests" },
  { label: "Basketball", file: "basketball", group: "Interests" },
  { label: "Running", file: "running", group: "Interests" },
  { label: "UI/UX Design", file: "uiux_design", group: "Skills" },
  { label: "Product Design", file: "product_design", group: "Skills" },
  { label: "AI Development", file: "ai_development", group: "Skills" },
] as const;
export const SECONDARY_CONFIG = { exitDelay: 240, steamFps: 24, mobileSteamFps: 16, pocketAngle: -.14 } as const;
export const GRABBABLE_IDS = ["bin", "paper-1", "paper-2", "paper-3", "paper-4"] as const;
export type GrabbableId = typeof GRABBABLE_IDS[number];
