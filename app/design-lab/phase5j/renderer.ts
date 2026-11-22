import { fps } from "../phase5h/timeline";
import { fromTime, options, ordinal, type Frame, type Present } from "./frames";
import { createSequence } from "./sequence";
import { createVideo } from "./video";
import { createPausedVideo } from "../phase5k/video";

export function createFrameRenderer(root: HTMLElement, pausedPolish = false) {
  const { engine: selection, gop, perf } = options(location.search);
  const engine = pausedPolish ? "video" : selection;
  const slots = new URLSearchParams(location.search).get("slots") === "1" ? 1 : 2;
  const stage = root.parentElement!;
  const diagnostics = root.dataset;
  const overlay = root.querySelector<HTMLOutputElement>("output")!;
  diagnostics.engine = engine;
  if (engine === "video") diagnostics.gop = gop;
  if (pausedPolish) diagnostics.slots = String(slots);
  overlay.hidden = !perf;
  let wanted: Frame | null = null;
  let shown: Frame | null = null;
  let requestedAt = 0;
  let direction = 1;
  let requests = 0;
  let presentations = 0;

  function updateOverlay() {
    if (!perf || !wanted) return;
    const desired = `${wanted.clip}:${wanted.frame}`;
    const actual = shown ? `${shown.clip}:${shown.frame}` : "—";
    const lag = shown ? Math.abs(ordinal(wanted) - ordinal(shown)) : "—";
    const stats = engine === "sequence" ? `Cache ${diagnostics.cache ?? 0} · hits ${diagnostics.hits ?? 0}`
      : `GOP ${gop} · seeks ${diagnostics.seeks ?? 0}`;
    const handoffs = pausedPolish ? `\n${slots} decoder${slots === 2 ? "s" : ""} · warm handoffs ${diagnostics.warmSwitches ?? 0}/${diagnostics.switches ?? 0}` : "";
    overlay.value = `${engine}  ${desired} → ${actual}\nLag ${lag} frames · ${diagnostics.latency ?? "—"} ms\n${stats}${handoffs}`;
  }

  const present: Present = (next, decodeMs, method, draw) => {
    if (!wanted || wanted.clip !== next.clip) return;
    const distance = Math.abs(wanted.frame - next.frame);
    if (shown?.clip === next.clip && distance >= Math.abs(wanted.frame - shown.frame)) return;
    // On entering a different clip, keep the last image until a current frame is ready.
    if (distance > 3 && method.startsWith("image-")) return;
    draw();
    shown = next;
    const time = next.frame / fps;
    stage.dataset.scene = next.clip === 1 && time < 3 || next.clip === 5 && time >= 6.25 ? "framed" : "unframed";
    root.setAttribute("data-ready", "");
    diagnostics.shownClip = String(next.clip);
    diagnostics.shownFrame = String(next.frame);
    diagnostics.method = method;
    diagnostics.decodeMs = decodeMs.toFixed(1);
    diagnostics.latency = Math.max(0, performance.now() - requestedAt).toFixed(1);
    diagnostics.presented = String(++presentations);
    updateOverlay();
  };

  const surface = root.querySelector<HTMLElement>(engine === "video" ? ".pj-video" : ".pj-images")!;
  const renderer = pausedPolish ? createPausedVideo(surface, gop, slots, present, diagnostics) : engine === "video" ? createVideo(surface, gop, present, diagnostics) : createSequence(surface, present, diagnostics);

  return {
    update(clip: number, time: number) {
      const next = fromTime(clip, time);
      if (wanted && ordinal(wanted) === ordinal(next)) return;
      if (wanted) direction = Math.sign(ordinal(next) - ordinal(wanted)) || direction;
      wanted = next;
      requestedAt = performance.now();
      diagnostics.targetClip = String(next.clip);
      diagnostics.targetFrame = String(next.frame);
      diagnostics.requested = String(++requests);
      renderer.request(next, direction);
      updateOverlay();
    },
    stop() {
      if (!wanted) return;
      wanted = null;
      renderer.stop();
    },
    destroy() { renderer.destroy(); },
  };
}
