import Drawing from "../components/Drawing.jsx";
import { pathData } from "../engine/line/geometry.js";
import "./Why.css";

/** The stages of knowledge mobilisation, from the original diagram: the points on the infinity. */
const STAGES = ["knowledge creation", "research & analysis", "dissemination & engagement", "exchange", "implementation", "application", "impact & change"];

/** A small spiral running into a line: the icon for Knowledge Mobilisation, echoing the logo. */
const SPIRAL = (() => {
  const points = [];
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 4, r = 2 + (i / 120) * 17;
    points.push([26 + r * Math.cos(a), 24 + r * Math.sin(a)]);
  }
  return pathData([...points, [70, 24], [108, 24]]);
})();

const TERMS = [
  {
    name: "Knowledge Transfer",
    text: "Usually one way, moving knowledge from those who produce it to those who use it.",
    icon: (
      <>
        <circle className="ink" pathLength="1" cx="6" cy="24" r="4" />
        <path className="ink" pathLength="1" style={{ "--delay": ".2s" }} d="M14 24 H112 M102 15 L113 24 L102 33" />
      </>
    ),
  },
  {
    name: "Knowledge Exchange",
    text: "Two way, with researchers and users learning from each other.",
    icon: (
      <>
        <path className="ink" pathLength="1" d="M8 18 C36 2 84 2 112 18 M101 9 L112 18 L100 24" />
        <path className="ink" pathLength="1" style={{ "--delay": ".35s" }} d="M112 32 C84 48 36 48 8 32 M19 41 L8 32 L20 26" />
      </>
    ),
  },
  {
    name: "Knowledge Mobilisation",
    text: "The wider effort to get knowledge into use, including both transfer and exchange. It also includes shaping questions with users and keeping the work alive after publication.",
    featured: true,
    icon: (
      <>
        <path className="ink" pathLength="1" style={{ "--dur": "2.2s" }} d={SPIRAL} />
        <circle className="ink" pathLength="1" style={{ "--delay": "1.6s" }} cx="113" cy="24" r="5" />
      </>
    ),
  },
];

export default function Why() {
  return (
    <section className="chapter" id="why" aria-labelledby="why-title">
      <div className="block why-a">
        <h2 className="display" id="why-title" data-drift>Why <em>mobilisation</em></h2>
        <p className="lead rv">Every study begins with a question and, officially, ends with a publication. But a published finding hasn’t yet changed anything on its own. It has only become available. <span className="hl">That’s a real gap.</span></p>
      </div>

      <div className="block row why-b">
        <div className="why-b__text">
          <p className="body rv">Knowledge mobilisation is the work of closing that gap. It connects a finding to the people who can act on it, such as a policymaker, a practitioner, a community group, or another researcher, so that it can shape a decision. That connection is rarely automatic. It takes planning, relationships and trust. A good place to start is a conversation rather than a handover.</p>
        </div>
        <Drawing name="why" label="One-line drawing: a hand rising out of a ring, lifting a cube." />
      </div>

      <div className="block why-loop">
        <div
          className="loop"
          data-art="infinity"
          data-notes={STAGES.join("|")}
          role="img"
          aria-label={`Line diagram of knowledge mobilisation as an infinity loop with seven points: ${STAGES.join(", ")}.`}
        />
        <p className="loop__title">Knowledge mobilisation</p>
        <ol className="loop__key" aria-hidden="true">
          {STAGES.map((stage) => <li key={stage}>{stage}</li>)}
        </ol>
      </div>

      <div className="block why-terms">
        <p className="body rv">You’ll often hear three terms used almost interchangeably, though writers define them differently. Here is how I use them:</p>
        <ul className="terms">
          {TERMS.map(({ name, text, icon, featured }) => (
            <li key={name} className={featured ? "term term--featured rv" : "term rv"}>
              <svg viewBox="0 0 120 48" aria-hidden="true">{icon}</svg>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="block why-quote">
        <blockquote className="quote rv">
          <p>Publication asks, “Is it rigorous?”<br />Mobilisation asks, “<em>Is anyone using it?</em>”</p>
        </blockquote>
        <div className="underline" data-art="underline" />
      </div>

      <div className="block why-outro">
        <p className="lead rv">KARM Practice (Knowledge and Research Mobilisation) is my attempt to close that gap: to help research reach the people who can use it, and to learn from what happens when it does and when it doesn’t.</p>
      </div>
    </section>
  );
}
