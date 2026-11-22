import { glide, unit } from "../phase5f/rhythm";
import { refinedPlan } from "../phase5m/timeline";

// Source frames where each action is recognisable and the accompanying copy is settled.
const copyCues = [
  [35, 48], [107, 115], [26, 42], [81, 98], [137, 155], [191, 205], [59, 86],
];

export const phase5oPlan: typeof refinedPlan = {
  ...refinedPlan,
  copy(index, fraction) {
    const cue = copyCues[index - 1];
    if (!cue) return refinedPlan.copy(index, fraction);
    const [first, last] = refinedPlan.beats[index].frames;
    const frame = first + fraction * (last - first);
    const [start, end] = cue;
    const previous = refinedPlan.copy(index - 1, 1);
    const next = refinedPlan.copy(index, 1);
    const alpha = glide((frame - start) / (end - start));
    if (next.chapter === previous.chapter) {
      return frame <= start ? previous : { ...next, line: alpha };
    }
    if (frame <= start) {
      return { ...previous, alpha: unit((start - frame) / 7) };
    }
    return { ...next, alpha };
  },
};
