import { collectMovingWindows } from "../phase5f/rhythm";

export const pacingChapters = [
  { id: "about", label: "About", start: .26, enter: 1.08, leave: 4.93, end: 5.68 },
  { id: "projects", label: "Projects", start: 6.36, enter: 7.18, leave: 9.04, end: 9.80 },
  { id: "contact", label: "Contact", start: 10.48, enter: 11.28, leave: 11.72, end: 12.28 },
] as const;

export const pacingWindows = collectMovingWindows(pacingChapters);
