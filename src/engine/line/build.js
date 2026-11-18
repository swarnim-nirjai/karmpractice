import { GLYPHS } from "./glyphs.js";
import { downwardsConnector, sidewaysConnector } from "./connectors.js";
import { clamp, pathData, round1 } from "./geometry.js";

const SVG = "http://www.w3.org/2000/svg";

/**
 * Builds the one continuous line for the current layout. It visits every place the line
 * draws ([data-art], in page order), joins them with connectors, splits the result into
 * one path per page so each can take its page's colour, and places the pins and notes.
 *
 * Returns what the pen needs: the line's points with the length reached at each, and a
 * table from the reader's position (x sideways, y downwards) to the length to draw.
 */
export function buildLine(track, stack) {
  const svg = track.querySelector(".thread"), group = svg.querySelector("g"), marks = track.querySelector(".marks");
  const chapters = [...track.querySelectorAll(".chapter")];

  svg.style.width = svg.style.height = marks.style.width = marks.style.height = "0px";
  const width = stack ? track.clientWidth : track.scrollWidth;
  const height = stack ? Math.max(track.scrollHeight, track.offsetHeight) : track.clientHeight;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.style.width = marks.style.width = `${width}px`;
  svg.style.height = marks.style.height = `${height}px`;

  const origin = track.getBoundingClientRect(), sl = track.scrollLeft, st = track.scrollTop;
  const dock = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dock")) || 84;
  const c = {
    stack, width,
    lane: height - dock - 20, // sideways: the baseline the line runs along
    laneX: 20, // downwards: the margin line
    bounds: chapters.slice(1).map((ch) => (stack ? ch.offsetTop : ch.offsetLeft)),
    box(el) {
      const r = el.getBoundingClientRect();
      return { x: r.left - origin.left + sl, y: r.top - origin.top + st, w: r.width, h: r.height };
    },
  };
  const along = (x, y) => (stack ? y : x);
  const chapterAt = (v) => chapters[c.bounds.filter((b) => v >= b).length];

  // The line as points, the length reached at each, and position → length keys.
  const xs = [], ys = [], at = [], keys = [], keyLengths = [], pins = [];
  let length = 0;
  const add = (points, joined) => {
    const base = xs.length - (joined ? 1 : 0);
    for (let i = joined ? 1 : 0; i < points.length; i++) {
      const x = round1(points[i][0]), y = round1(points[i][1]);
      if (xs.length) length += Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1]);
      xs.push(x); ys.push(y); at.push(length);
    }
    return base;
  };
  const addPins = (list = [], base) => {
    for (const pin of list) {
      let idx = pin.idx >= 0 ? base + pin.idx : -1;
      if (idx < 0) { // no index given: use the nearest point of this stretch
        let best = Infinity;
        for (let i = base; i < xs.length; i++) {
          const d = (xs[i] - pin.x) ** 2 + (ys[i] - pin.y) ** 2;
          if (d < best) { best = d; idx = i; }
        }
      }
      pins.push({ ...pin, at: at[clamp(idx, 0, at.length - 1)], night: chapterAt(along(pin.x, pin.y)).classList.contains("chapter--night") });
    }
  };

  let prev = null, prevBox = null;
  for (const el of track.querySelectorAll("[data-art]")) {
    if (el.offsetParent === null) continue; // not shown in this layout
    const glyph = GLYPHS[el.dataset.art](el, c);
    if (prev) {
      const joint = stack ? downwardsConnector(prev, glyph.pts[0], prevBox, c) : sidewaysConnector(prev, glyph.pts[0], c);
      const base = add(joint.pts, true);
      for (let i = base; i < xs.length; i++) { keys.push(along(xs[i], ys[i])); keyLengths.push(at[i]); }
      addPins(joint.pins, base);
    }
    const start = length, base = add(glyph.pts, !!prev), from = along(...glyph.pts[0]);
    const to = stack ? glyph.box.y + glyph.box.h : glyph.box.x + glyph.box.w;
    keys.push(from, Math.max(to, from + 120));
    keyLengths.push(start, length);
    addPins(glyph.pins, base);
    prev = glyph.pts[glyph.pts.length - 1];
    prevBox = glyph.box;
  }
  for (let i = 1; i < keys.length; i++) keys[i] = Math.max(keys[i], keys[i - 1]);

  // One path per page, split where the line first enters the next page.
  const pos = stack ? ys : xs, stretches = [];
  let cur = { page: 0, pts: [[xs[0], ys[0]]], start: 0 };
  for (let i = 1, next = 0; i < xs.length; i++) {
    while (next < c.bounds.length && pos[i] >= c.bounds[next] && pos[i - 1] < c.bounds[next]) {
      const t = (c.bounds[next] - pos[i - 1]) / (pos[i] - pos[i - 1]);
      const cut = [xs[i - 1] + (xs[i] - xs[i - 1]) * t, ys[i - 1] + (ys[i] - ys[i - 1]) * t];
      const cutAt = at[i - 1] + (at[i] - at[i - 1]) * t;
      cur.pts.push(cut); cur.end = cutAt; stretches.push(cur);
      cur = { page: ++next, pts: [cut], start: cutAt };
    }
    cur.pts.push([xs[i], ys[i]]);
  }
  cur.end = length;
  stretches.push(cur);

  group.replaceChildren();
  const paths = stretches.map(({ page, pts, start, end }) => {
    const el = document.createElementNS(SVG, "path"), len = end - start + 1;
    const colour = getComputedStyle(chapters[page]).getPropertyValue("--thread").trim();
    el.setAttribute("d", pathData(pts));
    el.style.stroke = colour;
    el.style.strokeDasharray = `${len} ${len + 40}`;
    el.style.strokeDashoffset = len;
    group.appendChild(el);
    return { el, start, length: len, colour, shown: -1 };
  });

  marks.replaceChildren();
  for (const pin of pins) {
    pin.el = document.createElement("i");
    pin.el.className = pin.night ? "pin night" : "pin";
    pin.el.style.left = `${round1(pin.x)}px`;
    pin.el.style.top = `${round1(pin.y)}px`;
    marks.appendChild(pin.el);
    if (!pin.note) continue;
    const off = pin.off || 22;
    const tx = pin.nx < -0.35 ? "-100%" : pin.nx > 0.35 ? "0" : "-50%";
    const ty = pin.ny < -0.35 ? "-100%" : pin.ny > 0.35 ? "0" : "-50%";
    pin.noteEl = document.createElement("span");
    pin.noteEl.className = "pin-note";
    pin.noteEl.textContent = pin.note;
    pin.noteEl.style.left = `${round1(pin.x + pin.nx * off)}px`;
    pin.noteEl.style.top = `${round1(pin.y + pin.ny * off)}px`;
    pin.noteEl.style.transform = `translate(${tx}, ${ty})`;
    marks.appendChild(pin.noteEl);
  }

  return {
    xs: Float64Array.from(xs), ys: Float64Array.from(ys), at: Float64Array.from(at),
    keys: Float64Array.from(keys), keyLengths: Float64Array.from(keyLengths),
    total: length, paths, pins,
  };
}
