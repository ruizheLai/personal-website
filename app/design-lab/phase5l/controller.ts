import { fps } from "../phase5h/timeline";
import { unit } from "../phase5f/rhythm";
import { aboutEnd, camera, copy, initialPose, mediaBeats, scene, stages, type Stage } from "./timeline";
import { createScrollLock } from "./scrollLock";

type State = "holding" | "preparing" | "playing-forward" | "playing-reverse" | "settling" | "error";
type Run = {
  stage: Stage;
  direction: 1 | -1;
  anchor: number;
  started: number;
  clock: number;
  decoded: number;
  waiting: boolean;
  advanced: number;
  observed: number;
  target: number;
  poster: HTMLImageElement | null;
  abort: AbortController;
  blob?: string;
  settledAt?: number;
};
type Beat = typeof mediaBeats[number];
export type CinematicPlan = {
  stages: Stage[];
  beats: Beat[];
  aboutEnd: number;
  clearance: number;
  hysteresis: number;
  responsive?: boolean;
  camera: typeof camera;
  copy: (index: number, fraction: number) => ReturnType<typeof copy>;
  look: (beat: Beat, fraction: number) => ReturnType<typeof scene>;
};

const originalPlan: CinematicPlan = {
  stages, beats: mediaBeats, aboutEnd, clearance: .022, hysteresis: .008, camera, copy,
  look(beat, fraction) { return scene(beat.clip, (beat.frames[0] + fraction * (beat.frames[1]-beat.frames[0])) / fps); },
};

