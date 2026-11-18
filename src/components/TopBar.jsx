import { CHAPTERS } from "../site.js";
import Button from "./Button.jsx";
import LineArt from "./LineArt.jsx";
import "./TopBar.css";

/** The logo, the page in view, and the main call to action. */
export default function TopBar({ active }) {
  return (
    <header className="bar">
      <a className="brand" href="#home" aria-label="KARM Practice, home">
        <LineArt name="logo" detail="thumb" className="brand__mark" />
        <span>
          <span className="brand__name">KARM Practice</span>
          <span className="brand__tag">Knowledge and Research Mobilisation</span>
        </span>
      </a>
      <p className="bar__where">{CHAPTERS[active].label}</p>
      <Button href="#journey" className="bar__cta">Share your research journey</Button>
    </header>
  );
}
