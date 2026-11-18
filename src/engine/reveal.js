/** Text, highlights and small drawings fade or draw in the first time they come into view. */
export function revealOnView(root) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.3 });
  for (const el of root.querySelectorAll(".rv, .term, .cover, .hl, .journey")) observer.observe(el);
  return () => observer.disconnect();
}
