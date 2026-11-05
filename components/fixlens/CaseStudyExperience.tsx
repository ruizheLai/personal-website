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

/** Enhancements are opt-in: server-rendered content stays visible without JS. */
export function CaseStudyExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const selector = "[data-fx-motion], [data-fx-reveal]";
    const targets = new Set<HTMLElement>();
    const staggerStyles = new Map<HTMLElement, { value: string; priority: string }>();
    let observer: IntersectionObserver | null = null;
    let disposed = false;

    const reveal = (target: HTMLElement) => {
      target.classList.add("fx-revealed");
      observer?.unobserve(target);
    };

    const prepareStagger = (target: HTMLElement) => {
      if (target.dataset.fxMotion !== "comparison" && target.dataset.fxMotion !== "research") return;
      // Explicit direct children keep image rotations, layout wrappers and nested groups independent.
      Array.from(target.children).forEach((child, index) => {
        if (!(child instanceof HTMLElement) || !child.hasAttribute("data-fx-motion-item")) return;
        if (!staggerStyles.has(child)) {
          staggerStyles.set(child, {
            value: child.style.getPropertyValue("--fx-motion-delay"),
            priority: child.style.getPropertyPriority("--fx-motion-delay"),
          });
        }
        child.style.setProperty("--fx-motion-delay", Math.min(index, 3) * 90 + "ms");
      });
    };

    const register = (target: HTMLElement) => {
      prepareStagger(target);
      if (targets.has(target)) return;
      targets.add(target);
      if (preference.matches) reveal(target);
      else if (!target.classList.contains("fx-revealed")) observer?.observe(target);
    };

    const configure = () => {
      observer?.disconnect();
      observer = null;
      root.classList.remove("fx-motion-ready");

      // Complete rather than replay if the preference changes during a reveal.
      if (preference.matches) {
        targets.forEach(reveal);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (disposed || preference.matches) return;
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            reveal(entry.target as HTMLElement);
          });
        },
        { threshold: 0.04, rootMargin: "0px 0px -24px 0px" },
      );
      targets.forEach((target) => {
        if (!target.classList.contains("fx-revealed")) observer?.observe(target);
      });
      root.classList.add("fx-motion-ready");
    };

    root.querySelectorAll<HTMLElement>(selector).forEach(register);
    configure();

    // A keyboard user must never focus an invisible control in a pending composition.
    const onFocus = (event: FocusEvent) => {
      let node = event.target instanceof HTMLElement ? event.target : null;
      while (node && node !== root) {
        if (targets.has(node)) reveal(node);
        node = node.parentElement;
      }
    };
    root.addEventListener("focusin", onFocus);

    // Supports content mounted inside existing disclosure/gallery compositions.
    const mutations = "MutationObserver" in window ? new MutationObserver((records) => {
      if (disposed) return;
      records.forEach((record) => {
        if (record.target instanceof HTMLElement && targets.has(record.target)) prepareStagger(record.target);
        record.removedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          [node, ...Array.from(node.querySelectorAll<HTMLElement>(selector))].forEach((target) => {
            if (root.contains(target)) return;
            observer?.unobserve(target);
            targets.delete(target);
          });
        });
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(selector)) register(node);
          node.querySelectorAll<HTMLElement>(selector).forEach(register);
        });
      });
    }) : null;
    mutations?.observe(root, { childList: true, subtree: true });
    preference.addEventListener("change", configure);
    return () => {
      disposed = true;
      observer?.disconnect();
      mutations?.disconnect();
      preference.removeEventListener("change", configure);
      root.removeEventListener("focusin", onFocus);
      root.classList.remove("fx-motion-ready");
      staggerStyles.forEach(({ value, priority }, target) => {
        if (value) target.style.setProperty("--fx-motion-delay", value, priority);
        else target.style.removeProperty("--fx-motion-delay");
      });
      targets.clear();
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
          style={{ aspectRatio: asset.width + " / " + asset.height }}
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
