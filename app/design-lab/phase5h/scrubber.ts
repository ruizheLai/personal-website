import { fps, mediaRoot } from "./timeline";

type Target = { clip: number; frame: number };
type Slot = {
  video: HTMLVideoElement;
  clip: number;
  frame: number;
  inFlight: number | null;
  started: number;
  failed: boolean;
  watchdog?: ReturnType<typeof setTimeout>;
};

export function createScrubber(canvas: HTMLCanvasElement, present: (clip: number, time: number, elapsed: number) => void) {
  const context = canvas.getContext("2d", { alpha: false })!;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  let wanted: Target | null = null;
  let shown: Target | null = null;
  let active: Slot | null = null;
  let lastDirection = 1;
  let fallbackClip = 0;
  let disposed = false;

  const slots: Slot[] = Array.from({ length: 2 }, () => ({
    video: document.createElement("video"), clip: 0, frame: -1, inFlight: null, started: 0, failed: false,
  }));

  function draw(slot: Slot, frame: number, elapsed = 0) {
    if (shown?.clip === slot.clip && shown.frame === frame) return;
    context.drawImage(slot.video, 0, 0, canvas.width, canvas.height);
    shown = { clip: slot.clip, frame };
    active = slot;
    present(slot.clip, frame / fps, elapsed);
  }

  function arm(slot: Slot, milliseconds: number) {
    clearTimeout(slot.watchdog);
    slot.watchdog = setTimeout(() => {
      slot.failed = true;
      slot.inFlight = null;
      pump();
    }, milliseconds);
  }

  function load(slot: Slot, clip: number) {
    slot.clip = clip;
    slot.frame = -1;
    slot.inFlight = null;
    slot.failed = false;
    slot.video.preload = "auto";
    slot.video.src = `${mediaRoot}/clip-${clip}.mp4`;
    slot.video.load();
    arm(slot, 5000);
    return slot;
  }

  function getSlot(clip: number) {
    return slots.find(slot => slot.clip === clip) ?? load(slots.find(slot => slot !== active)!, clip);
  }

  function fallback(target: Target) {
    if (shown?.clip === target.clip || fallbackClip === target.clip) return;
    fallbackClip = target.clip;
    const image = new Image();
    image.onload = () => {
      if (fallbackClip === target.clip) fallbackClip = 0;
      if (disposed || wanted?.clip !== target.clip || shown?.clip === target.clip) return;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      shown = { clip: target.clip, frame: -1 };
      canvas.dataset.ready = "";
    };
    image.src = `${mediaRoot}/start-${target.clip}.webp`;
  }

  function pump() {
    if (!wanted || disposed) return;
    const slot = getSlot(wanted.clip);
    if (slot.failed) {
      fallback(wanted);
      present(wanted.clip, wanted.frame / fps, -1);
      return;
    }
    if (slot.video.readyState < 2 || slot.inFlight !== null) return;
    const last = Math.max(0, Math.ceil(slot.video.duration * fps - .02) - 1);
    const frame = Math.min(wanted.frame, last);
    if (slot.frame === frame) {
      draw(slot, frame);
    } else {
      slot.inFlight = frame;
      slot.started = performance.now();
      arm(slot, 1400);
      slot.video.currentTime = Math.min(slot.video.duration - .001, (frame + .1) / fps);
      return;
    }
    const neighbor = wanted.clip + lastDirection;
    const withinBoundary = lastDirection > 0 ? frame >= last - 24 : frame <= 24;
    if (withinBoundary && neighbor >= 1 && neighbor <= 5 && !slots.some(item => item.clip === neighbor)) getSlot(neighbor);
  }

  for (const slot of slots) {
    const { video } = slot;
    video.muted = true;
    video.playsInline = true;
    video.addEventListener("loadeddata", () => { clearTimeout(slot.watchdog); slot.failed = false; slot.frame = 0; pump(); });
    video.addEventListener("seeked", () => {
      clearTimeout(slot.watchdog);
      const frame = slot.inFlight;
      slot.inFlight = null;
      if (frame === null) return;
      slot.frame = frame;
      if (wanted?.clip === slot.clip) draw(slot, frame, performance.now() - slot.started);
      pump();
    });
    video.addEventListener("error", () => { clearTimeout(slot.watchdog); slot.failed = true; pump(); });
  }

  return {
    update(clip: number, time: number) {
      const frame = Math.round(time * fps);
      if (wanted?.clip === clip && wanted.frame === frame) return;
      if (wanted) lastDirection = Math.sign(clip - wanted.clip || frame - wanted.frame) || lastDirection;
      wanted = { clip, frame };
      pump();
    },
    stop() { wanted = null; },
    destroy() {
      disposed = true;
      for (const { video, watchdog } of slots) { clearTimeout(watchdog); video.removeAttribute("src"); video.load(); }
    },
  };
}
