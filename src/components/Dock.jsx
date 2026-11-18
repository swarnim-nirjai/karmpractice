import { CHAPTERS, pageNumber } from "../site.js";
import LineArt from "./LineArt.jsx";
import "./Dock.css";

/** The page sequence: each page shown by its own drawing, floating at the bottom of the screen. */
export default function Dock({ active, night }) {
  return (
    <nav className={night ? "dock night" : "dock"} aria-label="Pages">
      <ol>
        {CHAPTERS.map((chapter, i) => (
          <li key={chapter.id}>
            <a
              className={i < active ? "stop passed" : "stop"}
              href={`#${chapter.id}`}
              aria-label={`${pageNumber(i)} ${chapter.label}`}
              aria-current={i === active ? "true" : undefined}
            >
              <LineArt name={chapter.drawing} detail="thumb" />
              <i />
              <span aria-hidden="true"><b>{pageNumber(i)}</b>{chapter.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
