import { useState } from "react";
import type { FormEvent } from "react";
import { events } from "../data";
import "./LiveEvents.css";

export function LiveEvents() {
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSent(true);
    setQuestion("");
  }

  return (
    <div className="live member-grid">
      <section className="panel live-banner">
        <p className="eyebrow mint">Upcoming</p>
        <h2>Office hours with the creator</h2>
        <p className="muted">Thu · 6:00 PM PT · Zoom link placeholder</p>
        <button type="button" className="btn btn-mint">
          Add calendar reminder · mock
        </button>
      </section>

      <section className="panel">
        <h2>Ask a question</h2>
        <form onSubmit={onSubmit} className="ask-form">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What’s blocking your first sale?"
            rows={4}
            required
          />
          <button className="btn btn-primary" type="submit">
            Submit question · fake
          </button>
          {sent && <p className="mint">Queued for the next live call (sample).</p>}
        </form>
      </section>

      <section className="panel archive-panel">
        <h2>Replay archive</h2>
        <ul>
          {events.map((ev) => (
            <li key={ev.title}>
              <div>
                <strong>{ev.title}</strong>
                <span className="muted">{ev.when}</span>
              </div>
              <button type="button" className="btn btn-ghost-light">
                {ev.status === "Upcoming" ? "Details" : "Watch replay"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
