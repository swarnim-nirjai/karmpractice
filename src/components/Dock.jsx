import { useRef } from "react";
import { CHAPTERS } from "../site.js";
import LineArt from "./LineArt.jsx";
import "./Dock.css";

/**
 * The page sequence. Sideways, every page is shown by its own drawing, floating at the bottom
 * of the screen. On phones there is room for one: the page in view, which opens a sheet of them all.
 */
export default function Dock({ active, night, stack }) {
  if (stack) return <PhoneDock active={active} />;
  return (
    <nav className={night ? "dock night" : "dock"} aria-label="Pages">
      <Stops active={active} />
    </nav>
  );
}

function Stops({ active, onPick }) {
  return (
    <ol>
      {CHAPTERS.map((chapter, i) => (
        <li key={chapter.id}>
          <a
            className={i < active ? "stop passed" : "stop"}
            href={`#${chapter.id}`}
            aria-current={i === active ? "true" : undefined}
            onClick={onPick}
          >
            <LineArt name={chapter.drawing} detail="thumb" />
            <i />
            <span>{chapter.label}</span>
            {i === active && <small aria-hidden="true">you are here</small>}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** A tap on the dimmed page around the sheet (the dialog itself, outside its content) closes it. */
function closeFromOutside(e) {
  if (e.target === e.currentTarget) e.currentTarget.close();
}

/** A pill naming the page in view; tapping it opens the list of pages as a sheet. */
function PhoneDock({ active }) {
  const sheet = useRef(null);
  const here = CHAPTERS[active];
  return (
    <nav className="dock dock--phone" aria-label="Pages">
      <button
        type="button"
        className="pill"
        aria-haspopup="dialog"
        aria-label={`Pages. You are on ${here.label}. Open the list`}
        onClick={() => sheet.current.showModal()}
      >
        <LineArt name={here.drawing} detail="thumb" />
        <span className="pill__page">{here.label}</span>
        <span className="pill__all">
          Pages
          <svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 7l5-5 5 5" /></svg>
        </span>
      </button>
      <dialog className="pages" ref={sheet} aria-label="Pages" onClick={closeFromOutside}>
        <div className="pages__sheet">
          <div className="pages__head">
            <p className="pages__title">Pages</p>
            <form method="dialog">
              <button className="btn btn--line pages__close">Close</button>
            </form>
          </div>
          <Stops active={active} onPick={() => sheet.current.close()} />
        </div>
      </dialog>
    </nav>
  );
}
