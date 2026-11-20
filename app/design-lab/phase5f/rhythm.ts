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

const movingWindows = [
  ...rhythmChapters.flatMap(chapter => [[chapter.start, chapter.enter], [chapter.leave, chapter.end]]),
  ...projectCurves.map(([start, end]) => [rhythmChapters[1].enter + start, rhythmChapters[1].enter + end]),
  ...[1, 2, 3, 4].map(index => {
    const boundary = rhythmChapters[0].enter + index * readingBeat;
    return [boundary - readingCrossfadeHalf, boundary + readingCrossfadeHalf];
  }),
];

export function presentScroll(target: number, previous: number, elapsed: number, snap: boolean) {
  const delta = target - previous;
  if (snap || Math.abs(delta) < .0008 || Math.abs(delta) > .45) return target;
  const start = Math.min(target, previous);
  const end = Math.max(target, previous);
  if (!movingWindows.some(([a, b]) => start < b && end > a)) return target;
  const blend = 1 - Math.exp(-Math.min(34, Math.max(8, elapsed)) / 36);
  const remaining = Math.min(.052, Math.abs(delta) * (1 - blend));
  return target - Math.sign(delta) * remaining;
}
