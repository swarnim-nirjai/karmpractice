import { useMemo } from "react";

/** A small seeded random, so each painting keeps the same edge on every visit. */
function random(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A rough, torn edge: a polygon that wanders a little inside the picture's border. */
function roughEdge(seed) {
  const r = random(seed), pts = [];
  const nick = () => r() * 2.2 + (r() < 0.12 ? 2.5 + r() * 3 : 0); // small nicks, now and then a larger tear
  const edge = (place) => { for (let i = 0; i < 15; i++) pts.push(place(i / 14, nick())); };
  edge((t, d) => [2 + t * 96, 1.5 + d]); // along the top
  edge((t, d) => [98.5 - d, 2 + t * 96]); // down the right side
  edge((t, d) => [98 - t * 96, 98.5 - d]); // back along the bottom
  edge((t, d) => [1.5 + d, 98 - t * 96]); // up the left side
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(", ")})`;
}

/**
 * One of the paintings, sitting on the paper like the portrait: blended into the page, no box,
 * a rough edge instead of a straight one. The line draws a loose frame round it, or, given
 * `pass` ("over" or "under"), runs straight past the card on that side.
 */
export default function Painting({ src, alt, width, height, seed, pass, className = "" }) {
  const edge = useMemo(() => roughEdge(seed), [seed]);
  return (
    <figure className={`painting ${className}`.trim()} style={{ aspectRatio: `${width} / ${height}` }} data-art={pass ? "pass" : "frame"} data-pass={pass}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" style={{ clipPath: edge }} />
    </figure>
  );
}
