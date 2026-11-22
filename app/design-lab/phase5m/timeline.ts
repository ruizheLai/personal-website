import { glide, unit } from "../phase5f/rhythm";
import { animationChapters } from "../phase5h/timeline";
import { camera, copy, mediaBeats, scene, type Stage } from "../phase5l/timeline";
import type { CinematicPlan } from "../phase5l/controller";

const root = "/images/phase5m";
const gap = .076;
const start = .085;
const precision = (value: number) => Number(value.toFixed(3));

function recut(index: number, first: number, last: number) {
  const beat = mediaBeats[index];
  return {
    ...beat,
    frames: [first, last],
    startPoster: `${root}/${beat.clip}-${first}.webp`,
    endPoster: `${root}/${beat.clip}-${last}.webp`,
    forward: `${root}/${beat.id}-forward.mp4`,
    reverse: `${root}/${beat.id}-reverse.mp4`,
  };
}

export const refinedBeats = [
  {
    ...mediaBeats[0],
    frames: [0, 241],
    endPoster: mediaBeats[1].endPoster,
    copy: "intro",
    pose: mediaBeats[1].pose,
    forward: `${root}/entrance-forward.mp4`,
    reverse: `${root}/entrance-reverse.mp4`,
  },
  recut(2, 0, 73), recut(3, 74, 120),
  recut(4, 0, 60), recut(5, 61, 120), recut(6, 121, 175), recut(7, 176, 216),
  mediaBeats[8], mediaBeats[9],
];

const widths = [.70, .30, .30, .30, .30, .30, .30, .38, .46];
let position = start;
const video: Stage[] = refinedBeats.map((media, index) => {
  const end = precision(position + widths[index]);
  const stage = { id: media.id, start: position, end, duration: (media.frames[1] - media.frames[0] + 1) / 24 * 1000, media };
  position = precision(end + gap);
  return stage;
});
const exit = video.at(-1)!;
const monitor = {
  id: "projects" as const, label: "Projects", start: position,
  enter: precision(position + .82), leave: precision(position + 2.68), end: precision(position + 3.44),
};
const phoneStart = precision(monitor.end + gap);
const phone = {
  id: "contact" as const, label: "Contact", start: phoneStart,
  enter: precision(phoneStart + .80), leave: precision(phoneStart + 1.24), end: precision(phoneStart + 1.80),
};
export const refinedChapters = [
  { ...animationChapters[0], start, enter: video[0].end, leave: exit.start, end: exit.end },
  monitor,
  phone,
];
export const refinedHeight = (phone.enter + 1) * 100;
export const refinedLanding = video[0].end + gap / 2;

export const refinedPlan: CinematicPlan = {
  stages: [
    ...video,
    { id: "monitor-in", start: monitor.start, end: monitor.enter, duration: 1000 },
    { id: "monitor-out", start: monitor.leave, end: monitor.end, duration: 850 },
    { id: "phone-in", start: phone.start, end: phone.enter, duration: 950 },
  ],
  beats: refinedBeats,
  aboutEnd: exit.end,
  clearance: .013,
  hysteresis: .005,
  responsive: true,
  camera(index, fraction) {
    return index === 0 ? camera(0, unit(fraction * 241 / 120)) : camera(index + 1, fraction);
  },
  look(beat, fraction) {
    if (beat.id === "entrance") {
      const frame = fraction * 241;
      return frame >= 121 ? "unframed" : scene(1, frame / 24);
    }
    return scene(beat.clip, (beat.frames[0] + (beat.frames[1] - beat.frames[0]) * fraction) / 24);
  },
  copy(index, fraction) {
    if (index === 0) {
      const alpha = glide((fraction * 241 - 218) / 23);
      return { chapter: alpha > 0 ? "intro" : "", step: 0, alpha, line: 1 };
    }
    return copy(index, fraction, refinedBeats, .86);
  },
};
