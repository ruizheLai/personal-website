import { fps } from "../phase5h/timeline";

export type Frame = { clip: number; frame: number };
export type Present = (frame: Frame, latency: number, method: string, draw: () => void) => void;
export type FrameEngine = {
  request: (frame: Frame, direction: number) => void;
  stop: () => void;
  destroy: () => void;
};

export const size = 640;
export const media = "/images/phase5j";
export const frameCounts = [121, 121, 121, 217, 217];
const offsets = [0, 121, 242, 363, 580];
const total = 797;
export const ordinal = ({ clip, frame }: Frame) => offsets[clip - 1] + frame;

export function frameAt(index: number): Frame | undefined {
  if (index < 0 || index >= total) return;
  const clip = offsets.findLastIndex(offset => offset <= index);
  return { clip: clip + 1, frame: index - offsets[clip] };
}

export function fromTime(clip: number, time: number): Frame {
  return { clip, frame: Math.min(frameCounts[clip - 1] - 1, Math.max(0, Math.round(time * fps))) };
}

export function options(search: string) {
  const params = new URLSearchParams(search);
  const parsed = params.get("gop");
  return {
    engine: params.get("engine") === "video" ? "video" : "sequence",
    gop: parsed === "1" || parsed === "2" ? parsed : "6",
    perf: params.get("perf") === "1",
  } as const;
}
