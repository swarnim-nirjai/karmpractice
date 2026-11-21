import Button from "../components/Button.jsx";
import Drawing from "../components/Drawing.jsx";
import Painting from "../components/Painting.jsx";
import team from "../assets/story/team.webp";
import shelf from "../assets/story/shelf.webp";
import lamppost from "../assets/story/lamppost.webp";
import crossroads from "../assets/story/crossroads.webp";
import pages from "../assets/story/pages.webp";
import meeting from "../assets/story/meeting.webp";
import family from "../assets/story/family.webp";
import dominoes from "../assets/story/dominoes.webp";
import lamp from "../assets/story/lamp.webp";
import "./Home.css";

/** The story the line tells after the opening: one painting and one line at a time. */
const STORY = [
  { src: team, alt: "Painting: a research team round a laptop, hands taking notes.", text: "Somewhere, a university team has spent years finding out why some families miss out on a government support scheme." },
  { src: shelf, alt: "Painting: a shelf of bound volumes.", text: "The finding is published. Then, often, nothing happens because the people who could use it never see it in a form they can use." },
  { src: lamppost, alt: "Painting: a lamp post over a city, its light the KARM spiral.", text: "This is where I come in. My practice helps university research teams get their findings to the people who can act on them." },
  { src: crossroads, alt: "Painting: paths crossing a green field, seen from above.", lead: "First, plan:", text: "find out where the journey is stuck, then set one clear goal, decide who should do what differently, and choose the best route and moment to get there." },
  { src: pages, alt: "Painting: hands holding a tablet beside printed pages of charts.", lead: "Then, share:", text: "long reports become short, clear pages in the languages people speak. I set up real conversations, to listen and learn what decision-makers need, not to push." },
  { src: meeting, alt: "Painting: a meeting round a table, the KARM spiral lit above it.", lead: "Record:", text: "who we met and what changed, so you can show funders and your university what happened." },
  { src: family, alt: "Painting: a wooden house, a family of three figures, and a key.", wide: true, text: "Picture the result: a form becomes simpler, and a family gets the help it was meant to get." },
  { src: dominoes, alt: "Painting: a row of books falling like dominoes towards a ball marked with the KARM spiral.", text: "My practice plans the route, does the groundwork and keeps the record, so your research has its best chance to make a difference, and to keep making it." },
  { src: lamp, alt: "Painting: a lamp whose glass holds the KARM spiral." },
];

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

      {/* The story opens as a section of its own, then one painting at a time. */}
      <div className="block story-intro">
        <h2 className="display" id="story-title">Picture this…</h2>
      </div>

      {STORY.map(({ src, alt, wide, lead, text }, i) => (
        <div key={src} className={text ? "block row beat" : "block row beat beat--end"}>
          <Painting src={src} alt={alt} width={960} height={wide ? 540 : 960} seed={i * 7919 + 13} pass={i % 2 ? "under" : "over"} className="beat__painting" />
          <div className="beat__text">
            {text ? (
              <p className="lead rv">{lead && <strong>{lead}</strong>}{lead && " "}{text}</p>
            ) : (
              <>
                <h2 className="display beat__title">This is KARM Practice</h2>
                <p className="sub rv">Knowledge and Research Mobilisation</p>
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
