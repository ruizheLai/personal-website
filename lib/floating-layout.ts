import type { SurfaceRect } from "./workspace-config";
export function placeFloatingContent(anchor: SurfaceRect, width: number, height: number, viewport: { width: number; height: number }, obstacles: SurfaceRect[]) {
  const gap = 18, margin = 14;
  const below = { left: anchor.left + anchor.width / 2 - width / 2, top: anchor.top + anchor.height + gap };
  const left = { left: anchor.left - width - gap, top: anchor.top - height * .62 };
  const right = { left: anchor.left + anchor.width + gap, top: anchor.top - height * .62 };
  const above = { left: anchor.left + anchor.width / 2 - width / 2, top: anchor.top - height - gap };
  const candidates = viewport.width < 768 ? [below, left, right, above] : [left, below, right, above];
  const overlap = (a: SurfaceRect, b: SurfaceRect) => Math.max(0, Math.min(a.left + a.width, b.left + b.width + 10) - Math.max(a.left, b.left - 10)) * Math.max(0, Math.min(a.top + a.height, b.top + b.height + 10) - Math.max(a.top, b.top - 10));
  return candidates.map((point, index) => {
    const position = { left: Math.max(margin, Math.min(point.left, viewport.width - width - margin)), top: Math.max(margin, Math.min(point.top, viewport.height - height - margin)) };
    return { ...position, score: obstacles.reduce((sum, obstacle) => sum + overlap({ ...position, width, height }, obstacle), 0) * 1000 + index };
  }).sort((a, b) => a.score - b.score)[0];
}
