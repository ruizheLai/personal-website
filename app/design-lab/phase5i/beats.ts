import { glide } from "../phase5f/rhythm";
import definitions from "./beats.json";

const root = "/images/phase5i";
const chapters = ["intro", "education", "capabilities", "interests"];
export const poster = (clip: number, frame: number) => `${root}/${clip}-${frame}.webp`;
export const animationBeats = definitions.map(beat => ({
  ...beat,
  copy: chapters[beat.chapter] ?? "",
  startPoster: poster(beat.clip, beat.frames[0]),
  endPoster: poster(beat.clip, beat.frames[1]),
  forward: `${root}/${beat.id}-forward.mp4`,
  reverse: `${root}/${beat.id}-reverse.mp4`,
}));

export const initialPoster = animationBeats[0].startPoster;
export const finalPoster = animationBeats.at(-1)!.endPoster;
export const exitStart = animationBeats.at(-1)!.actionEnd;
export const exitEnd = animationBeats.at(-1)!.holdEnd;
export const landing = animationBeats[2].actionEnd + .14;
export const entry = animationBeats[0].trigger;

export function frameCamera(index: number, fraction: number, progress: number) {
  const beat = animationBeats[index];
  const approachEnd = animationBeats[0].holdEnd;
  const tucked = .001;
  const approach = .84 * glide((progress - entry) / (approachEnd - entry));
  const retreat = glide((progress - exitStart) / (exitEnd - exitStart));
  switch (beat?.camera) {
    case "approach":
      return {
        approach,
        reveal: tucked,
      };
    case "pull":
      // The first unframed source frame follows the grab at roughly one tenth of the cut.
      return { approach: approach + .16 * glide(fraction), reveal: tucked + (1 - tucked) * glide((fraction - .06) / .42) };
    case "return": {
      // Let the border re-form in the footage before closing the workspace portal.
      const closing = glide((fraction - .34) / .58);
      const withdraw = glide((fraction - .72) / .28) * retreat;
      return { approach: (1 - .23 * closing) * (1 - withdraw), reveal: 1 - (1 - tucked) * closing };
    }
    case "stage":
      return { approach: 1, reveal: 1 };
    default:
      return { approach: 0, reveal: 0 };
  }
}
