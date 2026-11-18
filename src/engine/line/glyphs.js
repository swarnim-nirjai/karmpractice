import drawings from "./drawings.json";
import { loop, smooth, spline, toPoints } from "./geometry.js";

/**
 * Everything the line draws, in page coordinates. Each glyph reads an element marked with
 * data-art and returns the points to draw in order, the box they fill, and any pins
 * (points on the line, some with a handwritten note).
 */
export const GLYPHS = {
  /** One of the six original one-line drawings, fitted inside the element. */
  drawing(el, c) {
    const d = drawings[el.dataset.draw], b = c.box(el), scale = Math.min(b.w / d.w, b.h / d.h);
    const w = d.w * scale, h = d.h * scale, ox = b.x + (b.w - w) / 2, oy = b.y + (b.h - h) / 2;
    const pts = toPoints(d.pts).map(([x, y]) => [ox + x * scale, oy + y * scale]);
    if (el.hasAttribute("data-reverse")) pts.reverse();
    if (el.dataset.exit === "left") {
      // The logo ends at the top-left of its diagonal: leave round its left side.
      const e = pts[pts.length - 1];
      const route = c.stack
        ? [e, [e[0] - w * 0.04, e[1] + h * 0.1], [c.laneX + 3, oy + h * 0.45], [c.laneX, oy + h * 0.72]]
        : [e, [e[0] - w * 0.05, e[1] + h * 0.12], [ox - 26, oy + h * 0.56], [ox - 6, c.lane - 34], [ox + 70, c.lane]];
      pts.push(...spline(route, c.stack ? 8 : 9).slice(1));
    }
    return { pts, box: { x: ox, y: oy, w, h } };
  },

  /** The arch that passes over the portrait, with a curl above her head. */
  arch(el, c) {
    const b = c.box(el.querySelector("img")), m = 14;
    const r = b.w / 2 + m, cx = b.x + b.w / 2, cy = b.y + b.w / 2, bottom = b.y + b.h - 2;
    const around = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
    const top = [cx - r * 0.14, cy - r * 0.99];
    const pts = [[b.x - m, bottom]];
    for (let y = bottom - 12; y > cy; y -= 12) pts.push([b.x - m, y]);
    for (let a = 180; a <= 262; a += 4) pts.push(around(a));
    for (let i = 1; i <= 30; i++) {
      const a = (i / 30) * Math.PI * 2;
      pts.push([top[0] + 16 * Math.sin(a) + (i / 30) * 22, top[1] - 16 + 16 * Math.cos(a) - i / 30]);
    }
    for (let a = 274; a <= 360; a += 4) pts.push(around(a));
    for (let y = cy + 12; y < bottom; y += 12) pts.push([b.x + b.w + m, y]);
    pts.push([b.x + b.w + m, bottom]);
    return { pts, box: { x: b.x - m, y: top[1] - 34, w: b.w + 2 * m, h: bottom - top[1] + 34 } };
  },

  /**
   * Knowledge mobilisation as an infinity: in from below the left lobe, one and a half
   * turns, out below the right lobe. Seven pins mark the stages; on phones they are
   * numbered and named in a key below.
   */
  infinity(el, c) {
    const b = c.box(el), notes = el.dataset.notes.split("|"), ky = 1.25;
    const a = c.stack ? Math.min(b.w * 0.43, b.h) : Math.min(b.w * 0.34, b.h * 0.9);
    const cx = b.x + b.w / 2, cy = b.y + b.h * (c.stack ? 0.5 : 0.45);
    const at = (t, k = 1) => {
      const s = Math.sin(t), co = Math.cos(t), d = 1 + s * s;
      return [cx + (k * a * co) / d, cy + (k * ky * a * s * co) / d];
    };
    const t0 = 1.2 * Math.PI, span = 3 * Math.PI, n = 330, pts = [];
    for (let i = 0; i <= n; i++) pts.push(at(t0 + (i / n) * span, 1 - 0.035 * smooth((i / n - 0.6) / 0.3)));
    // Each stage in the order the loop is travelled, and the side its note sits on.
    const stages = [1.32, 1.75, 1.9, 2.08, 2.32, 2.75, 2.92];
    const sides = [[0, 1], [0, -1], [0.6, -1], [1, 0.15], [0, 1], [0, -1], [-1, -0.15]];
    const pins = stages.map((s, i) => {
      const t = s * Math.PI, [x, y] = at(t), [dx, dy] = sides[i], len = Math.hypot(dx, dy);
      return { idx: Math.round(((t - t0) / span) * n), x, y, note: c.stack ? String(i + 1) : notes[i], nx: dx / len, ny: dy / len, off: c.stack ? 15 : 22 };
    });
    return { pts, pins, box: c.stack ? b : { ...b, w: b.w * 0.88 } };
  },

  /** A run of small loops, one under each item in a row: the points in between. */
  knots(el, c) {
    const b = c.box(el), y = b.y + b.h * 0.7, pts = [[b.x - 30, y]], pins = [];
    for (const item of el.closest(".block").querySelectorAll(el.dataset.items)) {
      const k = c.box(item).x + 10;
      pts.push([k - 22, y + 1.5], [k, y], ...loop(k, y, 10, 8), [k + 34, y - 1]);
      pins.push({ idx: -1, x: k + 4, y: y - 10 });
    }
    pts.push([b.x + b.w, y]);
    return { pts: spline(pts, 10), pins, box: b };
  },

  /** The hand-drawn underline below a quote. */
  underline(el, c) {
    const b = c.box(el);
    const shape = [[0, 30], [140, 26], [320, 34], [500, 27], [660, 33], [780, 29], [818, 26], [842, 14], [834, 4], [818, 9], [820, 24], [846, 34], [880, 33], [900, 31]];
    return { pts: spline(shape.map(([x, y]) => [b.x + (x / 900) * b.w, b.y + (y / 60) * b.h]), 8), box: b };
  },

  /** Pins with handwritten notes: along the baseline sideways, down the margin on phones. */
  points(el, c) {
    const b = c.box(el), notes = el.dataset.notes.split("|"), n = notes.length, pts = [], pins = [];
    if (c.stack) {
      const x = c.laneX;
      pts.push([x, b.y]);
      notes.forEach((note, i) => {
        const y = b.y + (b.h * (i + 0.5)) / n;
        pts.push([x, y - 14], [x, y]);
        pins.push({ idx: pts.length - 1, x, y, note, nx: 1, ny: 0, off: 20 });
        pts.push([x, y + 14]);
      });
      pts.push([x, b.y + b.h]);
    } else {
      const y = c.lane;
      pts.push([b.x, y]);
      notes.forEach((note, i) => {
        const x = b.x + (b.w * (i + 0.5)) / n;
        pts.push([x - 18, y + 0.5], [x, y]);
        pins.push({ idx: pts.length - 1, x, y, note, nx: 0, ny: -1 });
        pts.push([x + 18, y - 0.5]);
      });
      pts.push([b.x + b.w, y]);
    }
    return { pts, pins, box: b };
  },
};
