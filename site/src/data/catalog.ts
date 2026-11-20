import raw from "./courseCatalog.json";

export type CatalogLesson = {
  id: string;
  title: string;
  durationSeconds: number;
  durationLabel: string;
  contentSummary: string;
  learningObjective: string;
  hasVideo: boolean;
  videoSrc: string | null;
  posterSrc: string | null;
  captionsSrc: string | null;
  quizQuestionCount: number;
  personalAttachment: {
    type: string;
    title: string;
    file_stub: string;
    prompt: string;
  } | null;
  quiz?: {
    questionCount: number;
    questions: {
      prompt: string;
      choices: { id: string; text: string }[];
      correct: string;
      feedback: string;
    }[];
  };
};

export type CatalogLevel = {
  id: string;
  level: number;
  title: string;
  goal: string;
  lessons: CatalogLesson[];
};

export type CourseCatalog = {
  product: string;
  title: string;
  subtitle: string;
  levels: CatalogLevel[];
};

export const catalog = raw as CourseCatalog;

export function allLessons() {
  return catalog.levels.flatMap((l) => l.lessons);
}

export function findLesson(id: string) {
  for (const level of catalog.levels) {
    const lesson = level.lessons.find((l) => l.id === id);
    if (lesson) return { level, lesson };
  }
  return null;
}
