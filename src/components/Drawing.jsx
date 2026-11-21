import drawings from "../engine/line/drawings.json";

/**
 * A place where the line draws one of the drawings. The box keeps the drawing's proportions
 * and the engine fits the drawing inside it. `exit` and `reverse` change how the line leaves or travels it.
 */
export default function Drawing({ name, label, className = "", exit, reverse = false }) {
  const { w, h } = drawings[name];
  return (
    <div
      className={`art ${className}`.trim()}
      style={{ aspectRatio: `${w} / ${h}` }}
      data-art="drawing"
      data-draw={name}
      data-exit={exit}
      data-reverse={reverse ? "" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    />
  );
}
