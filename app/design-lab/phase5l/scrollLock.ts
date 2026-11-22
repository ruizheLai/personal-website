const keys = new Set([" ", "Spacebar", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
const quietGap = 160;

export function createScrollLock(finish: () => void) {
  const html = document.documentElement;
  const events = new AbortController();
  const { signal } = events;
  let locked = false;
  let draining = false;
  let lastWheel = -Infinity;
  let touchActive = false;
  let discardTouch = false;

  function prevent(event: Event) {
    if (event.cancelable) event.preventDefault();
  }

  window.addEventListener("wheel", event => {
    if (event.ctrlKey || event.metaKey) return;
    const gap = event.timeStamp - lastWheel;
    lastWheel = event.timeStamp;
    if (locked || draining && gap < quietGap) prevent(event);
    else draining = false;
  }, { signal, capture: true, passive: false });

  window.addEventListener("touchstart", () => {
    touchActive = true;
    discardTouch = locked;
    if (!locked) draining = false;
  }, { signal, capture: true, passive: true });
  window.addEventListener("touchmove", event => {
    if (locked || discardTouch) prevent(event);
  }, { signal, capture: true, passive: false });
  for (const type of ["touchend", "touchcancel"]) window.addEventListener(type, event => {
    if (!(event as TouchEvent).touches.length) {
      touchActive = false;
      discardTouch = false;
    }
  }, { signal, capture: true, passive: true });

  window.addEventListener("pointerdown", () => { if (!locked) draining = false; }, { signal, capture: true });
  window.addEventListener("keydown", event => {
    if (locked && event.key === "Escape") {
      prevent(event);
      finish();
      return;
    }
    if (!keys.has(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("button, a, input, select, textarea, [contenteditable]")) return;
    if (locked || draining && event.repeat) prevent(event);
    else draining = false;
  }, { signal, capture: true });

  return {
    lock() {
      locked = true;
      draining = false;
      discardTouch ||= touchActive;
      html.setAttribute("data-pl-locked", "");
    },
    unlock(drain = true) {
      if (locked && drain) draining = true;
      if (!drain) {
        draining = false;
        discardTouch = false;
      }
      locked = false;
      html.removeAttribute("data-pl-locked");
    },
    get locked() { return locked; },
    destroy() {
      events.abort();
      html.removeAttribute("data-pl-locked");
    },
  };
}
