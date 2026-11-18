import { applyMode, isStack } from "./mode.js";
import { fitBlocks } from "./fit.js";
import { revealOnView } from "./reveal.js";
import { createScroller } from "./scroll.js";
import { buildLine } from "./line/build.js";
import { drawTo, lengthAt } from "./line/pen.js";
import { clamp, smooth } from "./line/geometry.js";

const INTRO_DELAY = 500; // ms before the pen starts drawing the logo
const INTRO_TIME = 3400; // ms the opening drawing takes
const HINT_DELAY = 3600; // ms before "Follow the line" appears, if the reader hasn't moved

/**
 * Brings the page to life: lays it out to fit the screen, draws the one continuous line and
 * keeps its pen just ahead of the reader (forwards and backwards), and reports which page is
 * in view. Returns a function that undoes all of it.
 */
export function createEngine(track, { privacy, onActive, onNight }) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const chapters = [...track.querySelectorAll(".chapter")];
  const blocks = [...track.querySelectorAll(".block")];
  const titles = [...track.querySelectorAll("[data-drift]")];
  const nib = track.querySelector(".thread .nib"), halo = track.querySelector(".thread .halo");
  const hint = track.querySelector(".hint");

  let stack = applyMode();
  const scroller = createScroller(track, { isStack: () => stack, reduced, privacy });
  const stopReveals = revealOnView(track);
  const introStart = performance.now() + INTRO_DELAY;
  let line = null, drawn = 0, active = -1, night = null;
  let frame = 0, resizeTimer = 0, hintTimer = 0, alive = true;
  let lastWidth = window.innerWidth, lastStack = stack;

  function layout() {
    stack = applyMode();
    for (const title of titles) title.style.transform = "";
    fitBlocks(blocks, stack);
    line = buildLine(track, stack);
  }

  /** Where the pen should be: a little ahead of the reader; on arrival, sweeping across the logo. */
  function lead(now) {
    const v = scroller.view(), p = scroller.pos(), m = scroller.max();
    const nearEnd = smooth((p - (m - v * 0.6)) / (v * 0.6)) * (stack ? 0.4 : 0.5);
    let ahead = v * ((stack ? 0.74 : 0.62) + nearEnd);
    if (!reduced && now !== undefined && now < introStart + INTRO_TIME && p < 10) {
      const from = line.keys[0] - p;
      ahead = from + (ahead - from) * smooth((now - introStart) / INTRO_TIME);
    }
    return p + ahead;
  }

  /**
   * Which page is in view, and whether the page sequence sits over the night page.
   * The position is clamped: a phone's bounce at either end reads beyond the page.
   */
  function report() {
    const v = scroller.view(), m = scroller.max(), p = clamp(scroller.pos(), 0, m), last = chapters.length - 1;
    const starts = chapters.map((ch) => clamp((stack ? ch.offsetTop : ch.offsetLeft) - v * 0.4, 0, m));
    const page = p >= m - 2 ? last : clamp(starts.filter((s) => p >= s - 1).length - 1, 0, last);
    if (page !== active) {
      active = page;
      onActive(page);
    }
    const middle = p + window.innerWidth / 2;
    const under = stack ? null : chapters.filter((ch) => middle >= ch.offsetLeft).pop();
    const isNight = !!under?.classList.contains("chapter--night");
    if (isNight !== night) {
      night = isNight;
      onNight(isNight);
    }
  }

  /** Page titles drift gently against the scroll. */
  function drift() {
    for (const title of titles) {
      const r = title.parentElement.getBoundingClientRect(), off = r.left + r.width / 2 - window.innerWidth / 2;
      if (Math.abs(off) < window.innerWidth * 1.5) title.style.transform = `translate3d(${(-off * 0.06).toFixed(1)}px,0,0)`;
    }
  }

  function tick(now) {
    const goal = reduced ? lengthAt(line, lead()) : now < introStart && scroller.pos() < 10 ? 0 : lengthAt(line, lead(now));
    const gap = goal - drawn;
    if (reduced || Math.abs(gap) < 0.5) drawn = goal;
    else drawn += gap * (gap > 0 ? 0.085 : 0.15) + Math.sign(gap) * Math.min(Math.abs(gap), 1.2);
    drawTo(line, drawn, nib, halo);
    report();
    if (!reduced && !stack) drift();
    frame = requestAnimationFrame(tick);
  }

  function onResize() {
    // On phones, the address bar showing or hiding changes only the height: nothing to redo.
    if (isStack() && lastStack && window.innerWidth === lastWidth) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const switched = isStack() !== lastStack, page = chapters[Math.max(0, active)];
      layout();
      lastStack = stack;
      lastWidth = window.innerWidth;
      if (switched) scroller.goTo(page.id, true);
      else scroller.sync();
      drawn = lengthAt(line, lead());
      drawTo(line, drawn, nib, halo);
    }, 160);
  }

  function onScroll() {
    if (scroller.pos() > 40) hint?.classList.remove("on");
  }

  whenReady(track).then(() => {
    if (!alive) return;
    layout();
    const id = window.location.hash.slice(1);
    if (id) scroller.goTo(id, true);
    if (scroller.pos() > 10) drawn = lengthAt(line, lead());
    frame = requestAnimationFrame(tick);
    if (!stack && hint) {
      hintTimer = setTimeout(() => {
        if (scroller.pos() < 40) hint.classList.add("on");
      }, reduced ? 0 : HINT_DELAY);
    }
  });

  window.addEventListener("resize", onResize);
  track.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
    clearTimeout(resizeTimer);
    clearTimeout(hintTimer);
    window.removeEventListener("resize", onResize);
    track.removeEventListener("scroll", onScroll);
    window.removeEventListener("scroll", onScroll);
    scroller.destroy();
    stopReveals();
  };
}

/** The layout depends on the fonts and the portrait, so wait for both before measuring. */
function whenReady(track) {
  const img = track.querySelector(".portrait img");
  const portrait = !img || img.complete ? null : new Promise((done) => {
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
  return Promise.all([document.fonts.ready, portrait]);
}
