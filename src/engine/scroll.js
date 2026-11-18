import { clamp } from "./line/geometry.js";

/** In-page link targets: a chapter starts at its own edge; anything else is shown with a little room. */
const EDGE_ROOM = { sideways: 24, downwards: 12 };

/**
 * Moving through the site. Sideways, the mouse wheel and the keyboard glide the track
 * (trackpads scroll it natively). Downwards, on phones, the page scrolls natively.
 * In-page links (#about, #journey, #privacy…) travel to their target from anywhere.
 */
export function createScroller(track, { isStack, reduced, privacy }) {
  const doc = document.documentElement;
  let target = 0, gliding = false, frame = 0;

  const pos = () => Math.max(0, isStack() ? window.scrollY : track.scrollLeft); // never negative: phones bounce past the top
  const view = () => (isStack() ? window.innerHeight : window.innerWidth);
  const max = () => (isStack() ? Math.max(0, doc.scrollHeight - window.innerHeight) : track.scrollWidth - track.clientWidth);
  const sync = () => { target = pos(); };

  function glide() {
    const gap = target - track.scrollLeft;
    if (Math.abs(gap) < 0.6) {
      track.scrollLeft = target;
      gliding = false;
      return;
    }
    track.scrollLeft += gap * 0.12;
    frame = requestAnimationFrame(glide);
  }

  function stop() {
    gliding = false;
    cancelAnimationFrame(frame);
  }

  function glideTo(v) {
    target = clamp(v, 0, max());
    if (isStack()) window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
    else if (reduced) track.scrollLeft = target;
    else if (!gliding) {
      gliding = true;
      frame = requestAnimationFrame(glide);
    }
  }

  function goTo(id, instant = false) {
    if (id === "privacy") {
      if (!privacy.open) privacy.showModal();
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const isChapter = el.classList.contains("chapter");
    const anchor = isChapter ? el : el.closest(".block") || el;
    const v = isStack()
      ? el.getBoundingClientRect().top + window.scrollY - document.querySelector(".bar").offsetHeight - (isChapter ? 0 : EDGE_ROOM.downwards)
      : isChapter ? el.offsetLeft : anchor.getBoundingClientRect().left + track.scrollLeft - EDGE_ROOM.sideways;
    if (instant) {
      stop();
      target = clamp(v, 0, max());
      if (isStack()) window.scrollTo(0, target);
      else track.scrollLeft = target;
    } else glideTo(v);
    history.replaceState(null, "", `#${id}`);
    const heading = el.querySelector("h1, h2, h3") || el;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  function onWheel(e) {
    if (isStack() || e.ctrlKey) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      stop(); // trackpads already scroll sideways
      return;
    }
    e.preventDefault();
    if (!gliding) target = track.scrollLeft;
    const unit = e.deltaMode === 1 ? 36 : e.deltaMode === 2 ? window.innerWidth : 1;
    glideTo(target + e.deltaY * unit * 1.5);
  }

  function onKey(e) {
    if (isStack() || e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.target instanceof Element && e.target.closest("input, textarea, select, button, dialog")) return;
    const step = window.innerWidth * 0.75, from = gliding ? target : track.scrollLeft;
    const moves = { ArrowRight: from + step, ArrowDown: from + step, PageDown: from + step, ArrowLeft: from - step, ArrowUp: from - step, PageUp: from - step, Home: 0, End: max(), " ": from + (e.shiftKey ? -step : step) };
    if (!(e.key in moves)) return;
    e.preventDefault();
    glideTo(moves[e.key]);
  }

  function onClick(e) {
    const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    const id = link?.getAttribute("href").slice(1);
    if (!id) return;
    e.preventDefault();
    if (privacy.open && id !== "privacy") privacy.close();
    goTo(id);
  }

  function onScroll() {
    if (!gliding) sync();
  }

  function onHashChange() {
    const id = window.location.hash.slice(1);
    if (id) goTo(id);
  }

  track.addEventListener("wheel", onWheel, { passive: false });
  track.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKey);
  window.addEventListener("hashchange", onHashChange);
  document.addEventListener("click", onClick);

  return {
    pos, view, max, sync, goTo,
    destroy() {
      stop();
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    },
  };
}
