import { useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { findLesson } from "../data/catalog";
import {
  getLessonProgress,
  loadProgress,
  saveProgress,
  upsertLesson,
} from "../lib/progress";
import "./Lesson.css";

type QuizQ = {
  prompt: string;
  choices: { id: string; text: string }[];
  correct: string;
  feedback: string;
};

export function Lesson() {
  const { lessonId = "" } = useParams();
  const lesson = useMemo(() => findLesson(lessonId), [lessonId]);

  const [progress, setProgress] = useState(() => loadProgress());
  const lp = getLessonProgress(progress, lessonId);
  const videoRef = useRef<HTMLVideoElement>(null);

  const questions: QuizQ[] = lesson?.lesson.quiz?.questions ?? [];
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(lp.quizDone);

  if (!lesson) return <Navigate to="/app/learn" replace />;

  const { lesson: L, level } = lesson;
  const q = questions[qIndex];

  function persist(next: ReturnType<typeof loadProgress>) {
    saveProgress(next);
    setProgress(next);
  }

  function markVideoWatched() {
    const next = upsertLesson(progress, L.id, {
      videoWatched: true,
      completed: Boolean(lp.quizDone && true),
    });
    // completion: video + quiz for hasVideo; quiz-only preview doesn't complete without video
    const cur = getLessonProgress(next, L.id);
    next.lessons[L.id] = {
      ...cur,
      completed: L.hasVideo ? cur.videoWatched && cur.quizDone : cur.quizDone,
    };
    persist(next);
  }

  function submitCurrent() {
    if (!q || !answers[qIndex]) return;
    setSubmitted((s) => ({ ...s, [qIndex]: true }));
  }

  function nextQuestion() {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
      return;
    }
    const correct = questions.reduce(
      (n, qq, i) => n + (answers[i] === qq.correct ? 1 : 0),
      0,
    );
    const next = upsertLesson(progress, L.id, {
      quizDone: true,
      quizCorrect: correct,
      quizTotal: questions.length,
      videoWatched: L.hasVideo ? getLessonProgress(progress, L.id).videoWatched : true,
    });
    const cur = getLessonProgress(next, L.id);
    next.lessons[L.id] = {
      ...cur,
      completed: L.hasVideo ? cur.videoWatched && true : true,
    };
    persist(next);
    setQuizFinished(true);
  }

  function retryQuestion() {
    setAnswers((a) => {
      const copy = { ...a };
      delete copy[qIndex];
      return copy;
    });
    setSubmitted((s) => {
      const copy = { ...s };
      delete copy[qIndex];
      return copy;
    });
  }

  const idxInLevel = level.lessons.findIndex((x) => x.id === L.id);
  const nextLesson = level.lessons[idxInLevel + 1];

  return (
    <div className="lesson">
      <div className="lesson-top">
        <Link to="/app/learn" className="lesson-back">
          ← All levels
        </Link>
        <div>
          <p className="lesson-kicker">
            Level {level.level} · {level.title}
          </p>
          <h1>
            {L.id} · {L.title}
          </h1>
          <p className="lesson-objective">
            <strong>Objective:</strong> {L.learningObjective}
          </p>
        </div>
      </div>

      <div className="lesson-grid">
        <section className="lesson-main">
          {L.hasVideo && L.videoSrc ? (
            <div className="lesson-player">
              <video
                ref={videoRef}
                className="lesson-video"
                poster={L.posterSrc ?? undefined}
                controls
                playsInline
                preload="metadata"
                onEnded={markVideoWatched}
              >
                <source src={L.videoSrc} type="video/mp4" />
                {L.captionsSrc && (
                  <track kind="captions" src={L.captionsSrc} srcLang="en" label="English" default />
                )}
              </video>
              <div className="lesson-player-meta">
                <span>{L.durationLabel}</span>
                <button type="button" onClick={markVideoWatched}>
                  Mark video watched
                </button>
              </div>
            </div>
          ) : (
            <div className="lesson-pending">
              <h2>Video pending (Sargis)</h2>
              <p>{L.contentSummary}</p>
              <p>
                Narration / Remotion still to shoot. You can preview the practice quiz below while
                the video is in production.
              </p>
            </div>
          )}

          <article className="lesson-summary">
            <h2>What this lesson covers</h2>
            <p>{L.contentSummary}</p>
            {L.personalAttachment && (
              <p className="lesson-attach">
                Personal attachment: <strong>{L.personalAttachment.title}</strong>
              </p>
            )}
          </article>
        </section>

        <aside className="lesson-side">
          <div className="lesson-status">
            <div className={lp.videoWatched || !L.hasVideo ? "on" : ""}>
              {L.hasVideo ? "Video" : "Video (later)"}
            </div>
            <div className={lp.quizDone ? "on" : ""}>Practice</div>
            <div className={lp.completed ? "on" : ""}>Complete</div>
          </div>

          <div className="lesson-practice">
            <h2>Practice</h2>
            {!questions.length && (
              <p className="muted">Quiz content ships with this lesson in a later build.</p>
            )}

            {!!questions.length && !quizFinished && q && (
              <>
                <p className="lesson-q-meta">
                  Question {qIndex + 1} of {questions.length}
                </p>
                <h3>{q.prompt}</h3>
                <fieldset disabled={!!submitted[qIndex]}>
                  {q.choices.map((c) => (
                    <label key={c.id} className="lesson-choice">
                      <input
                        type="radio"
                        name={`q-${qIndex}`}
                        checked={answers[qIndex] === c.id}
                        onChange={() => setAnswers((a) => ({ ...a, [qIndex]: c.id }))}
                      />
                      <span>{c.text}</span>
                    </label>
                  ))}
                </fieldset>
                {!submitted[qIndex] ? (
                  <button
                    type="button"
                    className="lesson-cta"
                    disabled={!answers[qIndex]}
                    onClick={submitCurrent}
                  >
                    Submit
                  </button>
                ) : (
                  <div
                    className={`lesson-feedback ${
                      answers[qIndex] === q.correct ? "ok" : "bad"
                    }`}
                  >
                    <p>
                      <strong>{answers[qIndex] === q.correct ? "Correct" : "Not quite"}</strong>
                    </p>
                    <p>{q.feedback}</p>
                    <div className="lesson-feedback-actions">
                      <button type="button" onClick={retryQuestion}>
                        Retry
                      </button>
                      <button type="button" className="lesson-cta" onClick={nextQuestion}>
                        {qIndex < questions.length - 1 ? "Next" : "Finish practice"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {quizFinished && (
              <div className="lesson-done-box">
                <h3>Practice complete</h3>
                <p>
                  Score: {getLessonProgress(progress, L.id).quizCorrect}/
                  {getLessonProgress(progress, L.id).quizTotal || questions.length}
                </p>
                {lp.completed ? (
                  <p className="ok-text">Lesson marked complete on this device.</p>
                ) : (
                  <p className="muted">Watch the video to fully complete this lesson.</p>
                )}
                {nextLesson && (
                  <Link className="lesson-cta linkish" to={`/app/learn/${nextLesson.id}`}>
                    Next: {nextLesson.id}
                  </Link>
                )}
                <Link className="lesson-ghost" to="/app/learn">
                  Back to levels
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
