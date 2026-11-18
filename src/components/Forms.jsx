import { useState } from "react";
import Button from "./Button.jsx";
import "./Forms.css";

/** Checks a form and acknowledges it. The forms are not connected to a service yet. */
function useSubmit() {
  const [status, setStatus] = useState("");
  const onSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Send the form to the chosen form or email service here.
    setStatus("Thank you. This form isn’t connected yet, so nothing has been sent.");
  };
  return [status, onSubmit];
}

const PrivacyLink = () => <a href="#privacy">privacy notice</a>;

/** Share your research journey: what happened to a piece of research after publication. */
export function JourneyForm() {
  const [status, onSubmit] = useSubmit();
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
          <p className="status" role="status">{status}</p>
        </div>
      </div>
    </form>
  );
}

/** One short email when something new goes up. */
export function SignupForm() {
  const [status, onSubmit] = useSubmit();
  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      <div className="field"><label htmlFor="s-email">Your email</label><input id="s-email" name="email" type="email" autoComplete="email" required /></div>
      <label className="consent"><input type="checkbox" name="consent" required /> <span>I agree to receive short updates about the book and the site, as described in the <PrivacyLink />.</span></label>
      <div>
        <Button type="submit">Follow the book &amp; site</Button>
        <p className="status" role="status">{status}</p>
      </div>
    </form>
  );
}
