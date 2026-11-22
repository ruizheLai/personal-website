import { animationBeats, initialPoster } from "./beats";

type State = "idle" | "transitioning" | "playing-forward" | "playing-reverse" | "holding" | "recovering";
const margin = .033;
const framed = (clip: number, frame: number) => clip === 1 && frame < 72 || clip === 5 && frame >= 150;

export function createBeatPlayer(
  element: HTMLElement,
  presentCopy: (chapter: string, step: number) => void,
  wake: () => void,
) {
  const image = element.querySelector("img")!;
  const video = element.querySelector("video")!;
  const stage = element.parentElement!;
  let state: State = "idle";
  let held = -1;
  let target = -1;
  let playing = -1;
  let direction = 1;
  let generation = 0;
  let timer = 0;
  let stopListening = () => {};
  let initial = true;
  let plays = 0;
  let waiting = 0;
  let dropped = 0;
  let decoded = 0;

  function mark(next: State) {
    state = next;
    element.dataset.state = state;
    wake();
  }

  function show(src: string, clip: number, frame: number) {
    if (image.getAttribute("src") !== src) image.src = src;
    stage.dataset.scene = framed(clip, frame) ? "framed" : "unframed";
  }

  function stop() {
    generation++;
    clearTimeout(timer);
    stopListening();
    stopListening = () => {};
    if (video.hasAttribute("src")) {
      const quality = video.getVideoPlaybackQuality();
      dropped += quality.droppedVideoFrames;
      decoded += quality.totalVideoFrames;
      element.dataset.dropped = String(dropped);
      element.dataset.decoded = String(decoded);
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    element.removeAttribute("data-playing");
    playing = -1;
  }

  function settle(index: number, recovery = false, preserveFrame = false) {
    held = index;
    const beat = animationBeats[index];
    const url = beat?.endPoster ?? initialPoster;
    const finish = () => {
      show(url, beat?.clip ?? 1, beat?.frames[1] ?? 0);
      stop();
      element.dataset.beat = beat?.id ?? "idle";
      presentCopy(beat?.copy ?? "", beat?.step ?? 0);
      mark(beat ? "holding" : "idle");
    };
    const request = generation;
    if ((preserveFrame || recovery) && image.getAttribute("src") !== url) {
      mark("recovering");
      const endpoint = new Image();
      endpoint.src = url;
      void endpoint.decode().catch(() => {}).then(() => {
        if (request === generation) finish();
      });
    } else finish();
  }

  function play(index: number, next: number) {
    stop();
    const request = generation;
    const beat = animationBeats[index];
    direction = next > held ? 1 : -1;
    const forward = direction === 1;
    playing = index;
    const started = performance.now();
    const listeners = new AbortController();
    const { signal } = listeners;
    let callback = 0;
    stopListening = () => {
      listeners.abort();
      if (callback) video.cancelVideoFrameCallback(callback);
    };
    mark("transitioning");
    const endpoint = new Image();
    endpoint.src = animationBeats[next]?.endPoster ?? initialPoster;
    const fail = () => {
      if (request === generation) {
        stop();
        settle(next, true);
      }
    };
    const ready = () => {
      if (request !== generation) return;
      clearTimeout(timer);
      timer = window.setTimeout(fail, 12000);
      element.dataset.firstMs = String(Math.round(performance.now() - started));
      element.setAttribute("data-playing", "");
      mark(forward ? "playing-forward" : "playing-reverse");
    };
    video.addEventListener("playing", () => {
      if (typeof video.requestVideoFrameCallback === "function") callback = video.requestVideoFrameCallback(ready);
      else ready();
    }, { once: true, signal });
    video.addEventListener("waiting", () => {
      if (!element.hasAttribute("data-playing")) return;
      element.dataset.waiting = String(++waiting);
    }, { signal });
    video.addEventListener("ended", () => {
      if (request === generation) settle(next, false, true);
    }, { once: true, signal });
    video.addEventListener("error", fail, { once: true, signal });
    timer = window.setTimeout(fail, 4500);
    video.src = forward ? beat.forward : beat.reverse;
    element.dataset.plays = String(++plays);
    void video.play().catch(fail);
  }

  return {
    update(progress: number, snap: boolean, pastAbout: boolean) {
      if (pastAbout && playing >= 0) snap = true;
      let next = snap || initial ? -1 : target;
      const tolerance = snap || initial ? 0 : margin;
      while (next + 1 < animationBeats.length && progress >= animationBeats[next + 1].trigger + tolerance) next++;
      while (next >= 0 && progress < animationBeats[next].trigger - tolerance) next--;
      if (!snap && !initial && target === next) return;
      target = next;
      element.dataset.target = animationBeats[next]?.id ?? "idle";
      const previous = held;
      const inFlight = state === "transitioning" || state === "playing-forward" || state === "playing-reverse" || state === "recovering";
      if (initial || snap || pastAbout || inFlight || Math.abs(next - previous) !== 1) {
        initial = false;
        stop();
        settle(next, true);
      } else {
        play(Math.max(next, previous), next);
      }
    },
    visual() {
      const index = playing >= 0 ? playing : held;
      const beat = animationBeats[index];
      const inMotion = state === "playing-forward" || state === "playing-reverse";
      const cameraMotion = inMotion && (beat?.camera === "pull" || beat?.camera === "return");
      const t = cameraMotion && video.duration > 0 ? Math.min(1, video.currentTime / video.duration) : 0;
      const fraction = playing < 0 ? 1 : direction === 1 ? t : 1 - t;
      if (beat && inMotion) {
        const [first, last] = beat.frames;
        stage.dataset.scene = framed(beat.clip, first + (last - first) * fraction) ? "framed" : "unframed";
      }
      return { index, fraction, busy: playing >= 0, cameraMotion };
    },
    reset() {
      stop();
      initial = true;
    },
  };
}
