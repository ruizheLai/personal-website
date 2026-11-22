import { glide, unit } from "../phase5f/rhythm";
import { scene } from "../phase5l/timeline";
import type { CinematicNavigation } from "../phase5l/controller";
import { refinedChapters, refinedLanding, refinedPlan } from "../phase5m/timeline";

const [about, projects, contact] = refinedChapters;
const desk = about.end + .035;
const mix = (from: number, to: number, fraction: number) => from + (to - from) * glide(fraction);
const noCopy = refinedPlan.copy(-1, 1);

export function navigationRewind(anchor: number, destination: string): CinematicNavigation | undefined {
  const fromContact = anchor >= contact.start + .05;
  const fromProjects = anchor >= projects.start + .05 && anchor < projects.end - .05;
  if (!(destination === "about" && (fromProjects || fromContact) || destination === "projects" && fromContact)) return;

  const retreat = fromContact ? 520 : 570;
  const prelude = retreat + 130;
  const room = fromContact ? contact : projects;
  const roomExit = anchor > room.leave ? room.end + .001 : room.start - .001;

  if (destination === "projects") {
    return {
      anchor, target: projects.enter, prelude, duration: prelude + 850,
      view(elapsed) {
        const progress = elapsed < retreat
          ? mix(anchor, roomExit, elapsed / retreat)
          : elapsed < prelude ? desk : mix(projects.start, projects.enter, (elapsed - prelude) / 850);
        return { progress, about: null, text: noCopy };
      },
    };
  }

  return rewindAbout(anchor, prelude, elapsed => elapsed < retreat ? mix(anchor, roomExit, elapsed / retreat) : desk);
}

export function rewindAbout(anchor: number, prelude: number, retreat: (elapsed: number) => number): CinematicNavigation {
  return {
    anchor, target: refinedLanding, prelude, duration: prelude + 56 / 30 * 1000,
    source: "/images/phase5n/rewind.mp4",
    view(elapsed, presentedTime) {
      if (presentedTime === undefined) {
        return { progress: retreat(elapsed), about: null, text: noCopy };
      }
      const frame = Math.round(presentedTime * 30);
      const fraction = unit(frame / 19);
      const text = frame < 20 ? refinedPlan.copy(7, 1)
        : frame < 37 ? refinedPlan.copy(frame < 29 ? 6 : 5, 1)
        : frame < 47 ? refinedPlan.copy(frame < 45 ? 2 : 1, 1) : refinedPlan.copy(0, 1);
      return {
        progress: mix(about.end - .001, refinedLanding, frame / 55),
        about: frame < 20 ? refinedPlan.camera(8, 1 - fraction) : refinedPlan.camera(0, 1),
        scene: frame < 20 ? scene(5, (216 - 101 * fraction) / 24) : "unframed",
        text: { ...text, alpha: frame < 20 ? glide((fraction - .5) / .5) : 1 },
      };
    },
  };
}
