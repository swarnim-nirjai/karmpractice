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

/** How much of each side a turn in a straight path rounds off. */
export const TURN = 26;

/**
 * A path of straight runs through the given corners, with each turn rounded off and nothing
 * else curved, sampled every `step` px with the slight unevenness of a line ruled by hand.
 */
export function straightPath(corners, step = 12) {
  const n = corners.length, len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const toward = (p, q, d) => { const l = len(p, q) || 1; return [p[0] + ((q[0] - p[0]) * d) / l, p[1] + ((q[1] - p[1]) * d) / l]; };
  // A turn may take all of a side that ends the path, and half of a side it shares with another turn.
  const cut = corners.map((p, i) => {
    if (i === 0 || i === n - 1) return 0;
    return Math.min(TURN, len(corners[i - 1], p) / (i === 1 ? 1 : 2), len(p, corners[i + 1]) / (i === n - 2 ? 1 : 2));
  });
  const out = [corners[0]];
  let walked = 0;
  for (let i = 0; i < n - 1; i++) {
    const a = toward(corners[i], corners[i + 1], cut[i]), b = toward(corners[i + 1], corners[i], cut[i + 1]);
    const l = len(a, b), ux = (b[0] - a[0]) / (l || 1), uy = (b[1] - a[1]) / (l || 1);
    for (let d = step; d < l - 1; d += step) {
      const t = walked + d, w = smooth(d / 70) * smooth((l - d) / 70) * (1.1 * Math.sin(t / 61) + 0.6 * Math.sin(t / 23 + 1.1));
      out.push([a[0] + ux * d - uy * w, a[1] + uy * d + ux * w]);
    }
    if (l > 0.01) out.push(b);
    walked += l;
    if (i + 1 < n - 1 && cut[i + 1] > 0) {
      const p = corners[i + 1], c = toward(p, corners[i + 2], cut[i + 1]);
      for (let k = 1; k <= 6; k++) {
        const t = k / 6, s = 1 - t;
        out.push([s * s * b[0] + 2 * s * t * p[0] + t * t * c[0], s * s * b[1] + 2 * s * t * p[1] + t * t * c[1]]);
      }
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
