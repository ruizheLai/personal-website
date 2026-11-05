"use client";

import Image from "next/image";
import { ImageZoomProvider, useImageZoom } from "./NaturalImageZoom";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

export type CaseStudyAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title?: string;
};

function ExpandIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
      <path d="m3 3 6 6m12-6-6 6M3 21l6-6m12 6-6-6" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {direction === "previous" ? <path d="m14 6-6 6 6 6M8 12h12" /> : <path d="m10 6 6 6-6 6M4 12h12" />}
    </svg>
  );
}

/** Only this wrapper is interactive; all server-rendered case-study content remains readable without JS. */
export function CaseStudyExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;

    const configure = () => {
      observer?.disconnect();
      observer = null;
      root.classList.remove("fx-motion-ready");

      if (preference.matches) return;
      const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-fx-reveal]"));
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("fx-revealed");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px 24px 0px" },
      );
      targets.forEach((target) => observer?.observe(target));
      root.classList.add("fx-motion-ready");
    };

    configure();
    preference.addEventListener("change", configure);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", configure);
      root.classList.remove("fx-motion-ready");
    };
  }, []);

  return <ImageZoomProvider><div className="fx-experience" ref={rootRef}>{children}</div></ImageZoomProvider>;
}

export function AssetFigure({
  asset,
  caption,
  className = "",
  priority = false,
  sizes = "(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 44vw, 640px",
}: {
  asset: CaseStudyAsset;
  caption?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const open = useImageZoom();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!open || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open({ asset, caption, opener: event.currentTarget });
  };

  return (
    <figure className={"fx-figure " + className}>
      <a
        className="fx-image-link"
        href={asset.src}
        onClick={handleClick}
        aria-label={"Enlarge " + (asset.title || asset.alt)}
        aria-haspopup={open ? "dialog" : undefined}
      >
        <Image
          className="fx-image"
          src={asset.src}
          width={asset.width}
          height={asset.height}
          alt={asset.alt}
          sizes={sizes}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
          unoptimized
        />
        <span className="fx-image-expand" aria-hidden="true"><ExpandIcon /></span>
      </a>
      {caption && <figcaption className="fx-caption">{caption}</figcaption>}
    </figure>
  );
}

export function HorizontalGallery({ label, children }: { label: string; children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const helpId = useId();
  const [controls, setControls] = useState({ previous: false, next: false });

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const previous = track.scrollLeft > 2;
    const next = track.scrollLeft + track.clientWidth < track.scrollWidth - 2;
    setControls((current) => current.previous === previous && current.next === next ? current : { previous, next });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const frame = window.requestAnimationFrame(updateControls);
    const observer = "ResizeObserver" in window ? new ResizeObserver(updateControls) : null;
    observer?.observe(track);
    Array.from(track.children).forEach((child) => observer?.observe(child));
    window.addEventListener("resize", updateControls);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", updateControls);
    };
  }, [updateControls]);

  const move = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.78, 260),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <div className="fx-gallery">
      <div className="fx-gallery-toolbar">
        <p className="fx-gallery-help" id={helpId}>Explore the reporting flow</p>
        <div className="fx-gallery-controls">
          <button className="fx-gallery-arrow" type="button" onClick={() => move(-1)} disabled={!controls.previous} aria-label={"Previous images: " + label} aria-controls={trackId}>
            <ArrowIcon direction="previous" />
          </button>
          <button className="fx-gallery-arrow" type="button" onClick={() => move(1)} disabled={!controls.next} aria-label={"Next images: " + label} aria-controls={trackId}>
            <ArrowIcon direction="next" />
          </button>
        </div>
      </div>
      <div
        className="fx-gallery-track"
        ref={trackRef}
        id={trackId}
        role="region"
        aria-label={label}
        aria-describedby={helpId}
        tabIndex={0}
        onScroll={updateControls}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
