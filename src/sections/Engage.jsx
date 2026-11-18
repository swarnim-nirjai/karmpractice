import Button from "../components/Button.jsx";
import Drawing from "../components/Drawing.jsx";
import { JourneyForm, SignupForm } from "../components/Forms.jsx";
import { MAILTO, pageNumber } from "../site.js";
import "./Engage.css";

const WAYS = [
  ["#journey", "Share your research journey"],
  ["#talk", "Start a conversation"],
  ["#signup", "Sign-up"],
];

export default function Engage() {
  return (
    <section className="chapter" id="engage" aria-labelledby="engage-title">
      <div className="block row engage-a">
        <div className="engage-a__text">
          <h2 className="display display--xl" id="engage-title" data-drift>Engage</h2>
          <ul className="ways">
            {WAYS.map(([href, label], i) => (
              <li key={href}><a href={href}>{label} <span>{pageNumber(i)}</span></a></li>
            ))}
          </ul>
        </div>
        <Drawing name="engage" label="One-line drawing: a seated figure inside a turning gyroscope, resting on a stack of cubes." />
      </div>

      <div className="block engage-journey" id="journey">
        <h3 className="sub">Share your research journey</h3>
        <p className="intro">What was the work? Where did it go? Where did it stall? You can choose what I can use, whether your name is shown, and review anything before it’s published.</p>
        <JourneyForm />
      </div>

      <div className="block engage-more">
        <div id="talk">
          <h3 className="sub">Start a conversation</h3>
          <p className="lead">Have a story, a question or an idea? Get in touch.</p>
          <div className="actions"><Button href={MAILTO} variant="line">Email me</Button></div>
        </div>
        <div id="signup">
          <h3 className="sub">Sign-up</h3>
          <p className="body">One short email when something new goes up. No spam, and you can leave any time.</p>
          <SignupForm />
        </div>
      </div>

      <div className="block row finale">
        <Drawing name="logo" reverse className="finale__art" />
        <footer className="foot">
          <span className="foot__name">KARM Practice</span>
          <p>Knowledge and Research Mobilisation. Publication is only the halfway point.</p>
          <p><a href="#privacy">Privacy notice</a> · <a href="#home">Back to the start</a></p>
          <p className="foot__legal">© 2026 Meenakshi Bharti</p>
        </footer>
      </div>
    </section>
  );
}