export function createCinematic(
  root: HTMLElement, surface: HTMLElement, pin: (position: number) => void, wake: () => void, plan = originalPlan,
) {
  const { stages, beats, clearance, hysteresis, aboutEnd } = plan;
  const settledIndex = (progress: number) => stages.findLastIndex(stage => Boolean(stage.media) && progress >= stage.end - .001);
  const image = surface.querySelector("img")!;
  const video = surface.querySelector("video")!;
  const stageElement = surface.parentElement!;
  const skip = root.querySelector<HTMLButtonElement>(".pl-skip")!;
  const listeners = new AbortController();
  const lock = createScrollLock(() => finish(), plan.responsive);
  let state: State = "holding";
  let run: Run | null = null;
  let previous: number | null = null;
  let timer = 0;
  let emergency = 0;
  let callback = 0;
  let waits = 0;
  let drops = 0;
  let frames = 0;
  let recoveries = 0;
  let prepared: { url: string; abort: AbortController; data: Promise<Blob | null> } | null = null;
  let posterGeneration = 0;
  let pendingPose = "";

  function status(next: State) {
    state = next;
    root.dataset.cinematicState = state;
    skip.hidden = !lock.locked;
  }

  function prepare(stage: Stage | undefined, direction: 1 | -1) {
    const url = direction > 0 ? stage?.media?.forward : stage?.media?.reverse;
    if (url && prepared?.url === url) return;
    prepared?.abort.abort();
    prepared = null;
    if (!url) return;
    const abort = new AbortController();
    const data = fetch(url, { cache: "force-cache", signal: abort.signal }).then(response =>
      response.ok ? response.blob() : null).catch(() => null);
    prepared = { url, abort, data };
  }

  function stopVideo(current: Run | null) {
    clearTimeout(timer);
    clearTimeout(emergency);
    if (callback) video.cancelVideoFrameCallback(callback);
    callback = 0;
    current?.abort.abort();
    if (video.hasAttribute("src")) {
      const quality = video.getVideoPlaybackQuality?.();
      drops += quality?.droppedVideoFrames ?? 0;
      frames += quality?.totalVideoFrames ?? 0;
      root.dataset.cinematicDrops = String(drops);
      root.dataset.cinematicFrames = String(frames);
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    if (current?.blob) URL.revokeObjectURL(current.blob);
    surface.removeAttribute("data-playing");
  }

  function showPoster(index: number, decoded?: HTMLImageElement | null) {
    const beat = beats[index];
    const url = beat?.endPoster ?? initialPose;
    stageElement.dataset.scene = beat ? plan.look(beat, 1) : "framed";
    if (image.getAttribute("src") === url) {
      if (pendingPose) posterGeneration++;
      pendingPose = "";
      return;
    }
    if (decoded?.getAttribute("src") === url && decoded.complete && decoded.naturalWidth) {
      posterGeneration++;
      pendingPose = "";
      image.src = url;
      return;
    }
    if (pendingPose === url) return;
    const token = ++posterGeneration;
    pendingPose = url;
    const next = new Image();
    next.src = url;
    void next.decode().catch(() => {}).then(() => {
      if (token !== posterGeneration) return;
      pendingPose = "";
      if (next.naturalWidth) image.src = url;
    });
  }

  function finish(recovery = false) {
    const current = run;
    if (!current || current.settledAt !== undefined) return;
    clearTimeout(timer);
    if (callback) video.cancelVideoFrameCallback(callback);
    callback = 0;
    current.abort.abort();
    video.pause();
    if (recovery) root.dataset.cinematicRecoveries = String(++recoveries);
    current.settledAt = performance.now();
    status(recovery ? "error" : "settling");
    wake();
  }

  function begin(stage: Stage, direction: 1 | -1) {
    const target = direction > 0 ? stage.end + clearance : Math.max(0, stage.start - clearance);
    const anchor = direction > 0 ? stage.start - clearance : stage.end + clearance;
    const poster = stage.media ? new Image() : null;
    if (poster) poster.src = beats[settledIndex(target)]?.endPoster ?? initialPose;
    const current: Run = {
      stage, direction, anchor, target, poster, started: performance.now(), clock: 0,
      decoded: 0, waiting: false, advanced: 0, observed: 0, abort: new AbortController(),
    };
    run = current;
    posterGeneration++;
    pendingPose = "";
    root.dataset.cinematicStage = stage.id;
    root.dataset.cinematicDirection = direction > 0 ? "forward" : "reverse";
    lock.lock();
    pin(anchor);
    status("preparing");
    emergency = window.setTimeout(() => {
      if (run !== current) return;
      // Release the document even if the render loop stops consuming a recovery.
      try {
        stopVideo(current);
        previous = target;
        pin(target);
      } finally {
        run = null;
        lock.unlock();
        status("holding");
        wake();
      }
    }, stage.duration + 6500);

    if (!stage.media) {
      current.clock = performance.now();
      status(direction > 0 ? "playing-forward" : "playing-reverse");
      return;
    }
    const url = direction > 0 ? stage.media.forward : stage.media.reverse;
    const { signal } = current.abort;
    const original = () => {
      if (run !== current || signal.aborted) return;
      video.src = current.blob ?? url;
      void video.play().catch(() => { if (run === current && !signal.aborted) finish(true); });
    };
    function first() {
      if (run !== current || signal.aborted) return;
      current.clock = performance.now();
      current.advanced = current.clock;
      root.dataset.cinematicStartup = String(Math.round(current.clock - current.started));
      surface.setAttribute("data-playing", "");
      status(direction > 0 ? "playing-forward" : "playing-reverse");
      clearTimeout(timer);
      timer = window.setTimeout(() => finish(true), stage.duration + 4000);
      wake();
    }
    if (typeof video.requestVideoFrameCallback === "function") {
      const frame: VideoFrameRequestCallback = (_, metadata) => {
        callback = 0;
        if (run !== current || signal.aborted) return;
        current.decoded = metadata.mediaTime;
        if (!current.clock) first();
        if (metadata.mediaTime > current.observed) {
          current.advanced = performance.now();
          current.observed = metadata.mediaTime;
          current.waiting = false;
        }
        callback = video.requestVideoFrameCallback(frame);
      };
      callback = video.requestVideoFrameCallback(frame);
    } else {
      video.addEventListener("playing", first, { once: true, signal });
      video.addEventListener("timeupdate", () => {
        current.decoded = video.currentTime;
        current.advanced = performance.now();
        current.waiting = false;
      }, { signal });
    }
    video.addEventListener("waiting", () => {
      if (!current.clock) return;
      current.waiting = true;
      root.dataset.cinematicWaiting = String(++waits);
    }, { signal });
    video.addEventListener("ended", () => finish(), { once: true, signal });
    video.addEventListener("error", () => finish(true), { once: true, signal });
    timer = window.setTimeout(() => finish(true), 4500);
    if (prepared?.url === url) {
      void prepared.data.then(data => {
        if (run !== current || signal.aborted) return;
        if (data) current.blob = URL.createObjectURL(data);
        original();
      });
    } else original();
  }

  function visual(index: number, fraction: number, progress: number) {
    return { progress, about: progress < aboutEnd && index >= 0 ? plan.camera(index, fraction) : null, text: plan.copy(index, fraction) };
  }

  function hold(progress: number) {
    const index = settledIndex(progress);
    showPoster(index);
    return visual(index, 1, progress);
  }

  skip.addEventListener("click", () => finish(), { signal: listeners.signal });
  status("holding");

  return {
    sample(raw: number, now: number, snap: boolean) {
      if (!run && !snap && previous !== null) {
        const earlier = previous;
        const direction = raw > earlier ? 1 : -1;
        const stage = direction > 0
          ? stages.find(item => earlier <= item.start + hysteresis && raw > item.start + hysteresis)
          : stages.findLast(item => earlier >= item.end - hysteresis && raw < item.end - hysteresis);
        if (stage) begin(stage, direction);
        else if (Math.abs(raw - earlier) > .006) {
          prepare(direction > 0 ? stages.find(item => item.start >= raw) : stages.findLast(item => item.end <= raw), direction);
        }
      }
      const current = run;
      if (!current) {
        if (previous === null) prepare(stages.find(item => item.start >= raw), 1);
        previous = raw;
        return hold(raw);
      }
      if (current.settledAt !== undefined) {
        const { target, poster } = current;
        const index = settledIndex(target);
        showPoster(index, poster);
        pin(target);
        previous = target;
        // Allow the endpoint pose to paint before clearing the overlay and input gate.
        if ((!poster || poster.complete || now - current.settledAt > 180) && now - current.settledAt > 34) {
          const moveFocus = document.activeElement === skip;
          stopVideo(current);
          run = null;
          lock.unlock();
          status("holding");
          if (moveFocus) root.focus({ preventScroll: true });
          root.dataset.cinematicLockMs = String(Math.round(performance.now() - current.started));
          const nextStage = current.direction > 0
            ? stages.find(item => item.start >= target)
            : stages.findLast(item => item.end <= target);
          prepare(nextStage, current.direction);
        }
        return visual(index, 1, target);
      }
      if (Math.abs(raw - current.anchor) > .004) pin(current.anchor);
      if (state === "preparing") return hold(current.anchor);
      const { stage, direction } = current;
      const media = stage.media;
      let fraction: number;
      if (media) {
        if (now - current.advanced > 2400) finish(true);
        const displayed = current.waiting ? current.decoded : Math.min(video.currentTime, current.decoded + 1 / fps);
        const duration = Math.max(.04, plan.responsive && Number.isFinite(video.duration)
          ? video.duration - 1 / fps
          : (media.frames[1] - media.frames[0]) / fps);
        fraction = unit(displayed / duration);
      } else {
        fraction = unit((now - current.clock) / stage.duration);
        if (fraction >= 1) finish();
      }
      const authored = direction > 0 ? fraction : 1 - fraction;
      const progress = stage.start + (stage.end - stage.start) * authored;
      if (!media) return { progress, about: null, text: plan.copy(-1, 1) };
      const index = beats.indexOf(media);
      stageElement.dataset.scene = plan.look(media, authored);
      return visual(index, authored, progress);
    },
    get active() { return lock.locked; },
    cancel() {
      stopVideo(run);
      run = null;
      previous = null;
      posterGeneration++;
      pendingPose = "";
      prepared?.abort.abort();
      prepared = null;
      lock.unlock(false);
      status("holding");
    },
    destroy() {
      this.cancel();
      listeners.abort();
      lock.destroy();
    },
  };
}
