import { collectMovingWindows, glide, unit } from "../phase5f/rhythm";
import { pacingChapters } from "../phase5g/pacing";

export const mediaRoot = "/images/phase5h";
export const fps = 24;

type Cue = [start: number, end: number, clip: number, from: number, to: number];
export const cues: Cue[] = [
  [.26, 1.14, 1, 0, 2.75], [1.14, 1.94, 1, 2.75, 5],
  [1.94, 2.99, 2, 0, 4.58], [2.99, 3.58, 2, 4.58, 4.58], [3.58, 3.70, 2, 4.58, 5],
  [3.70, 4.25, 3, 0, 2], [4.25, 4.80, 3, 2, 2],
  [4.80, 5.35, 3, 2, 4.33], [5.35, 5.94, 3, 4.33, 4.33], [5.94, 6.06, 3, 4.33, 5],
  [6.06, 6.50, 4, 0, 1.75], [6.50, 6.94, 4, 1.75, 1.75],
  [6.94, 7.39, 4, 1.75, 3.75], [7.39, 7.83, 4, 3.75, 3.75],
  [7.83, 8.28, 4, 3.75, 6.10], [8.28, 8.72, 4, 6.10, 6.10],
  [8.72, 9.25, 4, 6.10, 8.55], [9.25, 9.84, 4, 8.55, 8.55], [9.84, 9.97, 4, 8.55, 9],
  [9.97, 10.98, 5, 0, 4.80], [10.98, 11.57, 5, 4.80, 4.80],
  [11.57, 12.38, 5, 4.80, 7.42], [12.38, 12.90, 5, 7.42, 9],
];

const about = { id: "about", label: "About", start: cues[0][0], enter: 1.58, leave: 12.03, end: 13.24 } as const;
const shift = about.end - pacingChapters[0].end;
export const animationChapters = [
  about,
  ...pacingChapters.slice(1).map(chapter => ({
    ...chapter,
    start: chapter.start + shift, enter: chapter.enter + shift, leave: chapter.leave + shift, end: chapter.end + shift,
  })),
];
export const animationHeight = (animationChapters[2].enter + 1) * 100;
export const aboutLanding = 2.99;
export const animationWindows = [
  [about.start, about.enter], [about.leave, about.end],
  ...collectMovingWindows(pacingChapters).filter(([start]) => start >= pacingChapters[1].start).map(([start,end]) => [start + shift, end + shift]),
];

export function aboutSample(progress: number) {
  const cue = cues.find(([,end]) => progress < end) ?? cues[cues.length - 1];
  const [start,end,clip,from,to] = cue;
  const time = from + (to - from) * unit((progress - start) / (end - start));
  return {
    clip, time,
    approaching: Math.min(glide((progress - about.start) / (1.51 - about.start)), glide((about.end-progress) / (about.end-12.39))),
    reveal: Math.min(glide((progress - 1.09) / (about.enter - 1.09)), glide((12.46-progress) / (12.46-about.leave))),
  };
}

export function visibleCopy(clip: number, time: number) {
  if (clip === 2 && time >= 4.18) return { chapter: "intro", step: 0 };
  if (clip === 3 && time >= 1.48) return { chapter: "education", step: Number(time >= 3.88) };
  if (clip === 4 && time >= .83) return { chapter: "capabilities", step: time >= 7.82 ? 3 : time >= 5.54 ? 2 : time >= 3.13 ? 1 : 0 };
  if (clip === 5 && time >= 1.80 && time < 6.32) return { chapter: "interests", step: 0 };
  return { chapter: "", step: 0 };
}
