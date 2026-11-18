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

/** Draws the line up to length `l`, moves the pen nib there, and shows the pins it has reached. */
export function drawTo(line, l, nib, halo) {
  let colour = line.paths[0]?.colour;
  for (const path of line.paths) {
    const done = clamp((l - path.start) / path.length, 0, 1);
    if (Math.abs(done - path.shown) > 1e-5) {
      path.el.style.strokeDashoffset = path.length * (1 - done);
      path.shown = done;
    }
    if (l >= path.start) colour = path.colour;
  }
  const [x, y] = pointAt(line, l), visible = l > 0.5 ? "" : "0";
  for (const dot of [nib, halo]) {
    dot.setAttribute("cx", round1(x));
    dot.setAttribute("cy", round1(y));
    dot.style.opacity = visible;
  }
  nib.style.stroke = colour;
  for (const pin of line.pins) {
    const on = l >= pin.at - 1;
    if (pin.on === on) continue;
    pin.on = on;
    pin.el.classList.toggle("on", on);
    pin.noteEl?.classList.toggle("on", on);
  }
}
