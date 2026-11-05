"use client";

import Image from "next/image";
import { useEffect, useId, useState, type CSSProperties } from "react";
import { AssetFigure, type CaseStudyAsset } from "@/components/fixlens/CaseStudyExperience";

export type MatchedComparisonProps = {
  mid: CaseStudyAsset;
  high: CaseStudyAsset;
  label: string;
};

/** Genuine matching viewports. Both screens stay fixed; the reveal mask alone moves. */
export default function MatchedComparison({ mid, high, label }: MatchedComparisonProps) {
  const [enhanced, setEnhanced] = useState(false);
  const [position, setPosition] = useState(50);
  const helpId = useId();
  const matched = mid.width > 0 && mid.height > 0 && high.width > 0 && high.height > 0
    && Math.abs(mid.width / mid.height - high.width / high.height) < 0.002;

  useEffect(() => setEnhanced(true), []);

  const style = {
    "--fx-mc-position": position + "%",
    aspectRatio: mid.width + " / " + mid.height,
  } as CSSProperties;

  return (
    <figure className={"fx-matched-comparison" + (enhanced && matched ? " fx-mc-enhanced" : "")} aria-label={label}>
      <div className="fx-mc-labels" aria-hidden="true">
        <span>Mid-fi</span><span>Hi-fi</span>
      </div>
      {enhanced && matched ? (
        <div className="fx-mc-surround">
          <div className="fx-mc-stage" style={style}>
            <Image
              className="fx-mc-screen"
              src={high.src}
              width={high.width}
              height={high.height}
              alt={high.alt}
              unoptimized
              loading="lazy"
              draggable={false}
            />
            <div className="fx-mc-mask" style={{ clipPath: "inset(0 " + (100 - position) + "% 0 0)" }}>
              <Image
                className="fx-mc-screen"
                src={mid.src}
                width={mid.width}
                height={mid.height}
                alt={mid.alt}
                unoptimized
                loading="lazy"
                draggable={false}
              />
            </div>
            <span className="fx-mc-divider" aria-hidden="true">
              <span className="fx-mc-handle">
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                  <path d="m7 4-5 5 5 5M15 4l5 5-5 5M10 2v14M12 2v14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
            <input
              className="fx-mc-range"
              type="range"
              min={0}
              max={100}
              step={1}
              value={position}
              aria-label={label + ": Mid-fi and Hi-fi reveal"}
              aria-valuetext={position + "% Mid-fi, " + (100 - position) + "% Hi-fi"}
              aria-describedby={helpId}
              onChange={(event) => setPosition(Number(event.currentTarget.value))}
            />
          </div>
        </div>
      ) : (
        <div className="fx-mc-fallback">
          <AssetFigure asset={mid} caption="Mid-fi" />
          <AssetFigure asset={high} caption="Hi-fi" />
        </div>
      )}
      <figcaption className="fx-mc-help" id={helpId}>
        {enhanced && matched
          ? "Drag the divider. Use the arrow keys when focused."
          : "The original Mid-fi and Hi-fi artifacts, shown separately."}
      </figcaption>
    </figure>
  );
}
