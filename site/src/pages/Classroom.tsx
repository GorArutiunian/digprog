import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  l001Lesson,
  l001Outline,
  l001Quiz,
  l001Transcript,
} from "../data/l001";
import "./Classroom.css";

const STORAGE_KEY = "digprog-l001-progress-v1";
const POS_KEY = "digprog-l001-video-pos-v1";

type Progress = {
  quizIndex: number;
  answers: Record<string, string>;
  submitted: Record<string, boolean>;
  application: string;
  applicationChecked: boolean;
  quizComplete: boolean;
};

const defaultProgress = (): Progress => ({
  quizIndex: 0,
  answers: {},
  submitted: {},
  application: "",
  applicationChecked: false,
  quizComplete: false,
});

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function Classroom() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelTab, setPanelTab] = useState<"transcript" | "summary">("transcript");
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [progress, setProgress] = useState<Progress>(() =>
    typeof window !== "undefined" ? loadProgress() : defaultProgress(),
  );
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const saved = Number(localStorage.getItem(POS_KEY) || "0");
    if (saved > 0 && saved < l001Lesson.durationSeconds - 2) {
      v.currentTime = saved;
      setTime(saved);
    }
  }, []);

  const activeSection = useMemo(() => {
    return (
      l001Transcript.find((s) => time >= s.start && time < s.end) ??
      l001Transcript[l001Transcript.length - 1]
    );
  }, [time]);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setTime(v.currentTime);
    if (Math.floor(v.currentTime) % 2 === 0) {
      localStorage.setItem(POS_KEY, String(v.currentTime));
    }
  };

  const seekTo = useCallback((t: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = t;
    setTime(t);
  }, []);

  const skip = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || l001Lesson.durationSeconds, v.currentTime + delta));
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowRight" || e.key === "l") {
      e.preventDefault();
      skip(10);
    } else if (e.key === "ArrowLeft" || e.key === "j") {
      e.preventDefault();
      skip(-10);
    } else if (e.key === "c") {
      setPanelOpen((o) => !o);
    }
  };

  const question = l001Quiz.questions[progress.quizIndex];
  const scoredCorrect = l001Quiz.questions.filter(
    (q) => progress.submitted[q.id] && progress.answers[q.id] === q.correct,
  ).length;

  const submitAnswer = () => {
    if (!question || !progress.answers[question.id]) return;
    setProgress((p) => ({
      ...p,
      submitted: { ...p.submitted, [question.id]: true },
    }));
  };

  const nextQuestion = () => {
    if (progress.quizIndex < l001Quiz.questions.length - 1) {
      setProgress((p) => ({ ...p, quizIndex: p.quizIndex + 1 }));
    } else {
      setProgress((p) => ({ ...p, quizComplete: true }));
    }
  };

  const retryQuestion = () => {
    if (!question) return;
    setProgress((p) => {
      const answers = { ...p.answers };
      const submitted = { ...p.submitted };
      delete answers[question.id];
      delete submitted[question.id];
      return { ...p, answers, submitted, quizComplete: false };
    });
  };

  return (
    <div className="l01" onKeyDown={onKeyDown} tabIndex={0}>
      <aside className="l01-nav" aria-label="Course outline">
        <p className="l01-nav-label">DigProg · Foundations</p>
        <ul>
          {l001Outline.map((item) => (
            <li key={item.id} className={item.current ? "current" : ""}>
              <span>{item.id}</span>
              {item.title}
            </li>
          ))}
        </ul>
        <p className="l01-nav-note">Only L01 is available in this build.</p>
      </aside>

      <div className="l01-main">
        <header className="l01-header">
          <div>
            <p className="l01-eyebrow">{l001Lesson.module}</p>
            <h1>{l001Lesson.title}</h1>
            <p className="l01-objective">
              <strong>Objective:</strong> {l001Lesson.objective}
            </p>
          </div>
          <div className="l01-meta">
            <span>{l001Lesson.durationLabel}</span>
            <span>
              Progress {Math.min(100, Math.round((time / l001Lesson.durationSeconds) * 100))}%
            </span>
          </div>
        </header>

        <div className={`l01-stage ${panelOpen ? "with-panel" : "solo"}`}>
          <section className="l01-player" aria-label="Lesson video">
            {videoError ? (
              <div className="l01-video-error" role="alert">
                Video failed to load. Check `/lessons/L001/video.mp4`.
              </div>
            ) : (
              <video
                ref={videoRef}
                className="l01-video"
                poster={l001Lesson.posterSrc}
                preload="metadata"
                playsInline
                onTimeUpdate={onTimeUpdate}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onError={() => setVideoError(true)}
                onEnded={() => localStorage.setItem(POS_KEY, "0")}
              >
                <source src={l001Lesson.videoSrc} type="video/mp4" />
                <track
                  kind="captions"
                  src={l001Lesson.captionsSrc}
                  srcLang="en"
                  label="English"
                  default
                />
              </video>
            )}

            <div className="l01-controls" role="toolbar" aria-label="Playback controls">
              <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" onClick={() => skip(-10)} aria-label="Back 10 seconds">
                −10s
              </button>
              <button type="button" onClick={() => skip(10)} aria-label="Forward 10 seconds">
                +10s
              </button>
              <input
                type="range"
                min={0}
                max={l001Lesson.durationSeconds}
                step={0.1}
                value={time}
                onChange={(e) => seekTo(Number(e.target.value))}
                aria-label="Seek"
                className="l01-seek"
              />
              <span className="l01-time">
                {formatTime(time)} / {l001Lesson.durationLabel}
              </span>
              <label className="l01-speed">
                Speed
                <select
                  value={speed}
                  onChange={(e) => {
                    const s = Number(e.target.value);
                    setSpeed(s);
                    if (videoRef.current) videoRef.current.playbackRate = s;
                  }}
                >
                  {[0.75, 1, 1.25, 1.5].map((s) => (
                    <option key={s} value={s}>
                      {s}×
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="l01-ghost"
                onClick={() => setPanelOpen((o) => !o)}
                aria-pressed={panelOpen}
              >
                {panelOpen ? "Hide panel" : "Show panel"}
              </button>
              <button
                type="button"
                className="l01-ghost"
                onClick={() => videoRef.current?.requestFullscreen?.()}
              >
                Fullscreen
              </button>
            </div>
          </section>

          {panelOpen && (
            <aside className="l01-panel" aria-label="Transcript and summary">
              <div className="l01-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={panelTab === "transcript"}
                  className={panelTab === "transcript" ? "active" : ""}
                  onClick={() => setPanelTab("transcript")}
                >
                  Transcript
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={panelTab === "summary"}
                  className={panelTab === "summary" ? "active" : ""}
                  onClick={() => setPanelTab("summary")}
                >
                  Summary
                </button>
              </div>
              {panelTab === "transcript" ? (
                <div className="l01-transcript">
                  {l001Transcript.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      className={`l01-cue ${activeSection?.id === section.id ? "active" : ""}`}
                      onClick={() => seekTo(section.start)}
                    >
                      <span className="l01-cue-time">{formatTime(section.start)}</span>
                      <span className="l01-cue-title">{section.title}</span>
                      <span className="l01-cue-text">{section.text}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="l01-summary">
                  <p>{l001Lesson.summary}</p>
                  <ul>
                    <li>Customer → Offer → Delivery</li>
                    <li>Maya: designers · $79 guide · download</li>
                    <li>Interest ≠ paying demand</li>
                  </ul>
                </div>
              )}
            </aside>
          )}
        </div>

        <div className="l01-actions">
          <button
            type="button"
            className="l01-cta"
            onClick={() => {
              setPracticeOpen(true);
              videoRef.current?.pause();
            }}
          >
            Start practice
          </button>
          <span className="l01-nav-links">
            <span className="disabled">Previous</span>
            <span className="disabled">Next</span>
          </span>
        </div>

        {practiceOpen && (
          <section className="l01-practice" aria-label="Practice quiz" id="practice">
            <div className="l01-practice-head">
              <h2>Practice</h2>
              <p>One question at a time. Feedback appears after you submit.</p>
            </div>

            {!progress.quizComplete && question ? (
              <div className="l01-question">
                <p className="l01-q-meta">
                  Question {progress.quizIndex + 1} of {l001Quiz.questions.length}
                </p>
                <h3>{question.prompt}</h3>
                <fieldset disabled={!!progress.submitted[question.id]}>
                  {question.choices.map((choice) => (
                    <label key={choice.id} className="l01-choice">
                      <input
                        type="radio"
                        name={question.id}
                        value={choice.id}
                        checked={progress.answers[question.id] === choice.id}
                        onChange={() =>
                          setProgress((p) => ({
                            ...p,
                            answers: { ...p.answers, [question.id]: choice.id },
                          }))
                        }
                      />
                      <span>{choice.text}</span>
                    </label>
                  ))}
                </fieldset>

                {!progress.submitted[question.id] ? (
                  <button
                    type="button"
                    className="l01-cta"
                    disabled={!progress.answers[question.id]}
                    onClick={submitAnswer}
                  >
                    Submit answer
                  </button>
                ) : (
                  <div
                    className={`l01-feedback ${
                      progress.answers[question.id] === question.correct ? "ok" : "bad"
                    }`}
                  >
                    <p>
                      <strong>
                        {progress.answers[question.id] === question.correct
                          ? "Correct"
                          : "Not quite"}
                      </strong>
                    </p>
                    <p>{question.feedback}</p>
                    <div className="l01-feedback-actions">
                      <button type="button" className="l01-ghost" onClick={retryQuestion}>
                        Retry
                      </button>
                      <button type="button" className="l01-cta" onClick={nextQuestion}>
                        {progress.quizIndex < l001Quiz.questions.length - 1
                          ? "Next question"
                          : "Finish scored questions"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="l01-complete">
                <h3>Scored questions complete</h3>
                <p>
                  You got {scoredCorrect} of {l001Quiz.questions.length} correct.
                </p>
                <div className="l01-application">
                  <h4>Optional application</h4>
                  <p>{l001Quiz.application.prompt}</p>
                  <textarea
                    rows={5}
                    value={progress.application}
                    onChange={(e) =>
                      setProgress((p) => ({ ...p, application: e.target.value }))
                    }
                    placeholder="Customer · offer + price · delivery"
                  />
                  <ul className="l01-rubric">
                    {l001Quiz.application.rubric.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <p className="l01-note">{l001Quiz.application.note}</p>
                  <button
                    type="button"
                    className="l01-cta"
                    onClick={() =>
                      setProgress((p) => ({ ...p, applicationChecked: true }))
                    }
                  >
                    Mark self-check done
                  </button>
                  {progress.applicationChecked && (
                    <p className="l01-done-msg" role="status">
                      Lesson practice complete for this device (local storage).
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
