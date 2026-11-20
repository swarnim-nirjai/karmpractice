import { useEffect, useRef, useState } from "react";
import { createEngine } from "./engine/index.js";
import { isStack } from "./engine/mode.js";
import TopBar from "./components/TopBar.jsx";
import Thread from "./components/Thread.jsx";
import Dock from "./components/Dock.jsx";
import PrivacyNotice from "./components/PrivacyNotice.jsx";
import Home from "./sections/Home.jsx";
import About from "./sections/About.jsx";
import Why from "./sections/Why.jsx";
import Practice from "./sections/Practice.jsx";
import Book from "./sections/Book.jsx";
import Engage from "./sections/Engage.jsx";
import { CHAPTERS } from "./site.js";

const PAGES = { home: Home, about: About, why: Why, practice: Practice, book: Book, engage: Engage };

export default function App() {
  const track = useRef(null);
  const privacy = useRef(null);
  const [active, setActive] = useState(0);
  const [night, setNight] = useState(false);
  const [stack, setStack] = useState(isStack);

  useEffect(() => createEngine(track.current, { privacy: privacy.current, onActive: setActive, onNight: setNight, onMode: setStack }), []);

  return (
    <>
      {/* Skips the opening page to the first page after it. */}
      <a className="skip" href={`#${CHAPTERS[1].id}`}>Skip to content</a>
      <TopBar active={active} />
      <main className="track" ref={track} tabIndex={-1}>
        <Thread />
        {CHAPTERS.map(({ id }) => {
          const Page = PAGES[id];
          return <Page key={id} />;
        })}
      </main>
      <Dock active={active} night={night} stack={stack} />
      <PrivacyNotice ref={privacy} />
    </>
  );
}
