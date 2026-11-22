import { frameAt, media, ordinal, size, type Frame, type FrameEngine, type Present } from "./frames";

const cacheLimit = 26;
const concurrentLimit = 4;
const neighborhood = [1, 2, 3, 4, 5, 6, 8, 10, 12, -1, -2, -3];

export function createSequence(surface: HTMLElement, present: Present, diagnostics: DOMStringMap): FrameEngine {
  const cache = new Map<number, HTMLImageElement>();
  const pending = new Map<number, HTMLImageElement>();
  const failed = new Set<number>();
  let wanted: number | null = null;
  let direction = 1;
  let disposed = false;
  let hits = 0;
  let requests = 0;

  function draw(index: number, image: HTMLImageElement, latency: number, method: string) {
    present(frameAt(index)!, latency, method, () => {
      if (surface.firstElementChild !== image) surface.replaceChildren(image);
    });
  }

  function load(index: number) {
    const frame = frameAt(index);
    if (!frame || pending.has(index) || cache.has(index) || failed.has(index)) return;
    const image = new Image(size, size);
    image.alt = "";
    image.decoding = "async";
    image.fetchPriority = index === wanted ? "high" : "low";
    pending.set(index, image);
    const started = performance.now();
    image.src = `${media}/${frame.clip}/${String(frame.frame).padStart(3, "0")}.webp`;
    void image.decode().then(() => {
      if (disposed) return;
      cache.set(index, image);
      if (wanted !== null && Math.abs(wanted - index) <= 3) draw(index, image, performance.now() - started, "image-decode");
      while (cache.size > cacheLimit) {
        const protectedIndex = wanted ?? index;
        const candidate = [...cache.keys()].find(key => key !== protectedIndex && cache.get(key) !== surface.firstElementChild);
        if (candidate === undefined) break;
        cache.delete(candidate);
      }
      diagnostics.cache = String(cache.size);
    }, () => {
      if (!disposed) failed.add(index);
    }).finally(() => {
      pending.delete(index);
      pump();
    });
  }

  function pump() {
    if (disposed || wanted === null) return;
    const target = wanted;
    if (pending.size < concurrentLimit) load(target);
    // Leave a slot clear for a new foreground request when scrolling reverses.
    for (const offset of neighborhood) {
      if (pending.size >= concurrentLimit - 1) break;
      load(target + offset * direction);
    }
  }

  return {
    request(frame, nextDirection) {
      wanted = ordinal(frame);
      direction = nextDirection;
      const image = cache.get(wanted);
      diagnostics.requests = String(++requests);
      if (image) {
        cache.delete(wanted);
        cache.set(wanted, image);
        diagnostics.hits = String(++hits);
        draw(wanted, image, 0, "image-cache");
      } else {
        const loading = pending.get(wanted);
        if (loading) loading.fetchPriority = "high";
      }
      pump();
    },
    stop() { wanted = null; },
    destroy() {
      disposed = true;
      for (const image of pending.values()) image.removeAttribute("src");
      pending.clear();
      cache.clear();
    },
  };
}
