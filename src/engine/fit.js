/** The smallest a crowded block may be scaled to. */
const MIN_SCALE = 0.72;

/** How tall a block's content is, and how much room it has. */
function measure(block) {
  const style = getComputedStyle(block), box = block.getBoundingClientRect();
  const room = box.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  let top = Infinity, bottom = -Infinity;
  for (const child of block.children) {
    if (getComputedStyle(child).position === "absolute") continue;
    const r = child.getBoundingClientRect();
    if (!r.height) continue;
    top = Math.min(top, r.top);
    bottom = Math.max(bottom, r.bottom);
  }
  return { content: bottom - top, room };
}

/**
 * Sideways, no page may need scrolling up and down. Any block whose content is taller than
 * the screen allows is scaled down through --f, which every size inside a block is relative to.
 */
export function fitBlocks(blocks, stack) {
  for (const block of blocks) block.style.removeProperty("--f");
  if (stack) return;
  for (const block of blocks) {
    let scale = 1;
    for (let pass = 0; pass < 4 && scale > MIN_SCALE; pass++) {
      const { content, room } = measure(block);
      if (!(content > room + 1)) break;
      scale = Math.max(MIN_SCALE, scale * (room / content) * 0.985);
      block.style.setProperty("--f", scale.toFixed(3));
    }
  }
}
