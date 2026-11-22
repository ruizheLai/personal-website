import { unit } from "@/app/design-lab/phase5f/rhythm";
import { fps } from "@/app/design-lab/phase5h/timeline";
import type { CinematicNavigation } from "@/app/design-lab/phase5l/controller";
import { refinedLanding, refinedPlan } from "@/app/design-lab/phase5m/timeline";
import type { InteractionId } from "@/lib/workspace-config";

const [entrance] = refinedPlan.stages;
const entranceMedia = refinedPlan.beats[0];
const roomStages = {
  projects: refinedPlan.stages.find(stage => stage.id === "monitor-in")!,
  contact: refinedPlan.stages.find(stage => stage.id === "phone-in")!,
};

export function workspaceNavigation(anchor: number, destination: InteractionId): CinematicNavigation {
  if (destination === "about") {
    const seconds = (entranceMedia.frames[1] - entranceMedia.frames[0]) / fps;
    return {
      anchor, target: refinedLanding, duration: entrance.duration, source: entranceMedia.forward,
      view(_, presentedTime) {
        const fraction = unit((presentedTime ?? 0) / seconds);
        return {
          progress: entrance.start + (entrance.end - entrance.start) * fraction,
          about: refinedPlan.camera(0, fraction),
          scene: refinedPlan.look(entranceMedia, fraction),
          text: refinedPlan.copy(0, fraction),
        };
      },
    };
  }
  const { start, end, duration } = roomStages[destination];
  return {
    anchor, target: end, duration,
    view(elapsed) {
      return { progress: start + (end - start) * unit(elapsed / duration), about: null, text: refinedPlan.copy(-1, 1) };
    },
  };
}
