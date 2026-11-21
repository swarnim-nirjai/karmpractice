import { TURN, clamp, loop, loopBeside, smooth, spline, straightPath } from "./geometry.js";

/** Pages begin a little before their loop, so the loop sits just inside the new page. */
const LOOP_OFFSET = 64;

/** How far outside a card the line turns up or down: within the card's own padding. */
const STEP_OUT = 30;

/**
 * To or from a straight pass (see the `pass` glyph) the line does not curve or slant: it runs
 * straight on, turns straight up or down in the gap between two cards, and runs straight on again.
 * From the baseline it climbs just before a pass; after one it drops just after it.
 */
function rampConnector(e, s, c, { from, to }) {
  const lane = c.lane;
  if (from && to) {
    const x = (e[0] + s[0]) / 2; // halfway between the cards
    return { pts: straightPath([e, [x, e[1]], [x, s[1]], s]), pins: [] };
  }
  if (to) {
    // Along the baseline as usual, then straight up just before the card.
    const x = s[0] - STEP_OUT, start = [x - TURN, lane];
    if (lane - s[1] < 3 || start[0] < e[0] + 60) return sidewaysConnector(e, s, c);
    const before = sidewaysConnector(e, start, c);
    return { pts: [...before.pts, ...straightPath([start, [x, lane], [x, s[1]], s]).slice(1)], pins: before.pins };
  }
  // Straight down just after the card, then along the baseline as usual.
  if (lane - e[1] < 3) return sidewaysConnector(e, s, c);
  const x = e[0] + STEP_OUT, end = [x + TURN, lane];
  const drop = straightPath([e, [x, e[1]], [x, lane], end]), after = sidewaysConnector(end, s, c);
  return { pts: [...drop, ...after.pts.slice(1)], pins: after.pins.map((pin) => ({ ...pin, idx: pin.idx + drop.length - 1 })) };
}

/**
 * Sideways: between drawings the line drops to a baseline above the page sequence,
 * wanders a little, ties a loop as it enters each new page, and rises into the next drawing.
 * `straight` says whether the line comes from, or goes to, a straight pass.
 */
export function sidewaysConnector(e, s, c, straight = {}) {
  if (straight.from || straight.to) return rampConnector(e, s, c, straight);
  const lane = c.lane, dx = s[0] - e[0];
  const fromLane = Math.abs(e[1] - lane), toLane = Math.abs(s[1] - lane);
  const down = fromLane < 3 ? 0 : clamp(fromLane * 0.28, 40, 130);
  const up = toLane < 3 ? 0 : clamp(toLane * 0.28, 40, 130);
  if (dx < down + up + 40) {
    const sag = [e[0] + dx / 2, Math.max(e[1], s[1]) + clamp(Math.abs(dx) * 0.18, 10, 50)];
    return { pts: spline([e, sag, s], 8), pins: [] };
  }
  const pts = [e], pins = [];
  const loopsAt = c.bounds.map((x) => x + LOOP_OFFSET).filter((x) => x > e[0] + down + 40 && x < s[0] - up - 40);
  for (let x = e[0] + 10, next = 0; x < s[0]; x += 10) {
    let y;
    if (down && x < e[0] + down) y = e[1] + (lane - e[1]) * smooth((x - e[0]) / down);
    else if (up && x > s[0] - up) y = s[1] + (lane - s[1]) * smooth((s[0] - x) / up);
    else {
      const calm = smooth((x - e[0] - down) / 140) * smooth((s[0] - up - x) / 140);
      y = lane + calm * (2.4 * Math.sin((x - e[0]) / 83) + 1.4 * Math.sin((x - e[0]) / 29 + 1.7));
    }
    pts.push([x, y]);
    if (next < loopsAt.length && x >= loopsAt[next]) {
      const start = pts.length - 1;
      pts.push(...loop(x, y, 11, 8));
      pins.push({ idx: start + 14, x: x + 4, y: y - 11 });
      x += 8;
      next++;
    }
  }
  pts.push(s);
  return { pts, pins };
}

/**
 * Downwards (phones): the line leaves each drawing below it, crosses to a margin line on
 * the left, runs down it (tying a loop as it enters each new page) and turns in to the
 * next drawing.
 */
export function downwardsConnector(e, s, prev, c) {
  const margin = c.laneX, pts = [e], pins = [];
  let cur = e;
  const prevBottom = prev.y + prev.h;
  if (e[0] - margin > 40 && e[1] < prevBottom - 6) {
    // Leave the drawing downwards, round its right side if it ends there.
    const side = Math.min(prev.x + prev.w + 12, c.width - 8);
    const via = e[0] > prev.x + prev.w * 0.7
      ? [[side, e[1] + 26], [side, prevBottom - 6], [side - 30, prevBottom + 18]]
      : [[e[0] + 4, (e[1] + prevBottom) / 2], [e[0] - 24, prevBottom + 18]];
    pts.push(...spline([e, ...via], 8).slice(1));
    cur = pts[pts.length - 1];
  }
  if (cur[0] - margin > 6) {
    // Across to the margin line.
    const turn = clamp((cur[0] - margin) * 0.5, 14, 60);
    pts.push(...spline([cur, [margin + turn, cur[1] + 6], [margin + 3, cur[1] + turn * 0.8], [margin, cur[1] + turn + 10]], 8).slice(1));
    cur = pts[pts.length - 1];
  }
  // A drawing that starts well inside the page is met from below.
  const deep = s[0] - margin > 80;
  const turnIn = deep ? s[1] + 30 : s[1] - clamp((s[0] - margin) * 0.9, 18, 60);
  if (turnIn > cur[1] + 30) {
    const y0 = cur[1];
    const loopsAt = c.bounds.map((y) => y + LOOP_OFFSET).filter((y) => y > y0 + 30 && y < turnIn - 40);
    for (let y = y0 + 10, next = 0; y < turnIn; y += 10) {
      const calm = smooth((y - y0) / 120) * smooth((turnIn - y) / 120);
      const x = margin + calm * (2 * Math.sin((y - y0) / 83) + 1.2 * Math.sin((y - y0) / 29 + 1.7));
      pts.push([x, y]);
      if (next < loopsAt.length && y >= loopsAt[next]) {
        const start = pts.length - 1;
        pts.push(...loopBeside(x, y, 11, 8));
        pins.push({ idx: start + 14, x: x + 11, y: y + 4 });
        y += 8;
        next++;
      }
    }
    cur = pts[pts.length - 1];
  }
  const into = deep
    ? [cur, [margin + 6, turnIn + 4], [margin + 40, turnIn + 2], [s[0] - 22, turnIn], [s[0], s[1] + 10], s]
    : [cur, [margin + (s[0] - margin) * 0.25, s[1] - 6], s];
  pts.push(...spline(into, 8).slice(1));
  return { pts, pins };
}
