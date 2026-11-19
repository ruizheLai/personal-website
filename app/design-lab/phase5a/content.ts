export const lab = "/design-lab/phase5a";
export const workspaceStill = "/design-lab/phase5a/workspace-live-still.webp";

export const concepts = {
  "concept-a": {
    letter: "A", name: "Quiet Future Gallery", method: "An editorial gallery",
    intro: "A live workspace opens onto large, staggered features. Colour stays inside the work.",
    headline: ["Ideas made", "tangible."], type: "Bricolage Grotesque / Manrope / IBM Plex Mono",
  },
  "concept-b": {
    letter: "B", name: "Kinetic Index", method: "A responsive project index",
    intro: "An always-visible index controls a single stage. Compare work with a pointer, keyboard or tap.",
    headline: ["Design in", "motion."], type: "Space Grotesk / Instrument Sans / DM Mono",
  },
  "concept-c": {
    letter: "C", name: "Digital Atelier", method: "A studio exhibition",
    intro: "An oversized signature frames a digital studio. The projects take on different forms as exhibits.",
    headline: ["Ruizhe", "Lai"], type: "Geist / Instrument Serif",
  },
} as const;

export type ConceptId = keyof typeof concepts;
export const conceptIds = Object.keys(concepts) as ConceptId[];

export const projects = {
  fixlens: { name: "FixLens", href: "/projects/fixlens", category: "Digital product", description: "A clearer path from rental maintenance report to follow-up." },
  sippy: { name: "Sippy", href: "/projects/sippy", category: "Physical computing", description: "A soft desktop companion that turns reminders into physical movement." },
} as const;
export type Project = keyof typeof projects;
