"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

export type StoryNavigationItem = { id: string; label: string };

export const fixlensStorySections: readonly StoryNavigationItem[] = [
  { id: "challenge", label: "Challenge" },
  { id: "research", label: "Research" },
  { id: "exploration", label: "Sketches" },
  { id: "evolution", label: "Design" },
  { id: "solution", label: "Solution" },
  { id: "evaluation", label: "Evaluation" },
  { id: "iteration", label: "Iteration" },
];

export type StoryNavigationProps = {
  items?: readonly StoryNavigationItem[];
  headerSelector?: string;
  className?: string;
};

type Navigate = (id: string, keyboard: boolean) => void;

/** In-page links remain useful before hydration and retain normal browser link gestures. */
export default function StoryNavigation({
  items = fixlensStorySections,
  headerSelector = ".site-header",
  className = "",
}: StoryNavigationProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const navigateRef = useRef<Navigate | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const sections = items.flatMap(({ id }) => {
      const element = document.getElementById(id);
      return element ? [{ id, element }] : [];
    });
    if (!sections.length) return;

    const headers = Array.from(document.querySelectorAll<HTMLElement>(headerSelector));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let refreshFrame = 0;
    let navigationFrame = 0;
    let arrivalTimer = 0;
    let navigating = false;
    let pendingNavigation: { section: HTMLElement; keyboard: boolean } | null = null;
    let arrivalOffset = 120;
    let arrivedSection: HTMLElement | null = null;
    let restoreHeadingFocus: (() => void) | null = null;

    const clearArrival = () => {
      window.clearTimeout(arrivalTimer);
      arrivedSection?.classList.remove("fx-story-arrived");
      arrivedSection = null;
    };

    const sectionContent = (section: HTMLElement) =>
      section.querySelector<HTMLElement>(".fx-section-heading") ?? section;

    const documentTop = (element: HTMLElement) => {
      // Section entrances transform headings. Layout offsets keep anchor targets stable.
      let top = 0;
      let node: HTMLElement | null = element;
      while (node) {
        top += node.offsetTop;
        const parent: Element | null = node.offsetParent;
        if (!(parent instanceof HTMLElement)) break;
        top += parent.clientTop;
        node = parent;
      }
      return top;
    };

    const updateActive = () => {
      if (navigating) return;
      const line = Math.min(window.innerHeight - 2, arrivalOffset + 12);
      let current = sections[0].id;
      for (const section of sections) {
        if (section.element.getBoundingClientRect().top <= line) current = section.id;
        else break;
      }
      setActive(current);
    };

    const fixedHeaderInset = () => headers.reduce((inset, header) => {
      const style = window.getComputedStyle(header);
      if (style.display === "none" || style.visibility === "hidden") return inset;
      const box = header.getBoundingClientRect();
      if (style.position === "fixed") return Math.max(inset, box.bottom, 0);
      if (style.position === "sticky") {
        // Reserve the sticky header's eventual resting position even before it sticks.
        return Math.max(inset, Math.max(0, Number.parseFloat(style.top) || 0) + box.height);
      }
      return inset;
    }, 0);

    const refresh = () => {
      const headerInset = Math.ceil(fixedHeaderInset());
      nav.style.setProperty("--fx-story-header-offset", headerInset + 12 + "px");
      arrivalOffset = Math.ceil(headerInset + 12 + nav.getBoundingClientRect().height + 24);
      observer?.disconnect();
      if ("IntersectionObserver" in window) {
        const line = Math.max(0, Math.min(window.innerHeight - 2, arrivalOffset + 12));
        observer = new IntersectionObserver(updateActive, {
          // A narrow reading band works for very tall sections as well as short ones.
          rootMargin: "-" + line + "px 0px -" + Math.max(0, window.innerHeight - line - 2) + "px 0px",
          threshold: 0,
        });
        sections.forEach(({ element }) => observer?.observe(element));
      }
      updateActive();
    };

    const scheduleRefresh = () => {
      if (refreshFrame) return;
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = 0;
        refresh();
      });
    };

    const focusDestination = (section: HTMLElement) => {
      restoreHeadingFocus?.();
      const heading = section.querySelector<HTMLElement>("h2, h3") ?? section;
      const previous = heading.getAttribute("tabindex");
      heading.setAttribute("tabindex", "-1");
      const restore = () => {
        if (previous === null) heading.removeAttribute("tabindex");
        else heading.setAttribute("tabindex", previous);
        heading.removeEventListener("blur", restore);
        restoreHeadingFocus = null;
      };
      restoreHeadingFocus = restore;
      heading.addEventListener("blur", restore, { once: true });
      heading.focus({ preventScroll: true });
    };

    const arrive = (section: HTMLElement, keyboard: boolean) => {
      navigating = false;
      pendingNavigation = null;
      navigationFrame = 0;
      updateActive();
      if (keyboard) focusDestination(section);
      if (reducedMotion.matches) return;
      clearArrival();
      arrivedSection = section;
      section.classList.add("fx-story-arrived");
      arrivalTimer = window.setTimeout(clearArrival, 720);
    };

    const stopNavigation = () => {
      if (!navigating) return;
      navigating = false;
      pendingNavigation = null;
      window.cancelAnimationFrame(navigationFrame);
      navigationFrame = 0;
      // Stop the browser's in-flight smooth scroll as well as our arrival monitor.
      window.scrollTo({ top: window.scrollY, behavior: "instant" });
      updateActive();
    };

    const navigate = (id: string, keyboard: boolean, behavior: ScrollBehavior, writeHash: boolean) => {
      const target = sections.find(section => section.id === id);
      if (!target) return;
      stopNavigation();
      clearArrival();
      refresh();
      const content = sectionContent(target.element);
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const top = Math.min(maxScroll, Math.max(0, documentTop(content) - arrivalOffset));
      if (writeHash) {
        const url = new URL(window.location.href);
        url.hash = id;
        if (url.hash !== window.location.hash) window.history.pushState(window.history.state, "", url);
      }
      setActive(id);
      navigating = true;
      pendingNavigation = { section: target.element, keyboard };
      window.scrollTo({ top, behavior });
      if (behavior !== "smooth") {
        arrive(target.element, keyboard);
        return;
      }

      // This bounded RAF runs only during a requested navigation; normal scrolling uses IO.
      const started = performance.now();
      let lastY = window.scrollY;
      let stableFrames = 0;
      const settle = () => {
        const y = window.scrollY;
        stableFrames = Math.abs(y - lastY) < 0.5 ? stableFrames + 1 : 0;
        lastY = y;
        const reached = Math.abs(y - top) < 2;
        const timedOut = performance.now() - started > 1800;
        if ((reached && stableFrames >= 2) || timedOut || (stableFrames > 10 && performance.now() - started > 250)) {
          const contentTop = documentTop(content) - window.scrollY;
          if (reached || (contentTop >= 0 && contentTop < window.innerHeight * .7)) arrive(target.element, keyboard);
          else stopNavigation();
          return;
        }
        navigationFrame = window.requestAnimationFrame(settle);
      };
      navigationFrame = window.requestAnimationFrame(settle);
    };

    navigateRef.current = (id, keyboard) => navigate(id, keyboard, reducedMotion.matches ? "instant" : "smooth", true);

    const navigateHash = () => {
      // Back to the un-hashed page must also cancel a previously requested scroll.
      stopNavigation();
      let id = "";
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      if (sections.some(section => section.id === id)) navigate(id, false, "instant", false);
    };

    const handleMotionPreference = () => {
      if (!reducedMotion.matches) return;
      clearArrival();
      const pending = pendingNavigation;
      if (pending) {
        window.cancelAnimationFrame(navigationFrame);
        navigationFrame = 0;
        refresh();
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const content = sectionContent(pending.section);
        const top = Math.min(maxScroll, Math.max(0, documentTop(content) - arrivalOffset));
        window.scrollTo({ top, behavior: "instant" });
        arrive(pending.section, pending.keyboard);
      }
      const list = listRef.current;
      if (list) list.scrollTo({ left: list.scrollLeft, behavior: "instant" });
    };

    const cancelForKey = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"].includes(event.key)) stopNavigation();
    };
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(scheduleRefresh) : undefined;
    resizeObserver?.observe(nav);
    headers.forEach(header => resizeObserver?.observe(header));
    const headerObserver = new MutationObserver(scheduleRefresh);
    headers.forEach(header => headerObserver.observe(header, { attributes: true, attributeFilter: ["style", "class"] }));
    window.addEventListener("resize", scheduleRefresh, { passive: true });
    window.addEventListener("hashchange", navigateHash);
    window.addEventListener("popstate", stopNavigation);
    window.addEventListener("wheel", stopNavigation, { passive: true });
    window.addEventListener("touchstart", stopNavigation, { passive: true });
    window.addEventListener("keydown", cancelForKey);
    reducedMotion.addEventListener("change", handleMotionPreference);
    refresh();
    const initialHashFrame = window.requestAnimationFrame(navigateHash);

    return () => {
      navigateRef.current = null;
      window.cancelAnimationFrame(initialHashFrame);
      window.cancelAnimationFrame(refreshFrame);
      window.cancelAnimationFrame(navigationFrame);
      clearArrival();
      restoreHeadingFocus?.();
      observer?.disconnect();
      resizeObserver?.disconnect();
      headerObserver.disconnect();
      nav.style.removeProperty("--fx-story-header-offset");
      window.removeEventListener("resize", scheduleRefresh);
      window.removeEventListener("hashchange", navigateHash);
      window.removeEventListener("popstate", stopNavigation);
      window.removeEventListener("wheel", stopNavigation);
      window.removeEventListener("touchstart", stopNavigation);
      window.removeEventListener("keydown", cancelForKey);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, [items, headerSelector]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const link = Array.from(list.querySelectorAll<HTMLAnchorElement>("a")).find(item => item.dataset.section === active);
    if (!link) return;
    const rail = list.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    if (box.left < rail.left + 8 || box.right > rail.right - 8) {
      const left = list.scrollLeft + box.left - rail.left - (rail.width - box.width) / 2;
      list.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }, [active]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!navigateRef.current || !document.getElementById(id)) return;
    event.preventDefault();
    navigateRef.current(id, event.detail === 0);
  };

  return (
    <nav ref={navRef} className={"fx-story-nav " + className} aria-label="Case study sections">
      <ol ref={listRef} className="fx-story-nav-list">
        {items.map(({ id, label }) => (
          <li key={id} className="fx-story-nav-item" data-active={active === id}>
            <a className="fx-story-nav-link" href={"#" + id} data-section={id} aria-current={active === id ? "location" : undefined} onClick={event => handleClick(event, id)}>
              <span>{label}</span>
              <svg className="fx-story-nav-arrow" aria-hidden="true" width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3.5 12.5 12 4m-7.5 0H12v7.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
