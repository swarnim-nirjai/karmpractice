export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/** Smoothstep: eases 0→1 with gentle ends. */
export const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

export const round1 = (n) => Math.round(n * 10) / 10;

/** Pairs a flat [x, y, x, y, …] array into points. */
export function toPoints(flat) {
  const points = [];
  for (let i = 0; i < flat.length; i += 2) points.push([flat[i], flat[i + 1]]);
  return points;
}

/** SVG path data for a polyline. */
export const pathData = (points) => "M" + points.map(([x, y]) => `${round1(x)} ${round1(y)}`).join("L");

/** A Catmull-Rom curve through the control points, sampled every `step` px. */
export function spline(points, step = 8) {
  const out = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || p2;
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let k = 1; k <= n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const at = (a, b, c, d) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
      out.push([at(p0[0], p1[0], p2[0], p3[0]), at(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
}

/** A small hand-drawn loop sitting on a horizontal line at (x, y). */
export function loop(x, y, r = 10, drift = 7) {
  const out = [];
  for (let i = 1; i <= 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    out.push([x + r * Math.sin(a) + (i / 28) * drift, y - r + r * Math.cos(a)]);
  }
  return out;
}

/** The same loop, beside a vertical line. */
export function loopBeside(x, y, r = 10, drift = 7) {
  const out = [];
  for (let i = 1; i <= 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    out.push([x + r - r * Math.cos(a), y + r * Math.sin(a) + (i / 28) * drift]);
  }
  return out;
}
