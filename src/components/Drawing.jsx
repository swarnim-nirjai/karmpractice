/**
 * A place where the line draws one of the original drawings. The engine fits the drawing
 * inside this box. `exit` and `reverse` change how the line leaves or travels it.
 */
export default function Drawing({ name, label, className = "", exit, reverse = false }) {
  return (
    <div
      className={`art ${className}`.trim()}
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
