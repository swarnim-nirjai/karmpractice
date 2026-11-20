import Button from "../components/Button.jsx";
import Drawing from "../components/Drawing.jsx";
import { EMAIL, MAILTO } from "../site.js";
import "./Practice.css";

const PATTERNS = [
  ["Relationships beat dissemination alone.", "Briefs and reviews work best when paired with real contact and networks."],
  ["Brokers, co-production and advisory bodies help.", "Someone who already has a seat at the table often matters more than another publication."],
  ["Timing matters.", "Influence depends on a window where attention, a workable solution and willingness to act meet. You plan for it, respond when it opens, and keep relationships warm when it closes."],
  ["Every route is different.", "Policy change, practice change, commercialisation and follow-on research need different conditions, so one pathway diagram rarely fits all four."],
  ["Contribution, not attribution.", "The honest claim is a plausible, corroborated contribution to a change. Counts and attention scores are pointers to evidence, not evidence."],
];

const STEPS = [
  ["Define the change.", "One sentence per intended change: who does what differently, where and by when. For example, “a state health department team changes how it screens referrals, by March next year.” If the actor and the behaviour can’t be named, there isn’t yet an impact pathway."],
  ["Diagnose the route.", "I test four routes (policy influence, practice change, commercialisation and follow-on research) and pick a primary one. Most social science projects have a strong policy or practice route and a weaker commercial one, and it helps to see that early."],
  ["Mobilise through relationships.", "I map the audiences, the receiving organisation and the brokers, then attach an action to each link in the chain, with an owner, a date and a target user."],
  ["Capture contribution evidence.", "Contacts, decisions and changes are logged as they happen, and the people who know the change are invited to confirm it in their own words."],
];

const OFFERS = [
  ["Diagnosis", "A structured look at your project’s routes, relationships and timing.", "You receive a written pathway report and one named priority action."],
  ["Delivery", "Help turning the plan into practice: mapping audiences, writing briefs, translating and summarising for different readers, and running workshops.", "You receive an action plan with owners, dates and target users, and a library of finished products."],
  ["Evidence capture", "I log contacts, decisions and outcomes as the work happens, so you don’t have to rebuild the story later.", "You receive a transparent evidence trail that shows what is corroborated and what is not."],
  ["Reporting", "Milestone and end-of-project reports that show what changed in the pathway, plus draft case-study material built on verified evidence and summaries in the format your funder asks for."],
  ["Ongoing support", "Advisory support after the main work ends, notes on implementation, and training for the people inside your organisation who will keep the change going."],
];

const STATUSES = ["Corroborated", "Requested", "Not requested", "Declined"];

const AUDIENCES = [
  "Research teams who want their work to matter beyond the journal page.",
  "Research offices and institutes who need to show how research leads to change, and want a consistent way to do it across projects.",
  "Funders who want honest, corroborated accounts of contribution rather than a count of outputs.",
];

export default function Practice() {
  return (
    <section className="chapter" id="practice" aria-labelledby="practice-title">
      <div className="block row banner">
        <div className="banner__text">
          <h2 className="display display--xl" id="practice-title" data-drift>The Practice</h2>
          <p className="banner__ask">Is it rigorous?<br /><em>or</em> Is anyone using it?</p>
          <p className="sub">From findings to real-world change</p>
          <p className="body">KARM Practice helps a research team plan the route from its findings to real-world change, test that route while there is still time to act, and keep honest evidence of what happened along the way.</p>
        </div>
        <Drawing name="practice" label="One-line drawing: a figure finding a way through a maze of paths." />
      </div>

      <div className="block practice-problem">
        <h3 className="sub">The problem I work on</h3>
        <p className="body rv">Most research projects have a plan for publication. Far fewer have a plan for use. The intended change is often described as “informing” or “raising awareness”, nobody is named as responsible for what happens next, and the evidence of what changed is reconstructed from memory at the end of a grant.</p>
        <p className="lead rv"><span className="hl">That is a gap in planning, not in effort.</span> It can be closed, and the earlier the better.</p>
      </div>

      <div className="block practice-think">
        <h3 className="sub">How I think about it</h3>
        <p className="body rv">My approach rests on five patterns from the research on how evidence gets used. None is proven as a cause. Each is the best-supported pattern across reviews and evaluations.</p>
        <ul className="items">
          {PATTERNS.map(([title, text]) => <li key={title} className="rv"><strong>{title}</strong>{text}</li>)}
        </ul>
        <div className="knots" data-art="knots" data-items=".items li" />
      </div>

      <div className="block practice-method">
        <h3 className="sub">The method in four steps</h3>
        <ol className="items">
          {STEPS.map(([title, text]) => <li key={title} className="rv"><strong>{title}</strong>{text}</li>)}
        </ol>
        <div className="knots" data-art="knots" data-items=".items li" />
      </div>

      <div className="block practice-offer">
        <h3 className="sub">What I offer</h3>
        <ul className="offers">
          {OFFERS.map(([title, text, receive]) => (
            <li key={title} className="rv"><strong>{title}</strong>{text}{receive && <em>{receive}</em>}</li>
          ))}
        </ul>
      </div>

      <div className="block practice-evidence">
        <div>
          <h3 className="sub">How I handle evidence</h3>
          <p className="body rv">Every claim in my reports carries a visible status: corroborated, requested, not requested or declined. Anyone named in a story or case has agreed to its use, and the scope of that agreement is recorded. I don’t produce a single “impact score” and I don’t calculate how much of a change belongs to one project. Reports never imply impact that has not occurred, and uncorroborated claims are labelled as such.</p>
          <ul className="chips" aria-hidden="true">
            {STATUSES.map((status) => <li key={status}>{status}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="sub">Who it’s for</h3>
          <ul className="audiences">
            {AUDIENCES.map((audience) => <li key={audience} className="rv">{audience}</li>)}
          </ul>
        </div>
      </div>

      <div className="block practice-start" id="conversation">
        <h3 className="sub">Start a conversation</h3>
        <p className="lead rv">I’m taking on a small number of pilot projects.</p>
        <p className="body rv">If you have a project, a question or a stalled finding, write to me at <a href={MAILTO}>{EMAIL}</a>. You can also share your research journey to help shape the book.</p>
        <div className="actions rv">
          <Button href={MAILTO} arrow>Email me</Button>
          <Button href="#journey" variant="line">Share your research journey</Button>
        </div>
      </div>
    </section>
  );
}
