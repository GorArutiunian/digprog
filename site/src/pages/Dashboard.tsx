import { useMemo } from "react";
import { Link } from "react-router-dom";
import { allLessons, catalog } from "../data/catalog";
import { countCompleted, loadProgress } from "../lib/progress";
import { roadmap } from "../data";
import "./Dashboard.css";

export function Dashboard() {
  const progress = useMemo(() => loadProgress(), []);
  const lessons = allLessons();
  const allIds = lessons.map((x) => x.id);
  const done = countCompleted(progress, allIds);
  const pct = Math.round((done / Math.max(1, allIds.length)) * 100);
  const resumeId = progress.lastLessonId || "L001";
  const resumeTitle =
    lessons.find((l) => l.id === resumeId)?.title || "What a business is";

  return (
    <div className="dashboard member-grid">
      <section className="panel resume-panel">
        <p className="eyebrow mint">Continue learning</p>
        <h2>
          {resumeId} · {resumeTitle}
        </h2>
        <p className="muted">
          {done} / {allIds.length} lessons complete · {catalog.levels.length} levels
        </p>
        <div className="progress-wrap">
          <div className="progress-meta">
            <span>Course progress</span>
            <strong>{pct}%</strong>
          </div>
          <div className="progress-bar">
            <i style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link to={`/app/learn/${resumeId}`} className="btn btn-mint">
            Resume lesson
          </Link>
          <Link to="/app/learn" className="btn btn-ghost-light">
            All levels
          </Link>
        </div>
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

      <section className="panel announce-panel">
        <h2>Build status</h2>
        <ul>
          <li>All 100 lesson videos live</li>
          <li>Quizzes ready across the full catalog</li>
          <li>Progress saved on this device (local)</li>
        </ul>
      </section>
    </div>
  );
}
