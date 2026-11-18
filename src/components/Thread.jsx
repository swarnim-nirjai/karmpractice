/** The one continuous line. The engine draws its paths, its pen and its points into these. */
export default function Thread() {
  return (
    <>
      <svg className="thread" aria-hidden="true">
        <g />
        <circle className="halo" r="13" />
        <circle className="nib" r="5.5" />
      </svg>
      <div className="marks" aria-hidden="true" />
    </>
  );
}
