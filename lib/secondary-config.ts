export const SECONDARY_OBJECTS = { backpack: "Backpack_Root", mug: "CoffeeMug", bin: "TrashBin" } as const;
export type SecondaryId = keyof typeof SECONDARY_OBJECTS;
export const BAG_CONTENT = [
  { label: "Football", icon: "football", group: "Interests" },
  { label: "Running", icon: "running", group: "Interests" },
  { label: "Coffee", icon: "coffee", group: "Interests" },
  { label: "3D Printing", icon: "printer", group: "Interests" },
  { label: "UI/UX Design", icon: "layout", group: "Skills" },
  { label: "Product Design", icon: "product", group: "Skills" },
  { label: "AI", icon: "spark", group: "Skills" },
  { label: "Frontend Development", icon: "code", group: "Skills" },
] as const;
export const SECONDARY_CONFIG = { exitDelay: 240, steamFps: 24, mobileSteamFps: 16, pocketAngle: -0.14 } as const;
