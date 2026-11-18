/** A pill-shaped link or button. `arrow` adds the small hand-drawn arrow. */
export default function Button({ href, variant = "accent", arrow = false, className = "", children, ...rest }) {
  const classes = ["btn", `btn--${variant}`, className].filter(Boolean).join(" ");
  const content = (
    <>
      {children}
      {arrow && (
        <svg viewBox="0 0 24 12" aria-hidden="true">
          <path d="M1 6h21M17 1.5 22 6l-5 4.5" />
        </svg>
      )}
    </>
  );
  return href ? (
    <a className={classes} href={href} {...rest}>{content}</a>
  ) : (
    <button className={classes} {...rest}>{content}</button>
  );
}
