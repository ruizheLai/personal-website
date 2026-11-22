import { animationBeats } from "../phase5i/beats";
import { animationChapters } from "../phase5h/timeline";
import { glide, unit } from "../phase5f/rhythm";

export const aboutEnd = animationChapters[0].end;
export const aboutLanding = 3.10;
export const tucked = .001;
export const initialPose = animationBeats[0].startPoster;

function join(id: string, first: number, last: number) {
  const start = animationBeats[first];
  const finish = animationBeats[last];
  return {
    ...start, id, frames: [start.frames[0], finish.frames[1]],
    actionEnd: finish.actionEnd, endPoster: finish.endPoster, pose: finish.pose,
    copy: finish.copy, step: finish.step,
    forward: `/images/phase5l/${id}-forward.mp4`,
    reverse: `/images/phase5l/${id}-reverse.mp4`,
  };
}

export const mediaBeats = [
  join("entrance", 0, 1),
  ...animationBeats.slice(2, 9),
  join("sports", 9, 10),
  animationBeats[11],
];
const mediaStages = mediaBeats.map(media => ({
  id: media.id,
  start: media.trigger,
  end: media.id === "return" ? aboutEnd : media.actionEnd,
  duration: (media.frames[1] - media.frames[0] + 1) / 24 * 1000,
  media,
}));

export type Stage = {
  id: string;
  start: number;
  end: number;
  duration: number;
  media?: typeof mediaBeats[number];
};

const projects = animationChapters[1];
const contact = animationChapters[2];
export const stages: Stage[] = [
  ...mediaStages,
  { id: "monitor-in", start: projects.start, end: projects.enter, duration: 1000 },
  { id: "monitor-out", start: projects.leave, end: projects.end, duration: 850 },
  { id: "phone-in", start: contact.start, end: contact.enter, duration: 950 },
];

export function settledIndex(progress: number) {
  return mediaStages.findLastIndex(stage => progress >= stage.end - .001);
}

export function scene(clip: number, time: number) {
  return clip === 1 && time < 3 || clip === 5 && time >= 6.25 ? "framed" : "unframed";
}

export function camera(index: number, fraction: number) {
  switch (mediaBeats[index]?.camera) {
    case "approach": {
      // Source frame 66 separates the reach from the continuous pull.
      const pull = (fraction - .55) / .45;
      return fraction <= .55
        ? { approach: .84 * glide(fraction / .55), reveal: tucked }
        : { approach: .84 + .16 * glide(pull), reveal: tucked + (1 - tucked) * glide((pull - .08) / .47) };
    }
    case "return":
      return {
        approach: 1 - glide((fraction - .42) / .58),
        reveal: 1 - (1 - tucked) * glide((fraction - .36) / .58),
      };
    case "stage":
      return { approach: 1, reveal: 1 };
    default:
      return { approach: 0, reveal: 0 };
  }
}

export function copy(index: number, fraction: number) {
  const previous = mediaBeats[index - 1];
  const next = mediaBeats[index];
  if (!next || fraction === 1) return { chapter: next?.copy ?? "", step: next?.step ?? 0, alpha: 1, line: 1 };
  if (previous?.copy && previous.copy === next.copy) {
    const line = unit((fraction - .79) / .18);
    return { chapter: next.copy, step: line > 0 ? next.step : previous.step, alpha: 1, line: line || 1 };
  }
  if (fraction < .24) return { chapter: previous?.copy ?? "", step: previous?.step ?? 0, alpha: 1 - glide(fraction / .24), line: 1 };
  return { chapter: fraction > .76 ? next.copy : "", step: next.step, alpha: glide((fraction - .76) / .24), line: 1 };
}
