import { size } from "./frames";

export default function FrameStage() {
  return <div className="pj-media">
    <div className="pj-images" />
    <div className="pj-video">
      <video className="pj-decoder" muted playsInline preload="none" />
      <canvas width={size} height={size} />
    </div>
    <output className="pj-diagnostics" hidden />
  </div>;
}
