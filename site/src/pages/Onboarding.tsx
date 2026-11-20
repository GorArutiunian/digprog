import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

const interests = [
  "Local services",
  "Digital product / course",
  "Agency / freelancing",
  "E-commerce niche",
  "Not sure yet",
];

export function Onboarding() {
  const navigate = useNavigate();
  const [stepDone, setStepDone] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStepDone(true);
    window.setTimeout(() => navigate("/app"), 650);
  }

  return (
    <div className="onboarding-page atmosphere">
      <form className="onboarding-card" onSubmit={onSubmit}>
        <p className="eyebrow">Pro onboarding · 3 questions</p>
        <h1 className="display">What business do you want?</h1>
        <p className="lead">
          Sample survey. Pro analyzes answers into daily assigned tasks after book/quiz progress.
        </p>

        <fieldset>
          <legend>1. Business interest</legend>
          <div className="choice-grid">
            {interests.map((item, index) => (
              <label key={item} className="choice">
                <input type="radio" name="interest" defaultChecked={index === 0} required />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="stack">
          2. Timezone
          <select defaultValue="America/Los_Angeles" required>
            <option>America/Los_Angeles</option>
            <option>America/New_York</option>
            <option>Europe/London</option>
            <option>Asia/Yerevan</option>
          </select>
        </label>

        <label className="stack">
          3. Weekly time commitment
          <select defaultValue="5-7 hours" required>
            <option>2-4 hours</option>
            <option>5-7 hours</option>
            <option>8-12 hours</option>
            <option>12+ hours</option>
          </select>
        </label>

        <button className="btn btn-primary" type="submit" disabled={stepDone}>
          {stepDone ? "Building your task path…" : "Enter DigProg"}
        </button>
      </form>
    </div>
  );
}
