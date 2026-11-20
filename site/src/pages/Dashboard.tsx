import { Link } from "react-router-dom";
import { announcements, roadmap } from "../data";
import "./Dashboard.css";

export function Dashboard() {
  return (
    <div className="dashboard member-grid">
      <section className="panel resume-panel">
        <p className="eyebrow mint">Continue learning</p>
        <h2>Problem hunting in public</h2>
        <p className="muted">Module 02 · Lesson 1 of 12 · ~3 min</p>
        <div className="progress-wrap">
          <div className="progress-meta">
            <span>Course progress</span>
            <strong>34%</strong>
          </div>
          <div className="progress-bar">
            <i style={{ width: "34%" }} />
          </div>
        </div>
        <Link to="/app/classroom" className="btn btn-mint">
          Resume classroom
        </Link>
      </section>

      <section className="panel roadmap-panel">
        <h2>10-step launch roadmap</h2>
        <ol className="roadmap">
          {roadmap.map((step, index) => (
            <li key={step} className={index < 3 ? "done" : index === 3 ? "current" : ""}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="panel rewards-panel">
        <h2>Streak & rewards</h2>
        <div className="reward-row">
          <div>
            <strong>6</strong>
            <span>day streak</span>
          </div>
          <div>
            <strong>420</strong>
            <span>XP points</span>
          </div>
          <div>
            <strong>2</strong>
            <span>badges</span>
          </div>
        </div>
        <p className="muted">Sample gamification — not connected to a backend.</p>
      </section>

      <section className="panel announce-panel">
        <h2>Pinned announcements</h2>
        <ul>
          {announcements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel tasks-panel">
        <h2>Pro daily tasks</h2>
        <p className="muted">Generated from onboarding interest · sample data</p>
        <ul className="task-list">
          <li className="done">Message 3 people who have the problem</li>
          <li>Draft one-line offer for Local services</li>
          <li>Price a starter package under $200</li>
        </ul>
      </section>
    </div>
  );
}
