import { useState } from "react";
import { EMAIL } from "../site.js";
import Button from "./Button.jsx";
import "./Forms.css";

/**
 * Checks a form; once it is complete, `compose` writes it out as an email ({ subject, body })
 * and the form offers ways to send it. Nothing goes through the site: the visitor presses Send.
 */
function useDraft(compose) {
  const [draft, setDraft] = useState(null);
  const onSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setDraft(compose(new FormData(form)));
    // Sideways, the page is laid out to fit the screen: let the engine fit the taller form.
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  };
  return [draft, onSubmit];
}

const field = (data, name) => (data.get(name) || "").trim();
const BLANK = "Not given";

/** The journey written out as an email, laid out like the form. */
function composeJourney(data) {
  const name = field(data, "name");
  const body = [
    "Share your research journey", "",
    "What was the work?", field(data, "work"), "",
    "Where did it go?", field(data, "went") || BLANK, "",
    "Where did it stall?", field(data, "stalled") || BLANK, "",
    "Anything you don’t want me to use?", field(data, "avoid") || BLANK, "",
    `Your name: ${name || BLANK}`,
    `Your institution: ${field(data, "institution") || BLANK}`,
    `Your email: ${field(data, "email")}`,
    `May I show your name? ${data.get("showname") === "show" ? "You may show my name" : "Please keep my name out"}`,
    "I agree to KARM Practice using my story as described in the privacy notice: Yes",
  ].join("\n");
  return { subject: name ? `Research journey from ${name}` : "A research journey", body };
}

/** The sign-up written out as an email. */
function composeSignup(data) {
  const body = [
    "Follow the book & site", "",
    "Please add me to the list for one short email when something new goes up.", "",
    `Your email: ${field(data, "email")}`,
    "I agree to receive short updates about the book and the site, as described in the privacy notice: Yes",
  ].join("\n");
  return { subject: "Please add me to the KARM Practice list", body };
}

/**
 * Ways to send the written email from wherever the visitor reads their mail: Gmail or Outlook
 * on the web, a mail app on the device, or copied to paste anywhere.
 */
function SendOptions({ subject, body }) {
  const [note, setNote] = useState("");
  const to = encodeURIComponent(EMAIL), su = encodeURIComponent(subject), text = encodeURIComponent(body);
  const whole = `To: ${EMAIL}\nSubject: ${subject}\n\n${body}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(whole);
      setNote(`Copied. Paste it into a new email to ${EMAIL}.`);
    } catch {
      setNote("select"); // no clipboard here: show the text to copy by hand
    }
  };
  return (
    <div className="send">
      <div className="actions">
        <Button href={`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${text}`} variant="line" target="_blank" rel="noopener">Gmail</Button>
        <Button href={`https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${su}&body=${text}`} variant="line" target="_blank" rel="noopener">Outlook on the web</Button>
        <Button href={`mailto:${EMAIL}?subject=${su}&body=${encodeURIComponent(body.replace(/\n/g, "\r\n"))}`} variant="line">Mail app</Button>
        <Button type="button" variant="line" onClick={copy}>Copy the email</Button>
      </div>
      {note === "select" ? (
        <textarea className="send__text" readOnly value={whole} aria-label="Your email, to copy" onFocus={(e) => e.target.select()} />
      ) : note ? (
        <p className="status" role="status">{note}</p>
      ) : null}
    </div>
  );
}

/** What a form shows once its email is written: a word on what to do, and the ways to send it. */
function Draft({ draft, what }) {
  return (
    <>
      <p className="status" role="status">{draft ? `Your ${what} is written. Open it where you read your email, check it, and press Send.` : ""}</p>
      {draft && <SendOptions subject={draft.subject} body={draft.body} />}
    </>
  );
}

const PrivacyLink = () => <a href="#privacy">privacy notice</a>;

/** Share your research journey: what happened to a piece of research after publication. */
export function JourneyForm() {
  const [draft, onSubmit] = useDraft(composeJourney);
  return (
    <form className="form form--journey" noValidate onSubmit={onSubmit}>
      <div className="col">
        <div className="field"><label htmlFor="f-work">What was the work?</label><textarea id="f-work" name="work" required /></div>
        <div className="field"><label htmlFor="f-went">Where did it go?</label><textarea id="f-went" name="went" /></div>
      </div>
      <div className="col">
        <div className="field"><label htmlFor="f-stalled">Where did it stall?</label><textarea id="f-stalled" name="stalled" /></div>
        <div className="field"><label htmlFor="f-avoid">Anything you don’t want me to use? <span className="opt">(optional)</span></label><textarea id="f-avoid" name="avoid" /></div>
      </div>
      <div className="col">
        <div className="field"><label htmlFor="f-name">Your name <span className="opt">(optional)</span></label><input id="f-name" name="name" autoComplete="name" /></div>
        <div className="field"><label htmlFor="f-inst">Your institution <span className="opt">(optional)</span></label><input id="f-inst" name="institution" autoComplete="organization" /></div>
        <div className="field"><label htmlFor="f-email">Your email</label><input id="f-email" name="email" type="email" autoComplete="email" required /></div>
      </div>
      <div className="col">
        <fieldset className="field">
          <legend>May I show your name?</legend>
          <label className="choice"><input type="radio" name="showname" value="anonymous" defaultChecked /> Please keep my name out</label>
          <label className="choice"><input type="radio" name="showname" value="show" /> You may show my name</label>
        </fieldset>
        <label className="consent"><input type="checkbox" name="consent" required /> <span>I agree to KARM Practice using my story as described in the <PrivacyLink />.</span></label>
        <div>
          <Button type="submit" arrow>Share my journey</Button>
          <Draft draft={draft} what="journey" />
        </div>
      </div>
    </form>
  );
}

/** One short email when something new goes up. */
export function SignupForm() {
  const [draft, onSubmit] = useDraft(composeSignup);
  return (
    <form className="form form--signup" noValidate onSubmit={onSubmit}>
      <div className="field"><label htmlFor="s-email">Your email</label><input id="s-email" name="email" type="email" autoComplete="email" required /></div>
      <label className="consent"><input type="checkbox" name="consent" required /> <span>I agree to receive short updates about the book and the site, as described in the <PrivacyLink />.</span></label>
      <div>
        <Button type="submit">Follow the book &amp; site</Button>
        <Draft draft={draft} what="sign-up" />
      </div>
    </form>
  );
}
