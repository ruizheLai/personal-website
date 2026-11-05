"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { CaseStudyAsset } from "./CaseStudyExperience";

type Selection = { asset: CaseStudyAsset; caption?: string; opener: HTMLElement };
type Corner = { x: number; y: number };
type Origin = { x: number; y: number; width: number; angle: number; sourceWidth: number; sourceHeight: number; radii: Corner[]; clipPath: string };
type ZoomSelection = Selection & { origin: Origin };
const ZoomContext = createContext<((selection: Selection) => void) | null>(null);
export const useImageZoom = () => useContext(ZoomContext);

function originFor(opener: HTMLElement): Origin | null {
  const source = opener.querySelector("img");
  if (!source || !source.isConnected || source.clientWidth === 0) return null;
  const rect = source.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  let matrix = new DOMMatrix();
  let node: Element | null = source;
  while (node && node !== document.body) {
    const transform = getComputedStyle(node).transform;
    if (transform && transform !== "none") {
      matrix = new DOMMatrix(transform).multiply(matrix);
    }
    node = node.parentElement;
  }
  const scale = Math.min(Math.hypot(matrix.a, matrix.b), Math.hypot(matrix.c, matrix.d)) || 1;
  const imageStyle = getComputedStyle(source);
  const linkStyle = getComputedStyle(opener);
  const corner = (value: string, width: number, height: number): Corner => {
    const values = value.trim().split(/\s+/);
    const length = (token: string, dimension: number) => token.includes("%") ? (parseFloat(token) || 0) / 100 * dimension : parseFloat(token) || 0;
    return { x: length(values[0], width), y: length(values[1] || values[0], height) };
  };
  const imageWidth = source.clientWidth;
  const imageHeight = source.clientHeight;
  const names = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"] as const;
  const borders = [
    { x: parseFloat(linkStyle.borderLeftWidth) || 0, y: parseFloat(linkStyle.borderTopWidth) || 0 },
    { x: parseFloat(linkStyle.borderRightWidth) || 0, y: parseFloat(linkStyle.borderTopWidth) || 0 },
    { x: parseFloat(linkStyle.borderRightWidth) || 0, y: parseFloat(linkStyle.borderBottomWidth) || 0 },
    { x: parseFloat(linkStyle.borderLeftWidth) || 0, y: parseFloat(linkStyle.borderBottomWidth) || 0 },
  ];
  const radii = names.map((name, index) => {
    const own = corner(imageStyle[name], imageWidth, imageHeight);
    if (own.x || own.y) return own;
    // Preserve each effective clip corner; source percentages have separate x/y bases.
    const parent = corner(linkStyle[name], opener.offsetWidth, opener.offsetHeight);
    return { x: Math.max(0, parent.x - borders[index].x), y: Math.max(0, parent.y - borders[index].y) };
  });
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width: source.clientWidth * scale,
    angle: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI,
    sourceWidth: imageWidth,
    sourceHeight: imageHeight,
    radii,
    clipPath: imageStyle.clipPath !== "none" ? imageStyle.clipPath : linkStyle.clipPath,
  };
}

function borderRadiusFor(origin: Origin, target: DOMRect) {
  const horizontal = origin.radii.map((radius) => radius.x / origin.sourceWidth * target.width + "px").join(" ");
  const vertical = origin.radii.map((radius) => radius.y / origin.sourceHeight * target.height + "px").join(" ");
  return horizontal + " / " + vertical;
}

function flip(origin: Origin, target: DOMRect) {
  return `translate(${origin.x - target.left - target.width / 2}px, ${origin.y - target.top - target.height / 2}px) rotate(${origin.angle}deg) scale(${origin.width / target.width})`;
}

