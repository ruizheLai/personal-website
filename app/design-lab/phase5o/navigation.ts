import { glide, unit } from "../phase5f/rhythm";
import type { CinematicNavigation } from "../phase5l/controller";
import { scene } from "../phase5l/timeline";
import { refinedChapters, refinedLanding, refinedPlan } from "../phase5m/timeline";
import { navigationRewind, rewindAbout } from "../phase5n/rewind";
import { phase5oPlan } from "./timeline";

const [about, projects, contact] = refinedChapters;
const desk = about.end + .035;
const noCopy = refinedPlan.copy(-1, 1);
const fps = 30;
const frameEntryLength = 65;
const returnStart = 35;
const exitLength = 57;
const holds = [0, 6, 10, 15, 19, 23, 27, 34];
const mix = (from: number, to: number, fraction: number) => from + (to - from) * glide(fraction);

function enterAbout(anchor: number): CinematicNavigation {
  return {
    anchor, target: refinedLanding, duration: frameEntryLength / fps * 1000,
    source: "/images/phase5o/frame-entry.mp4",
    view(_, presentedTime) {
      const frame = Math.round((presentedTime ?? 0) * fps);
      const sourceFrame = frame < 42 ? 120 * unit(frame / 41) : 121 + 120 * unit((frame - 42) / 22);
      const fraction = sourceFrame / 241;
      const landing = refinedPlan.stages[0];
      return {
        progress: landing.start + (refinedLanding - landing.start) * fraction,
        about: refinedPlan.camera(0, fraction),
        scene: refinedPlan.look(refinedPlan.beats[0], fraction),
        text: refinedPlan.copy(0, fraction),
      };
    },
  };
}

function leaveAbout(anchor: number, room: typeof projects | typeof contact): CinematicNavigation {
  const index = refinedPlan.stages.findLastIndex(stage => stage.media && stage.end <= anchor + .001);
  const firstFrame = holds[Math.max(0, index)] ?? holds.at(-1)!;
  const postlude = 990;
  return {
    anchor, target: room.enter, postlude, duration: (exitLength - firstFrame) / fps * 1000 + postlude,
    source: "/images/phase5o/about-forward.mp4",
    mediaStart: firstFrame / fps,
    view(_, presentedTime, after) {
      if (after !== undefined) {
        const progress = after < 130 ? desk : mix(room.start, room.enter, (after - 130) / (postlude - 130));
        return { progress, about: null, text: noCopy };
      }
      const frame = Math.round((presentedTime ?? firstFrame / fps) * fps);
      const returnFraction = unit((frame - returnStart) / (exitLength - returnStart - 1));
      const textIndex = holds.findIndex(hold => hold >= frame);
      const text = presentedTime === undefined ? phase5oPlan.copy(index, 1)
        : phase5oPlan.copy(textIndex < 0 ? 7 : textIndex, 1);
      return {
        progress: mix(Math.max(about.enter, anchor), about.end - .001, frame < returnStart ? 0 : returnFraction),
        about: frame < returnStart ? refinedPlan.camera(0, 1) : refinedPlan.camera(8, returnFraction),
        scene: frame < returnStart ? "unframed" : scene(5, (116 + 100 * returnFraction) / 24),
        text: { ...text, alpha: 1 - glide(returnFraction / .4) },
      };
    },
  };
}

function enterRoom(anchor: number, room: typeof projects | typeof contact, fromMonitor: boolean): CinematicNavigation {
  const retreat = fromMonitor ? 570 : 0;
  const approach = fromMonitor ? 850 : 1120;
  const prelude = fromMonitor ? retreat + 130 : 0;
  const monitorExit = anchor > projects.leave ? projects.end + .001 : projects.start - .001;
  return {
    anchor, target: room.enter, duration: prelude + approach,
    view(elapsed) {
      const progress = elapsed < retreat ? mix(anchor, monitorExit, elapsed / retreat)
        : elapsed < prelude ? desk : mix(room.start, room.enter, (elapsed - prelude) / approach);
      return { progress, about: null, text: noCopy };
    },
  };
}

export function phase5oNavigation(anchor: number, destination: string): { plan: CinematicNavigation; direction: 1 | -1 } | undefined {
  const back = navigationRewind(anchor, destination);
  if (back) return { plan: back, direction: -1 };
  const fromAbout = anchor >= about.start && anchor < about.end;
  const fromProjects = anchor >= projects.start && anchor < projects.end;
  if (destination === "about") {
    if (anchor < about.start) return { plan: enterAbout(anchor), direction: 1 };
    if (anchor >= about.end) return { plan: rewindAbout(anchor, 150, () => desk), direction: -1 };
    return;
  }
  const room = destination === "projects" ? projects : destination === "contact" ? contact : null;
  if (!room || (anchor >= room.start && anchor < room.end)) return;
  if (fromAbout) return { plan: leaveAbout(anchor, room), direction: 1 };
  return { plan: enterRoom(anchor, room, fromProjects), direction: 1 };
}
