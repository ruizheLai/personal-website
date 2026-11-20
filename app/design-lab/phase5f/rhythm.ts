export const rhythmChapters = [
  { id: "about", label: "About", start: .26, enter: 1.08, leave: 4.93, end: 5.68 },
  { id: "projects", label: "Projects", start: 5.90, enter: 6.72, leave: 8.58, end: 9.34 },
  { id: "contact", label: "Contact", start: 9.56, enter: 10.36, leave: 10.8, end: 11.36 },
] as const;
export const readingBeat = .77;
export const readingCrossfadeHalf = .08;
export const projectCurves = [[.44, .77], [1.15, 1.48]] as const;
export const projectStops = [.17, .94, 1.64] as const;

export const unit = (x: number) => Math.min(1, Math.max(0, x));
export function glide(x: number) {
  const t = unit(x);
  return t * t * t * (t * (6 * t - 15) + 10);
}

export const collectMovingWindows = (chapters: typeof rhythmChapters | readonly { start: number; enter: number; leave: number; end: number }[]) => [
  ...chapters.flatMap(chapter => [[chapter.start, chapter.enter], [chapter.leave, chapter.end]]),
  ...projectCurves.map(([start, end]) => [chapters[1].enter + start, chapters[1].enter + end]),
  ...[1, 2, 3, 4].map(index => {
    const boundary = chapters[0].enter + index * readingBeat;
    return [boundary - readingCrossfadeHalf, boundary + readingCrossfadeHalf];
  }),
];

const movingWindows = collectMovingWindows(rhythmChapters);

export function presentScroll(target: number, previous: number, elapsed: number, snap: boolean, windows = movingWindows) {
  const delta = target - previous;
  if (snap || Math.abs(delta) < .0008 || Math.abs(delta) > .45) return target;
  const start = Math.min(target, previous);
  const end = Math.max(target, previous);
  if (!windows.some(([a, b]) => start < b && end > a)) return target;
  const blend = 1 - Math.exp(-Math.min(34, Math.max(8, elapsed)) / 36);
  const remaining = Math.min(.052, Math.abs(delta) * (1 - blend));
  return target - Math.sign(delta) * remaining;
}
