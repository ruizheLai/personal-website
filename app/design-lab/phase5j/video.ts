import { fps } from "../phase5h/timeline";
import { media, type Frame, type FrameEngine, type Present } from "./frames";

export function createVideo(surface: HTMLElement, gop: string, present: Present, diagnostics: DOMStringMap): FrameEngine {
  const video = surface.querySelector("video")!;
  const canvas = surface.querySelector("canvas")!;
  const context = canvas.getContext("2d", { alpha: false })!;
  const events = new AbortController();
  const { signal } = events;
  let wanted: Frame | null = null;
  let clip = 0;
  let drawable = -1;
  let seeks = 0;
  let callbacks = 0;
  let seeked = 0;
  let flight: { frame: number; started: number } | null = null;
  let frameCallback = 0;
  let fallback = 0;
  let watchdog = 0;
  let failed = false;

  function clearSeek() {
    if (frameCallback) video.cancelVideoFrameCallback(frameCallback);
    frameCallback = 0;
    cancelAnimationFrame(fallback);
    clearTimeout(watchdog);
    flight = null;
  }

  function draw(frame: number, latency: number, method: string) {
    present({ clip, frame }, latency, method, () => context.drawImage(video, 0, 0, canvas.width, canvas.height));
  }

  function finish(request: NonNullable<typeof flight>, method: string) {
    if (flight !== request || !wanted || wanted.clip !== clip || video.readyState < 2) return;
    clearSeek();
    drawable = request.frame;
    draw(drawable, performance.now() - request.started, method);
    pump();
  }

  function pump() {
    if (!wanted || failed || flight || video.readyState < 2) return;
    const { frame } = wanted;
    if (frame === drawable) {
      draw(frame, 0, "video-current");
      return;
    }
    const request = { frame, started: performance.now() };
    flight = request;
    diagnostics.seeks = String(++seeks);
    if (typeof video.requestVideoFrameCallback === "function") {
      const onFrame: VideoFrameRequestCallback = (_, metadata) => {
        frameCallback = 0;
        if (flight !== request) return;
        if (Math.round(metadata.mediaTime * fps) === frame) {
          diagnostics.frameCallbacks = String(++callbacks);
          finish(request, "video-frame");
        } else frameCallback = video.requestVideoFrameCallback(onFrame);
      };
      frameCallback = video.requestVideoFrameCallback(onFrame);
    }
    watchdog = window.setTimeout(() => {
      if (flight !== request) return;
      if (!video.seeking && video.readyState >= 2) finish(request, "video-watchdog");
      else {
        clearSeek();
        failed = true;
      }
    }, 1300);
    video.currentTime = Math.min(video.duration - .001, (frame + .1) / fps);
  }

  video.addEventListener("loadeddata", () => {
    drawable = 0;
    pump();
  }, { signal });
  video.addEventListener("seeked", () => {
    const request = flight;
    // A callback can arrive before seeked, after which a newer seek may already be active.
    if (!request || video.seeking || Math.abs(video.currentTime * fps - request.frame) > .5) return;
    diagnostics.seeked = String(++seeked);
    if (frameCallback) {
      // Give the browser's compositor one turn to report the decoded frame.
      fallback = requestAnimationFrame(() => finish(request, "video-seeked"));
    } else finish(request, "video-seeked");
  }, { signal });
  video.addEventListener("error", () => { clearSeek(); failed = true; }, { signal });

  function stop() {
    wanted = null;
    clearSeek();
    if (clip) {
      video.removeAttribute("src");
      video.load();
      clip = 0;
    }
  }

  return {
    request(frame) {
      wanted = frame;
      if (clip !== frame.clip) {
        clearSeek();
        clip = frame.clip;
        drawable = -1;
        failed = false;
        video.src = `${media}/g${gop}-${clip}.mp4`;
        video.load();
      }
      pump();
    },
    stop,
    destroy() { events.abort(); stop(); },
  };
}
