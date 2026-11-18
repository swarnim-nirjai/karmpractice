import drawings from "../engine/line/drawings.json";
import { pathData, toPoints } from "../engine/line/geometry.js";

const cache = new Map();

/** A still copy of one of the original drawings: the full line, or its lighter thumbnail. */
export default function LineArt({ name, detail = "pts", className }) {
  const drawing = drawings[name];
  const key = `${name}:${detail}`;
  if (!cache.has(key)) cache.set(key, pathData(toPoints(drawing[detail])));
  return (
    <svg className={className} viewBox={`0 0 ${drawing.w} ${drawing.h}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path d={cache.get(key)} />
    </svg>
  );
}
