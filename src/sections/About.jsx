import Button from "../components/Button.jsx";
import Drawing from "../components/Drawing.jsx";
import portrait from "../assets/portrait.webp";
import { EMAIL, MAILTO } from "../site.js";
import "./About.css";

export default function About() {
  return (
    <section className="chapter" id="about" aria-labelledby="about-title">
      <div className="block row about-a">
        <div className="about-a__text">
          <h2 className="display display--xl" id="about-title" data-drift>About</h2>
          <h3 className="sub">Why this place exists</h3>
          <p className="lead rv">Once a finding is published, the record usually stops there. KARM Practice is where I keep following it: who picked the work up, where it stalled, and why.</p>
        </div>
        <Drawing name="about" label="One-line drawing: a figure standing on a ring that circles a globe." />
      </div>

      <div className="block row about-me" id="who-i-am">
        <div className="portrait" data-art="arch">
          <img src={portrait} alt="Painted portrait of Meenakshi Bharti" width="664" height="720" />
        </div>
        <div className="about-me__text">
          <h3 className="sub">Who I am</h3>
          <p className="lead rv">I’m Meenakshi Bharti, the founder of KARM Practice. While writing my dissertation for an MSc in International Relations at the London School of Economics and Political Science, I kept asking one question: <em>how can this change anything in practice?</em> I’ve been working on the answer ever since.</p>
        </div>
      </div>

      <div className="block about-path">
        <p className="body rv">I went on to work in knowledge exchange and open research at the same university. I led the rebuild of how the Centre for Philosophy of Natural and Social Science shared its research with the public. I delivered a £5,000 research-culture project funded through the LSE’s Summer of Research Culture Grant. With CIVICA, I turned UK and EU open-research policy into briefings and training adopted by over 100 researchers and professional staff across ten partner institutions.</p>
        <p className="lead rv">Those roles taught me the same lesson from different angles. <span className="hl">Good research rarely travels on its own.</span> It travels through people, timing and trust, and it helps to plan for that early rather than hope for it at the end.</p>
      </div>

      <div className="block about-today">
        <p className="body rv">Today I’m writing <em>Where Does My Research Go?</em>, a book about what happens to research after it’s published. I’m also developing frameworks to understand where a project’s journey to impact moves forward and where it stalls, and I offer advisory work to research teams who want to use them.</p>
        <blockquote className="quote rv">
          <p>“Knowledge enables research, and research enables a way forward. <span className="hl">What happens after publication decides whether it arrives.</span>”</p>
          <cite>Meenakshi Bharti</cite>
        </blockquote>
      </div>

      <div className="block row about-name">
        <div className="col">
          <h3 className="sub">Why “KARM Practice”</h3>
          <p className="body rv">The name says what the work is. KARM stands for Knowledge and Research Mobilisation: the effort to get knowledge into use, by connecting a finding to the people who can act on it. The word practice is chosen on purpose. It means a working practice, something I do with real projects and real people. It also means practising: trying things, noticing what happens, and getting better. I don’t think mobilisation can be learned from theory alone, so the practice is also how I learn.</p>
        </div>
        <p className="deva" lang="sa">कर्म<small lang="en-GB">karma</small></p>
        <div className="col">
          <h3 className="sub">The word behind the name</h3>
          <p className="body rv">KARM echoes the Sanskrit karma (<span lang="sa">कर्म</span>), which comes from the root kṛ (<span lang="sa">कृ</span>), meaning “to do”, “to make” or “to act”. At its simplest, karma is action, and what follows from it. That is close to how I think about research. A finding on its own is knowledge at rest. It becomes something more when someone acts on it, and what follows is where its value shows. Mobilisation is the part in between: the doing.</p>
        </div>
      </div>

      <div className="block about-talk">
        <h3 className="sub">Work with me, or just talk</h3>
        <p className="body rv">I currently offer advisory work and plan to grow it into wider services. For now, this site is a place to learn, co-create and talk.</p>
        <p className="body rv">If you have a research story to share, I’d love to hear it. If you have a project and aren’t sure where its journey might stall, write to me at <a href={MAILTO}>{EMAIL}</a>.</p>
        <div className="actions rv">
          <Button href="#journey" arrow>Share your research journey</Button>
        </div>
      </div>
    </section>
  );
}
