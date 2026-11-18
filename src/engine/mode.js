/** Phones, portrait screens and very short windows read downwards; everything else reads sideways. */
const stackMedia = window.matchMedia("(max-width: 820px), (max-aspect-ratio: 9/10), (max-height: 520px)");

export const isStack = () => stackMedia.matches;

/**
 * Applies the layout to the page: the `stack` class for the downwards layout and, for the
 * sideways layout, --s: the type scale, which follows the height of the screen.
 */
export function applyMode(root = document.documentElement) {
  const stack = isStack();
  root.classList.toggle("stack", stack);
  root.style.setProperty("--s", stack ? "1" : Math.min(1.12, Math.max(0.92, window.innerHeight / 880)).toFixed(3));
  return stack;
}
