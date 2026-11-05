"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
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

type LightboxSelection = {
  asset: CaseStudyAsset;
  caption?: string;
  opener: HTMLElement;
};

type OpenLightbox = (selection: LightboxSelection) => void;
const LightboxContext = createContext<OpenLightbox | null>(null);

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState<LightboxSelection | null>(null);
  const titleId = useId();
  const captionId = useId();

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

  useEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const existingPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = existingPadding + scrollbarWidth + "px";
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      if (selected.opener.isConnected) selected.opener.focus({ preventScroll: true });
    };
  }, [selected]);

  const openLightbox = useCallback<OpenLightbox>((selection) => {
    // The image link still has a direct-file fallback in browsers without native modal support.
    if (typeof dialogRef.current?.showModal !== "function") {
      window.location.assign(selection.asset.src);
      return;
    }
    setSelected(selection);
  }, []);

  const closeLightbox = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    else setSelected(null);
  }, []);

  const handleBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeLightbox();
  };

  return (
    <LightboxContext.Provider value={openLightbox}>
      <div className="fx-experience" ref={rootRef}>
        {children}
        <dialog
          className="fx-lightbox"
          ref={dialogRef}
          aria-labelledby={titleId}
          aria-describedby={selected?.caption ? captionId : undefined}
          onClick={handleBackdrop}
          onClose={() => setSelected(null)}
        >
          <div className="fx-lightbox-content">
            <div className="fx-lightbox-header">
              <p className="fx-lightbox-title" id={titleId}>
                {selected?.asset.title || "Project image"}
              </p>
              <button className="fx-lightbox-close" ref={closeRef} type="button" onClick={closeLightbox} aria-label="Close enlarged image">
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
                <span>Close</span>
              </button>
            </div>
            {selected && (
              <Image
                className="fx-lightbox-image"
                src={selected.asset.src}
                width={selected.asset.width}
                height={selected.asset.height}
                alt={selected.asset.alt}
                unoptimized
                loading="eager"
              />
            )}
            {selected?.caption && <p className="fx-lightbox-caption" id={captionId}>{selected.caption}</p>}
          </div>
        </dialog>
      </div>
    </LightboxContext.Provider>
  );
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
  const open = useContext(LightboxContext);

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
          preload={priority}
          loading={priority ? undefined : "lazy"}
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
        <p className="fx-gallery-help" id={helpId}>Scroll to explore. Select any image to enlarge.</p>
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
