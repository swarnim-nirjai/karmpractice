import Button from "../components/Button.jsx";
import Drawing from "../components/Drawing.jsx";
import LineArt from "../components/LineArt.jsx";
import "./Book.css";

const THEMES = [
  ["Real journeys", "Researchers and their work, told through what actually happened."],
  ["The stalled stories too", "The research that never quite arrived, and what the people behind it learned."],
  ["Myth-busting", "Common beliefs, such as “good research speaks for itself” or “a summary is enough”, will be tested against real cases."],
  ["Personal stories", "My own path from asking, “how can this change anything in practice?” while writing my dissertation at the London School of Economics and Political Science, UK, to the question this book tries to answer."],
];

const READERS = [
  "Anyone curious about how knowledge becomes action. You don’t need to know what a p-value is. If you’ve ever wondered why good ideas take so long to change anything, this book is for you.",
  "Researchers who want their work to matter beyond the journal page, and who suspect that publishing was the easy part.",
  "Research-impact practitioners: the knowledge brokers, research-support staff, communications teams and funders who help findings travel. You’ll recognise some of these stories, and perhaps a few of your own frustrations.",
];

export default function Book() {
  return (
    <section className="chapter chapter--night" id="book" aria-labelledby="book-title">
      <div className="block row book-a">
        <div className="book-a__text">
          <p className="label">Book</p>
          <h2 className="display" id="book-title" data-drift>Where Does My Research Go?</h2>
          <p className="sub">A book about what happens after publication.</p>
        </div>
        <Drawing name="book" label="One-line drawing: two open hands holding a small tree inside a ring, with cubes rising around it." />
      </div>

      <div className="block row book-cover">
        <div className="cover rv" aria-hidden="true">
          <span className="cover__author">Meenakshi Bharti</span>
          <span className="cover__title">Where Does My Research Go?</span>
          <LineArt name="book" />
          <span className="cover__sub">A book about what happens after publication.</span>
        </div>
        <div className="book-cover__text">
          <p className="body rv">Every year, researchers finish rigorous work. They publish it and move on. But then what? Some findings reach a minister’s desk, a seminar, a classroom or a community. Many sit in a journal, read by a handful of people. Few people tell the story of why.</p>
          <p className="body rv"><em>Where Does My Research Go?</em> will follow research on its journey after publication. It will explore who used it, who didn’t, and what got in the way. It will read like a detective story, tracing a finding from the page to wherever it ended up, and will ask what helped or stopped it along the way.</p>
        </div>
      </div>

      <div className="block book-about">
        <h3 className="sub">What the book is about</h3>
        <ul className="themes">
          {THEMES.map(([title, text]) => <li key={title} className="rv"><strong>{title}</strong>{text}</li>)}
        </ul>
      </div>

      <div className="block book-who">
        <h3 className="sub">Who it’s for</h3>
        <div className="readers">
          {READERS.map((reader) => <p key={reader} className="rv">{reader}</p>)}
        </div>
        <p className="lead rv">Whether you’ve never read a journal article, have written hundreds, or spend your days helping other people’s findings find a home, this book has a seat for you.</p>
      </div>

      <div className="block book-stands">
        <div>
          <h3 className="sub">Where it stands</h3>
          <p className="body rv">I’m researching and writing now. I’m gathering stories from researchers, with their permission, and nothing will appear without their agreement.</p>
        </div>
        <div>
          <h3 className="sub">Be part of it</h3>
          <p className="body rv"><strong>Share your research journey.</strong> Did one of your studies travel further than you expected, or stall somewhere you didn’t expect? You choose what I can use, whether your name appears, and you can review anything before it’s published.</p>
          <p className="body rv"><strong>Follow the book &amp; site.</strong> One short email when there’s news, such as a new journey, an excerpt, or the publication date.</p>
          <div className="actions rv">
            <Button href="#journey" arrow>Share your research journey</Button>
            <Button href="#signup" variant="line">Follow the book &amp; site</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
