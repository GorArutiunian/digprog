import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { PublicNav } from "../components/PublicNav";
import { DigProgMark } from "../components/DigProgMark";
import { curriculum, faqs, plans } from "../data";
import "./Landing.css";

type WaitlistState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      discountCode: string;
      discountPercent: number;
      alreadyJoined: boolean;
      message: string;
      emailSent: boolean;
    }
  | { status: "error"; message: string };

const CONTACT = "hello@digprog.app";

export function Landing() {
  const [openModule, setOpenModule] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("start-business");
  const [waitlist, setWaitlist] = useState<WaitlistState>({ status: "idle" });

  async function onJoin(e: FormEvent) {
    e.preventDefault();
    setWaitlist({ status: "loading" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, interest }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWaitlist({ status: "error", message: data.error || "Something went wrong." });
        return;
      }
      setWaitlist({
        status: "success",
        discountCode: data.discountCode,
        discountPercent: data.discountPercent ?? 30,
        alreadyJoined: !!data.alreadyJoined,
        message: data.message,
        emailSent: !!data.emailSent,
      });
    } catch {
      setWaitlist({
        status: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  }

  const mailtoCode =
    waitlist.status === "success"
      ? `mailto:${email}?subject=${encodeURIComponent("My DigProg early-bird code")}&body=${encodeURIComponent(
          `DigProg waitlist code: ${waitlist.discountCode}\nDiscount: ${waitlist.discountPercent}% off at launch\n\nKeep this email — you'll need the code when DigProg opens.\n`,
        )}`
      : "#";

  return (
    <div className="landing digprog-waitlist">
      <PublicNav />

      <section className="hero" id="waitlist">
        <div className="hero-bleed" aria-hidden>
          <div className="hero-grid" />
          <div className="hero-wash" />
        </div>

        <div className="shell hero-stage">
          <div className="hero-copy">
            <div className="hero-brand-row">
              <DigProgMark size={48} />
              <p className="brand-hero">DigProg</p>
            </div>
            <h1 className="display hero-title">
              Learn to start a real business — without the 40-hour water.
            </h1>
            <p className="hero-sub">
              ~100 short lessons, a field guide, and quizzes that make you practice. Join the
              waitlist and lock a <strong>30% early-bird discount</strong> when DigProg opens.
            </p>
            <ul className="hero-includes">
              <li>Customer → offer → delivery framework</li>
              <li>Quizzes that force practice</li>
              <li>Personal worksheets attached</li>
            </ul>
            <p className="hero-contact">
              Questions?{" "}
              <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
            </p>
          </div>

          <div className="waitlist-card" id="join">
            {waitlist.status === "success" ? (
              <div className="waitlist-success" role="status">
                <p className="eyebrow orange">You're in</p>
                <h2>{waitlist.alreadyJoined ? "Welcome back" : "Spot saved"}</h2>
                <p>{waitlist.message}</p>
                <div className="discount-pill">
                  <span>{waitlist.discountPercent}% off</span>
                  <code>{waitlist.discountCode}</code>
                </div>
                {waitlist.emailSent ? (
                  <p className="fine-print">
                    Confirmation sent to <strong>{email}</strong> with your code.
                  </p>
                ) : (
                  <p className="fine-print">
                    Save this code. We also prepared an email you can send yourself:
                  </p>
                )}
                <a className="btn btn-waitlist" href={mailtoCode}>
                  Email me my code
                </a>
                <p className="fine-print muted-tight">
                  Or write us at <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
                </p>
              </div>
            ) : (
              <form className="waitlist-form" onSubmit={onJoin}>
                <p className="eyebrow">Early access waitlist</p>
                <h2>Get 30% off at launch</h2>
                <p className="form-lead">
                  Enter your email. You get a personal discount code — no charge today.
                </p>
                <label>
                  Name <span className="optional">(optional)</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex"
                    autoComplete="name"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                </label>
                <label>
                  I'm mostly here to
                  <select value={interest} onChange={(e) => setInterest(e.target.value)}>
                    <option value="start-business">Start a first business</option>
                    <option value="side-income">Build side income</option>
                    <option value="sell-skills">Sell a skill I already have</option>
                    <option value="team">Build with a small team</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="btn btn-waitlist"
                  disabled={waitlist.status === "loading"}
                >
                  {waitlist.status === "loading" ? "Saving…" : "Join waitlist"}
                </button>
                {waitlist.status === "error" && (
                  <p className="form-error" role="alert">
                    {waitlist.message}
                  </p>
                )}
                <ul className="waitlist-perks">
                  <li>30% early-bird code (waitlist only)</li>
                  <li>First access when enrollment opens</li>
                  <li>Demo lesson available now</li>
                </ul>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="section band" id="problem">
        <div className="shell split wide-split">
          <div>
            <p className="eyebrow">Problem</p>
            <h2 className="section-title">Most “start a business” advice wastes months.</h2>
            <p className="section-lead">
              Giant courses, brand theater, and frameworks with no buyer. DigProg starts with
              customer → offer → delivery → payment evidence.
            </p>
          </div>
          <div className="solution-panel">
            <p className="eyebrow">Solution</p>
            <h3>Short videos. Real practice. A launch loop.</h3>
            <p>
              Watch ~3 minutes, quiz yourself, ship one tiny move. Waitlist members keep the
              early-bird price when enrollment opens.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="curriculum">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="eyebrow">Curriculum</p>
              <h2 className="section-title">About 6 hours. Built to finish.</h2>
            </div>
            <p className="section-lead tight">
              Six modules. Short lessons. Quizzes with 7–10 questions. Personal worksheets attached.
            </p>
          </div>
          <div className="curriculum-list curriculum-grid">
            {curriculum.map((item, index) => {
              const open = openModule === index;
              return (
                <button
                  key={item.module}
                  type="button"
                  className={`curriculum-item ${open ? "open" : ""}`}
                  onClick={() => setOpenModule(open ? -1 : index)}
                  aria-expanded={open}
                >
                  <div className="curriculum-head">
                    <span>{item.module}</span>
                    <strong>{item.title}</strong>
                    <em>
                      {item.lessons} lessons · {item.minutes} min
                    </em>
                  </div>
                  {open && (
                    <div className="curriculum-body">
                      Lesson → practice quiz → next unlock. Full map in the DigProg curriculum
                      package.
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section band" id="pricing">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="eyebrow">Pricing at launch</p>
              <h2 className="section-title">Waitlist = 30% off</h2>
            </div>
            <p className="section-lead tight">
              Your personal code (example: EARLY-A1B2C3) applies at checkout when DigProg opens.
            </p>
          </div>
          <div className="pricing-grid pricing-wide">
            {plans.map((plan) => (
              <article key={plan.id} className={`price-card ${plan.featured ? "featured" : ""}`}>
                {plan.featured && <span className="popular">Most chosen</span>}
                <h3>{plan.name}</h3>
                <p className="price">{plan.price}</p>
                <p className="price-waitlist">
                  Waitlist:{" "}
                  <strong>
                    {plan.id === "simple" ? "$34" : plan.id === "medium" ? "$104" : "$209"}
                  </strong>
                </p>
                <p className="price-blurb">{plan.blurb}</p>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a href="#join" className="btn btn-primary">
                  Save my 30%
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="shell faq-wide">
          <div className="section-head">
            <div>
              <p className="eyebrow">FAQ</p>
              <h2 className="section-title">Straight answers.</h2>
            </div>
          </div>
          <div className="faq-list">
            {[
              {
                q: "What do I get by joining the waitlist?",
                a: "A saved email, a unique 30% early-bird code, and first access when DigProg opens. No charge today.",
              },
              {
                q: "Will you email me?",
                a: `Yes — confirmation when email sending is configured, plus launch instructions. You can always reach us at ${CONTACT}.`,
              },
              {
                q: "Is DigProg live now?",
                a: "Lesson 01 and the classroom demo are available for preview. Full enrollment opens after the waitlist phase.",
              },
              ...faqs,
            ].map((item, index) => {
              const open = openFaq === index;
              return (
                <button
                  key={item.q}
                  type="button"
                  className={`faq-item ${open ? "open" : ""}`}
                  onClick={() => setOpenFaq(open ? null : index)}
                  aria-expanded={open}
                >
                  <span>{item.q}</span>
                  {open && <p>{item.a}</p>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section band teaser-section">
        <div className="shell teaser teaser-wide">
          <div>
            <p className="eyebrow">Preview</p>
            <h2 className="section-title">Try Lesson 01 in the demo classroom.</h2>
          </div>
          <div className="teaser-row">
            <Link to="/app/classroom">Open L01 · What a business is</Link>
            <a href="#join">Join waitlist for 30% off</a>
          </div>
        </div>
      </section>

      <footer className="site-footer digprog-footer">
        <div className="shell footer-wide">
          <div className="footer-brand">
            <DigProgMark size={28} />
            <strong className="brand-name">DigProg</strong>
          </div>
          <p>Waitlist signups stored securely. No fake enrollments.</p>
          <div className="footer-links">
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
            <a href="#join">Join waitlist</a>
            <Link to="/app/classroom">Lesson demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
