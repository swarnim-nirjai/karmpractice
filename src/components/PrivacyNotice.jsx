import { useEffect, useRef } from "react";
import { EMAIL, MAILTO } from "../site.js";
import "./PrivacyNotice.css";

const Email = () => <a href={MAILTO}>{EMAIL}</a>;

/**
 * The privacy notice, opened from #privacy links. On wide screens it reads sideways in
 * columns, like the rest of the site; on phones it is a sheet that scrolls down.
 */
export default function PrivacyNotice({ ref }) {
  const columns = useRef(null);

  useEffect(() => {
    const el = columns.current;
    const onWheel = (e) => {
      const stack = document.documentElement.classList.contains("stack");
      if (stack || Math.abs(e.deltaX) > Math.abs(e.deltaY) || el.scrollWidth <= el.clientWidth + 2) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 36 : 1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <dialog className="privacy" id="privacy" ref={ref} aria-labelledby="privacy-title">
      <div className="privacy__sheet">
        <div className="privacy__head">
          <div>
            <p className="label">Last updated: 7 November 2026</p>
            <h2 className="privacy__title" id="privacy-title">Privacy notice</h2>
          </div>
          <form method="dialog">
            <button className="btn btn--line">Close</button>
          </form>
        </div>
        <div className="privacy__columns" ref={columns}>
          <section>
            <p><strong>Who I am.</strong> This site is run by Meenakshi Bharti (“I”) for KARM Practice (Knowledge and Research Mobilisation). You can reach me at <Email />.</p>
          </section>
          <section>
            <h3 className="sub">What I collect, and why</h3>
            <ul>
              <li><strong>“Share your research journey” form.</strong> I collect what you tell me about your work and where it went or stalled, your name, your email address, and your institution, and your choices about how I may use your story. I use this to understand research journeys and, only if you agree, to write about yours in my book and on this site.</li>
              <li><strong>Email sign-up.</strong> I collect your email address only. I use it to send short updates about the book and the site.</li>
              <li><strong>If you email me.</strong> I keep your email address and what you write, so I can reply.</li>
            </ul>
          </section>
          <section>
            <h3 className="sub">How I use your story</h3>
            <p>Nothing you share will appear anywhere without your agreement. You choose what I can use and whether your name is shown, and you can review anything before it is published.</p>
          </section>
          <section>
            <h3 className="sub">Who sees your data</h3>
            <p>I don’t sell your data. It is held by the tools that run this site, which handle it on my behalf. I won’t share it with anyone else unless you ask me to or the law requires it.</p>
          </section>
          <section>
            <h3 className="sub">How long I keep it</h3>
            <ul>
              <li>Sign-up emails: until you unsubscribe.</li>
              <li>Journey submissions: until the book is finished, or until you ask me to delete it.</li>
              <li>Emails to me: 8 months after our last message.</li>
            </ul>
          </section>
          <section>
            <h3 className="sub">Your choices</h3>
            <p>You can withdraw your consent at any time. Use the unsubscribe link in any update, or email <Email />, and it will be as easy as signing up. You can also ask to see, correct or delete what I hold about you. Before publication, you can change or withdraw your story. After publication, I will remove it from the site and from future editions if you ask, though I can’t recall copies already printed.</p>
          </section>
          <section>
            <h3 className="sub">Questions or complaints</h3>
            <p>Write to me first at <Email />, and I will reply within 5 days. You can also complain to the Data Protection Board of India.</p>
          </section>
          <section>
            <h3 className="sub">Children</h3>
            <p>This site is for adults and is not meant for anyone under 18.</p>
          </section>
          <section>
            <h3 className="sub">Changes</h3>
            <p>If I change this notice, I will update the date above.</p>
          </section>
        </div>
      </div>
    </dialog>
  );
}