/** One unframed image, moving from and returning to its actual source geometry. */
export function ImageZoomProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ZoomSelection | null>(null);
  const [phase, setPhase] = useState("closed");
  const phaseRef = useRef("closed");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const titleId = useId();
  const captionId = useId();

  const finishClose = useCallback(() => {
    animationRef.current?.cancel();
    animationRef.current = null;
    phaseRef.current = "closed";
    setPhase("closed");
    if (dialogRef.current?.open) dialogRef.current.close();
    setSelected(null);
  }, []);

  const close = useCallback(() => {
    if (!selected || phaseRef.current === "closing") return;
    const image = imageRef.current;
    const destination = originFor(selected.opener);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const currentTransform = image ? getComputedStyle(image).transform : "none";
    animationRef.current?.cancel();
    phaseRef.current = "closing";
    setPhase("closing");
    if (!image || !destination || reduced || typeof image.animate !== "function") {
      finishClose();
      return;
    }
    const target = image.getBoundingClientRect();
    const animation = image.animate(
      [{ transform: currentTransform, opacity: 1 }, { transform: flip(destination, target), opacity: 1 }],
      { duration: 350, easing: "cubic-bezier(.22,.7,.2,1)", fill: "forwards" },
    );
    animationRef.current = animation;
    animation.finished.then(() => {
      if (animationRef.current === animation && phaseRef.current === "closing") finishClose();
    }).catch(() => {});
  }, [selected, finishClose]);

  useLayoutEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current;
    const image = imageRef.current;
    if (!dialog || !image) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const previousVisibility = selected.opener.style.visibility;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = padding + scrollbar + "px";
    if (!dialog.open) dialog.showModal();
    const target = image.getBoundingClientRect();
    image.style.borderRadius = borderRadiusFor(selected.origin, target);
    image.style.clipPath = selected.origin.clipPath;
    selected.opener.style.visibility = "hidden";
    phaseRef.current = "opening";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!preference.matches && typeof image.animate === "function") {
      const animation = image.animate(
        [{ transform: flip(selected.origin, target), opacity: 1 }, { transform: "none", opacity: 1 }],
        { duration: 430, easing: "cubic-bezier(.22,.7,.2,1)", fill: "both" },
      );
      animationRef.current = animation;
      animation.finished.then(() => {
        if (animationRef.current === animation && phaseRef.current === "opening") {
          animation.cancel();
          animationRef.current = null;
          phaseRef.current = "open";
          setPhase("open");
        }
      }).catch(() => {});
    } else {
      phaseRef.current = "open";
      setPhase("open");
    }
    closeRef.current?.focus({ preventScroll: true });

    const settle = () => {
      if (phaseRef.current === "closing") {
        finishClose();
      } else {
        animationRef.current?.cancel();
        animationRef.current = null;
        phaseRef.current = "open";
        setPhase("open");
        const destination = originFor(selected.opener) || selected.origin;
        image.style.borderRadius = borderRadiusFor(destination, image.getBoundingClientRect());
      }
    };
    const motionChanged = () => { if (preference.matches) settle(); };
    window.addEventListener("resize", settle);
    preference.addEventListener("change", motionChanged);
    return () => {
      animationRef.current?.cancel();
      animationRef.current = null;
      window.removeEventListener("resize", settle);
      preference.removeEventListener("change", motionChanged);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      selected.opener.style.visibility = previousVisibility;
      if (selected.opener.isConnected) selected.opener.focus({ preventScroll: true });
    };
  }, [selected, finishClose]);

  useEffect(() => () => { animationRef.current?.cancel(); }, []);

  const open = useCallback((selection: Selection) => {
    const origin = originFor(selection.opener);
    if (!origin || typeof dialogRef.current?.showModal !== "function") {
      window.location.assign(selection.asset.src);
      return;
    }
    phaseRef.current = "opening";
    setPhase("opening");
    setSelected({ ...selection, origin });
  }, []);

  const style = selected ? {
    "--fx-zoom-ratio": selected.asset.width / selected.asset.height,
    "--fx-zoom-native": selected.asset.width * 1.6 + "px",
  } as CSSProperties : undefined;

  return <ZoomContext.Provider value={open}>
    {children}
    <dialog ref={dialogRef} className="fx-zoom-dialog" data-phase={phase} aria-labelledby={titleId}
      aria-describedby={selected?.caption ? captionId : undefined}
      onKeyDown={(event) => {
        // The close control is the only focusable element in this unframed viewer.
        // Keep Tab in the viewer instead of letting the browser focus its chrome.
        if (event.key === "Tab") {
          event.preventDefault();
          closeRef.current?.focus({ preventScroll: true });
        }
      }}
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      onClose={() => { if (phaseRef.current !== "closed") finishClose(); }}>
      <h2 className="sr-only" id={titleId}>{selected?.asset.title || "Enlarged project image"}</h2>
      {selected && <Image ref={imageRef} className="fx-zoom-image" src={selected.asset.src} width={selected.asset.width} height={selected.asset.height} alt={selected.asset.alt} unoptimized loading="eager" style={style} />}
      <button ref={closeRef} className="fx-zoom-close" type="button" aria-label="Close enlarged image" onClick={close}>
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
      {selected?.caption && <p className="sr-only" id={captionId}>{selected.caption}</p>}
    </dialog>
  </ZoomContext.Provider>;
}
