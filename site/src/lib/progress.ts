const KEY = "digprog-course-progress-v1";

export type LessonProgress = {
  videoWatched: boolean;
  quizDone: boolean;
  quizCorrect: number;
  quizTotal: number;
  completed: boolean;
};

export type CourseProgress = {
  lessons: Record<string, LessonProgress>;
  lastLessonId: string | null;
};

export function emptyLesson(): LessonProgress {
  return {
    videoWatched: false,
    quizDone: false,
    quizCorrect: 0,
    quizTotal: 0,
    completed: false,
  };
}

export function loadProgress(): CourseProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { lessons: {}, lastLessonId: null };
    return { lessons: {}, lastLessonId: null, ...JSON.parse(raw) };
  } catch {
    return { lessons: {}, lastLessonId: null };
  }
}

export function saveProgress(p: CourseProgress) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function getLessonProgress(p: CourseProgress, id: string): LessonProgress {
  return p.lessons[id] ?? emptyLesson();
}

export function upsertLesson(
  p: CourseProgress,
  id: string,
  patch: Partial<LessonProgress>,
): CourseProgress {
  const prev = getLessonProgress(p, id);
  const next = { ...prev, ...patch };
  next.completed = Boolean(next.quizDone && (next.videoWatched || patch.videoWatched));
  // For lessons without video yet, allow complete via quiz only once video ships;
  // v1: if no video, quizDone alone can complete after explicit practice.
  if (patch.completed === true) next.completed = true;
  return {
    ...p,
    lastLessonId: id,
    lessons: { ...p.lessons, [id]: next },
  };
}

export function countCompleted(p: CourseProgress, lessonIds: string[]) {
  return lessonIds.filter((id) => p.lessons[id]?.completed).length;
}
