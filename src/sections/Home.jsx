import Button from "../components/Button.jsx";
import Drawing from "../components/Drawing.jsx";
import "./Home.css";

export default function Home() {
  return (
    <section className="chapter" id="home" aria-labelledby="home-title">
      <div className="block home">
        <Drawing name="logo" exit="left" className="home__art" label="The KARM Practice logo: one line drawn as a spiral, cut through by a diagonal." />
        <div className="home__text">
          <div className="journey">
            <svg viewBox="0 0 440 24" aria-hidden="true">
              <path className="ink" pathLength="1" style={{ "--dur": "1.3s", "--delay": "1.1s" }} d="M8 12 H218" />
              <path className="dash" d="M226 12 H424" />
              <circle className="dot d1" cx="8" cy="12" r="5" />
              <circle className="dot dot--pub d2" cx="220" cy="12" r="7" />
              <circle className="dot ring d3" cx="430" cy="12" r="5.5" />
            </svg>
            <ol><li>Question</li><li>Publication</li><li>Use</li></ol>
          </div>
          <h1 className="display" id="home-title">Publication is only the <span className="hl">halfway point.</span></h1>
          <p className="lead rv">Research gets written, reviewed and published. Then, too often, it stops. This is a place to follow what happens next: who used it, who didn’t, and why.</p>
          <div className="actions rv">
            <Button href="#journey" arrow>Share your research journey</Button>
            <Button href="#signup" variant="line">Follow the book &amp; site</Button>
          </div>
        </div>
        <div className="home__points" data-art="points" data-notes="who used it?|who didn’t?|why?" />
        <p className="hint">
          Follow the line
          <svg viewBox="0 0 46 14" aria-hidden="true"><path d="M1 7h42M37 1.5 43 7l-6 5.5" /></svg>
        </p>
      </div>
    </section>
  );
}
