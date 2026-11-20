import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { catalog, type CatalogLevel } from "../data/catalog";
import { countCompleted, loadProgress } from "../lib/progress";
import "./Learn.css";

export function Learn() {
  const progress = useMemo(() => loadProgress(), []);
  const [openLevel, setOpenLevel] = useState(1);

  const allIds = catalog.levels.flatMap((l) => l.lessons.map((x) => x.id));
  const doneTotal = countCompleted(progress, allIds);
  const pct = Math.round((doneTotal / Math.max(1, allIds.length)) * 100);

  return (
    <div className="learn">
      <header className="learn-hero">
        <div>
          <p className="learn-kicker">DigProg · one course</p>
          <h1>{catalog.title}</h1>
          <p className="learn-sub">{catalog.subtitle}</p>
        </div>
        <div className="learn-progress-card" aria-label="Course progress">
          <span>Overall progress</span>
          <strong>
            {doneTotal} / {allIds.length} lessons
          </strong>
          <div className="learn-bar">
            <i style={{ width: `${pct}%` }} />
          </div>
          <em>{pct}% complete</em>
        </div>
      </header>

      <p className="learn-note">
        Levels unlock as you complete lessons. Only <strong>L001</strong> has a finished video so
        far — later videos come from Sargis. You can still preview quizzes on early lessons.
      </p>

      <div className="learn-levels">
        {catalog.levels.map((level: CatalogLevel) => {
          const ids = level.lessons.map((l) => l.id);
          const done = countCompleted(progress, ids);
          const open = openLevel === level.level;
          const priorIds = catalog.levels
            .filter((l) => l.level < level.level)
            .flatMap((l) => l.lessons.map((x) => x.id));
          const priorDone = countCompleted(progress, priorIds);
          const unlocked = level.level === 1 || priorDone >= Math.max(1, Math.floor(priorIds.length * 0.5));

          return (
            <section key={level.id} className={`learn-level ${unlocked ? "" : "locked"}`}>
              <button
                type="button"
                className="learn-level-head"
                onClick={() => setOpenLevel(open ? -1 : level.level)}
                aria-expanded={open}
              >
                <div>
                  <span className="learn-level-tag">Level {level.level}</span>
                  <h2>
                    {level.id} · {level.title}
                  </h2>
                  <p>{level.goal}</p>
                </div>
                <div className="learn-level-meta">
                  <strong>
                    {done}/{ids.length}
                  </strong>
                  <span>{unlocked ? (open ? "Hide" : "Show") : "Mostly locked"}</span>
                </div>
              </button>

              {open && (
                <ul className="learn-lesson-list">
                  {level.lessons.map((lesson, idx) => {
                    const lp = progress.lessons[lesson.id];
                    const prevId = idx === 0 ? null : level.lessons[idx - 1].id;
                    const prevDone = !prevId || progress.lessons[prevId]?.completed;
                    const canOpen = unlocked && (idx === 0 || prevDone || lesson.hasVideo);
                    return (
                      <li key={lesson.id} className={lp?.completed ? "done" : ""}>
                        <div>
                          <strong>
                            {lesson.id} · {lesson.title}
                          </strong>
                          <p>{lesson.learningObjective}</p>
                          <span>
                            {lesson.durationLabel} · {lesson.quizQuestionCount} quiz Qs
                            {lesson.hasVideo ? " · video ready" : " · video pending"}
                          </span>
                        </div>
                        {canOpen ? (
                          <Link className="learn-open" to={`/app/learn/${lesson.id}`}>
                            {lp?.completed ? "Review" : "Open"}
                          </Link>
                        ) : (
                          <span className="learn-locked-pill">Complete previous</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
