import { fps } from "../phase5h/timeline";
import { frameCounts, media, type Frame, type FrameEngine, type Present } from "../phase5j/frames";

type Seek = { frame: number; started: number };
type Slot = {
  video: HTMLVideoElement;
  clip: number;
  decoded: number;
  prime: number;
  flight: Seek | null;
  events: AbortController | null;
  frameCallback: number;
  fallback: number;
  timeout: number;
  retries: number;
  failed: boolean;
};

const prepareDistance = 24;
const exact = (video: HTMLVideoElement, frame: number) =>
  !video.seeking && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
  Math.abs(video.currentTime * fps - frame) < .4;

export function createPausedVideo(
  surface: HTMLElement, gop: string, count: 1 | 2, present: Present, diagnostics: DOMStringMap,
): FrameEngine {
  const primary = surface.querySelector("video")!;
  const canvas = surface.querySelector("canvas")!;
  const context = canvas.getContext("2d", { alpha: false })!;
  const neighbour = count === 2 ? document.createElement("video") : null;
  if (neighbour) {
    neighbour.className = primary.className;
    neighbour.muted = true;
    neighbour.playsInline = true;
    surface.insertBefore(neighbour, canvas);
  }
  const slots: Slot[] = (neighbour ? [primary, neighbour] : [primary]).map(video => ({
    video, clip: 0, decoded: -1, prime: -1, flight: null, events: null,
    frameCallback: 0, fallback: 0, timeout: 0, retries: 0, failed: false,
  }));
  let active: Slot | null = null;
  let wanted: Frame | null = null;
  let painted: Frame | null = null;
  let direction = 1;
  const counters = { seeks: 0, verified: 0, seekFallbacks: 0, stale: 0, cancelled: 0, prepares: 0, switches: 0, warmSwitches: 0 };

  function countEvent(key: keyof typeof counters) {
    diagnostics[key] = String(++counters[key]);
  }

  function clearSeek(slot: Slot) {
    if (slot.frameCallback) slot.video.cancelVideoFrameCallback(slot.frameCallback);
    cancelAnimationFrame(slot.fallback);
    clearTimeout(slot.timeout);
    slot.frameCallback = 0;
    slot.fallback = 0;
    slot.flight = null;
  }

  function release(slot: Slot) {
    clearSeek(slot);
    slot.events?.abort();
    if (slot.clip) {
      slot.video.removeAttribute("src");
      slot.video.load();
    }
    slot.clip = 0;
    slot.events = null;
  }

  function load(slot: Slot, clip: number, prime: number) {
    release(slot);
    Object.assign(slot, { clip, prime, decoded: -1, retries: 0, failed: false });
    const { video } = slot;
    const controller = slot.events = new AbortController();
    const { signal } = controller;
    video.addEventListener("loadedmetadata", () => {
      // A reverse neighbour needs a tail seek. Let other sources deliver their
      // initial data before seeking so the browser can reuse its initial range.
      if (slot !== active && slot.prime > 0) pump(slot);
    }, { signal });
    video.addEventListener("loadeddata", () => {
      if (!slot.flight && exact(video, 0)) slot.decoded = 0;
      pump(slot);
    }, { signal });
    video.addEventListener("seeked", () => {
      const seek = slot.flight;
      if (!seek || !exact(video, seek.frame)) return;
      if (slot.frameCallback) {
        slot.fallback = requestAnimationFrame(() => {
          if (exact(video, seek.frame)) complete(slot, seek, false);
        });
      } else complete(slot, seek, false);
    }, { signal });
    video.addEventListener("error", () => {
      clearSeek(slot);
      slot.failed = true;
    }, { signal });
    video.preload = prime < 0 ? "metadata" : "auto";
    video.src = `${media}/g${gop}-${clip}.mp4`;
    video.load();
  }

  function prepare() {
    if (count !== 2 || !active || !wanted || active.decoded < 0) return;
    const other = slots.find(slot => slot !== active)!;
    const { clip, frame } = wanted;
    const last = frameCounts[clip - 1] - 1;
    const adjacent = clip + direction;
    const edge = direction > 0 ? last - frame : frame;
    if (edge <= prepareDistance && adjacent >= 1 && adjacent <= frameCounts.length) {
      if (other.clip !== adjacent) {
        countEvent("prepares");
        load(other, adjacent, direction > 0 ? 0 : frameCounts[adjacent - 1] - 1);
      }
    } else if (other.clip && Math.abs(other.clip - clip) > 1) {
      release(other);
    }
  }

  function draw(slot: Slot, elapsed: number, method: string) {
    if (slot !== active || !wanted || slot.clip !== wanted.clip || slot.decoded !== wanted.frame) return;
    present(wanted, elapsed, method, () => context.drawImage(slot.video, 0, 0, canvas.width, canvas.height));
    painted = wanted;
  }

  function complete(slot: Slot, seek: Seek, verified: boolean) {
    if (slot.flight !== seek || slot.video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    clearSeek(slot);
    slot.decoded = seek.frame;
    slot.retries = 0;
    countEvent(verified ? "verified" : "seekFallbacks");
    if (slot === active) {
      if (wanted?.frame === seek.frame) draw(slot, performance.now() - seek.started, verified ? "video-frame" : "video-seeked");
      else countEvent("stale");
      prepare();
    }
    if (slot === active) pump(slot);
  }

  function pump(slot: Slot) {
    const foreground = slot === active;
    const ready = foreground ? HTMLMediaElement.HAVE_CURRENT_DATA : HTMLMediaElement.HAVE_METADATA;
    if (!slot.clip || slot.failed || slot.flight || slot.video.readyState < ready) return;
    const frame = foreground ? wanted?.frame ?? -1 : slot.prime;
    if (frame < 0) return;
    if (foreground && painted?.clip === slot.clip && painted.frame === frame) {
      prepare();
      return;
    }
    const { video } = slot;
    if (slot.decoded === frame) {
      if (foreground) {
        draw(slot, 0, "video-current");
        prepare();
      }
      return;
    }
    // The initial decoded frame of a new source arrives without a seek.
    if (frame === 0 && slot.decoded < 0 && video.currentTime === 0) {
      if (exact(video, 0)) {
        slot.decoded = 0;
        if (foreground) pump(slot);
      }
      return;
    }

    const seek = slot.flight = { frame, started: performance.now() };
    countEvent("seeks");
    if (typeof video.requestVideoFrameCallback === "function") {
      const report: VideoFrameRequestCallback = (_, metadata) => {
        slot.frameCallback = 0;
        if (slot.flight !== seek) return;
        if (Math.round(metadata.mediaTime * fps) === frame) complete(slot, seek, true);
        else slot.frameCallback = video.requestVideoFrameCallback(report);
      };
      slot.frameCallback = video.requestVideoFrameCallback(report);
    }
    slot.timeout = window.setTimeout(() => {
      if (slot.flight !== seek) return;
      if (exact(video, frame)) complete(slot, seek, false);
      else {
        clearSeek(slot);
        if (slot.retries++ === 0) pump(slot);
        else slot.failed = true;
      }
    }, 1300);
    video.currentTime = Math.min(video.duration - .001, (frame + .1) / fps);
  }

  function stop() {
    active = null;
    wanted = null;
    for (const slot of slots) release(slot);
  }

  return {
    request(frame, nextDirection) {
      wanted = frame;
      direction = nextDirection;
      if (active?.clip !== frame.clip) {
        const existing = slots.find(slot => slot.clip === frame.clip && !slot.failed);
        if (active) {
          countEvent("switches");
          if (existing && existing.decoded >= 0) countEvent("warmSwitches");
          // The earlier decoder can finish its pending frame for a possible reversal.
          // Only the active slot can draw to the stage.
          active.prime = -1;
        }
        active = existing ?? slots.find(slot => slot !== active) ?? slots[0];
        if (!existing) load(active, frame.clip, -1);
      } else if (active.failed) {
        load(active, frame.clip, -1);
      }
      const seek = active.flight;
      if (seek && Math.abs(seek.frame - frame.frame) >= 8 && performance.now() - seek.started >= 42) {
        countEvent("cancelled");
        clearSeek(active);
        active.decoded = -1;
      }
      pump(active);
      prepare();
    },
    stop,
    destroy() { stop(); neighbour?.remove(); },
  };
}
