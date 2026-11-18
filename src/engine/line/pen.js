import { clamp, round1 } from "./geometry.js";

/** The length of line to draw when the reader's lead point is at `v` (x sideways, y downwards). */
export function lengthAt(line, v) {
  const { keys, keyLengths } = line, n = keys.length;
  if (!n || v <= keys[0]) return 0;
  if (v >= keys[n - 1]) return line.total;
  let lo = 0, hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (keys[mid] <= v) lo = mid; else hi = mid - 1;
  }
  const t = clamp((v - keys[lo]) / (keys[lo + 1] - keys[lo] || 1), 0, 1);
  return keyLengths[lo] + (keyLengths[lo + 1] - keyLengths[lo]) * t;
}

/** The point at length `l` along the line. */
function pointAt(line, l) {
  const { xs, ys, at } = line, last = at.length - 1;
  if (l <= 0) return [xs[0], ys[0]];
  if (l >= line.total) return [xs[last], ys[last]];
  let lo = 0, hi = last;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (at[mid] <= l) lo = mid; else hi = mid - 1;
  }
  const t = (l - at[lo]) / (at[lo + 1] - at[lo] || 1);
  return [xs[lo] + (xs[lo + 1] - xs[lo]) * t, ys[lo] + (ys[lo + 1] - ys[lo]) * t];
}

/** The segment the pen is in at length `l`: -1 before the line starts. */
function segmentAt(line, l) {
  const segs = line.segments;
  if (l <= 0) return -1;
  let lo = 0, hi = segs.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (segs[mid].start <= l) lo = mid; else hi = mid - 1;
  }
  return lo;
}

/** A segment's path, cut at length `l`. */
function pathTo(seg, l) {
  const pts = seg.pts;
  let j = 0, d = `M${round1(pts[0][0])} ${round1(pts[0][1])}`;
  while (j + 1 < pts.length && pts[j + 1][2] <= l) {
    j++;
    d += `L${round1(pts[j][0])} ${round1(pts[j][1])}`;
  }
  if (j + 1 < pts.length) {
    const a = pts[j], b = pts[j + 1], t = (l - a[2]) / (b[2] - a[2] || 1);
    d += `L${round1(a[0] + (b[0] - a[0]) * t)} ${round1(a[1] + (b[1] - a[1]) * t)}`;
  }
  return d;
}

/** Shows a segment in full, up to length `l`, or not at all. */
function show(seg, state, l) {
  if (state === "partial") {
    if (seg.state === "partial" && seg.drawn === l) return;
    seg.el.setAttribute("d", pathTo(seg, l));
    seg.drawn = l;
  } else {
    if (seg.state === state) return;
    if (state === "full") seg.el.setAttribute("d", seg.d);
  }
  seg.el.style.display = state === "hidden" ? "none" : "";
  seg.state = state;
}

/**
 * Draws the line up to length `l`, moves the pen nib there, and shows the pins it has reached.
 * Only the segments between the pen's last place and its new one change, so a frame
 * repaints little whichever way the reader moves.
 */
export function drawTo(line, l, nib, halo) {
  const segs = line.segments, k = segmentAt(line, l), prev = line.cursor;
  for (let i = Math.max(0, Math.min(prev, k)); i <= Math.max(prev, k); i++) show(segs[i], i < k ? "full" : i === k ? "partial" : "hidden", l);
  line.cursor = k;

  const [x, y] = pointAt(line, l), visible = l > 0.5 ? "" : "0";
  for (const dot of [nib, halo]) {
    dot.setAttribute("cx", round1(x));
    dot.setAttribute("cy", round1(y));
    dot.style.opacity = visible;
  }
  nib.style.stroke = segs[Math.max(0, k)].colour;
  for (const pin of line.pins) {
    const on = l >= pin.at - 1;
    if (pin.on === on) continue;
    pin.on = on;
    pin.el.classList.toggle("on", on);
    pin.noteEl?.classList.toggle("on", on);
  }
}
