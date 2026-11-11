import {
  exerciseSchema,
  grammarPointSchema,
  lessonSchema,
  lexemeSchema,
  parseOrThrow,
  unitSchema,
  type ContentBundle,
  type Exercise,
  type GrammarPoint,
  type Lesson,
  type Lexeme,
  type Unit,
} from "./schema";
import { validateContent } from "./validate";
import { a11Grammar } from "./grammar/a1-1";
import { a12Grammar } from "./grammar/a1-2";
import { a21Grammar } from "./grammar/a2-1";
import { a22Grammar } from "./grammar/a2-2";
import { u01Lexemes } from "./lexicon/u01";
import { u02Lexemes } from "./lexicon/u02";
import { u03Lexemes } from "./lexicon/u03";
import { u04Lexemes } from "./lexicon/u04";
import { u05Lexemes } from "./lexicon/u05";
import { u06Lexemes } from "./lexicon/u06";
import { u07Lexemes } from "./lexicon/u07";
import { u08Lexemes } from "./lexicon/u08";
import { u09Lexemes } from "./lexicon/u09";
import { u10Lexemes } from "./lexicon/u10";
import { u11Lexemes } from "./lexicon/u11";
import { u12Lexemes } from "./lexicon/u12";
import { u01ExerciseList, u01Lessons, u01Unit } from "./units/a1-1/u01";
import { u02ExerciseList, u02Lessons, u02Unit } from "./units/a1-1/u02";
import { u03ExerciseList, u03Lessons, u03Unit } from "./units/a1-1/u03";
import { u04ExerciseList, u04Lessons, u04Unit } from "./units/a1-2/u04";
import { u05ExerciseList, u05Lessons, u05Unit } from "./units/a1-2/u05";
import { u06ExerciseList, u06Lessons, u06Unit } from "./units/a1-2/u06";
import { u07ExerciseList, u07Lessons, u07Unit } from "./units/a2-1/u07";
import { u08ExerciseList, u08Lessons, u08Unit } from "./units/a2-1/u08";
import { u09ExerciseList, u09Lessons, u09Unit } from "./units/a2-1/u09";
import { u10ExerciseList, u10Lessons, u10Unit } from "./units/a2-2/u10";
import { u11ExerciseList, u11Lessons, u11Unit } from "./units/a2-2/u11";
import { u12ExerciseList, u12Lessons, u12Unit } from "./units/a2-2/u12";

const rawUnits = [
  u01Unit,
  u02Unit,
  u03Unit,
  u04Unit,
  u05Unit,
  u06Unit,
  u07Unit,
  u08Unit,
  u09Unit,
  u10Unit,
  u11Unit,
  u12Unit,
];
const rawLessons = [
  ...u01Lessons,
  ...u02Lessons,
  ...u03Lessons,
  ...u04Lessons,
  ...u05Lessons,
  ...u06Lessons,
  ...u07Lessons,
  ...u08Lessons,
  ...u09Lessons,
  ...u10Lessons,
  ...u11Lessons,
  ...u12Lessons,
];
const rawExercises = [
  ...u01ExerciseList,
  ...u02ExerciseList,
  ...u03ExerciseList,
  ...u04ExerciseList,
  ...u05ExerciseList,
  ...u06ExerciseList,
  ...u07ExerciseList,
  ...u08ExerciseList,
  ...u09ExerciseList,
  ...u10ExerciseList,
  ...u11ExerciseList,
  ...u12ExerciseList,
];
const rawLexemes = [
  ...u01Lexemes,
  ...u02Lexemes,
  ...u03Lexemes,
  ...u04Lexemes,
  ...u05Lexemes,
  ...u06Lexemes,
  ...u07Lexemes,
  ...u08Lexemes,
  ...u09Lexemes,
  ...u10Lexemes,
  ...u11Lexemes,
  ...u12Lexemes,
];
const rawGrammar = [...a11Grammar, ...a12Grammar, ...a21Grammar, ...a22Grammar];

export const units: Unit[] = rawUnits.map((unit, index) =>
  parseOrThrow(unitSchema, unit, `unit[${index}]`),
);

export const lessons: Lesson[] = rawLessons.map((lesson, index) =>
  parseOrThrow(lessonSchema, lesson, `lesson[${index}]`),
);

export const exercises: Exercise[] = rawExercises.map((exercise, index) =>
  parseOrThrow(exerciseSchema, exercise, `exercise[${index}]`),
);

export const lexemes: Lexeme[] = rawLexemes.map((lexeme, index) =>
  parseOrThrow(lexemeSchema, lexeme, `lexeme[${index}]`),
);

export const grammarPoints: GrammarPoint[] = rawGrammar.map((point, index) =>
  parseOrThrow(grammarPointSchema, point, `grammar[${index}]`),
);

export const contentBundle: ContentBundle = {
  units,
  lessons,
  exercises,
  lexemes,
  grammarPoints,
};

if (process.env.NODE_ENV !== "production") {
  const report = validateContent(contentBundle);
  if (report.errors.length > 0) {
    throw new Error(
      `Content validation failed:\n${report.errors
        .map((issue) => `- ${issue.code}: ${issue.message}`)
        .join("\n")}`,
    );
  }
}

export const unitById = new Map(units.map((unit) => [unit.id, unit]));
export const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
export const exerciseById = new Map(
  exercises.map((exercise) => [exercise.id, exercise]),
);
export const lexemeById = new Map(lexemes.map((lexeme) => [lexeme.id, lexeme]));
export const grammarById = new Map(
  grammarPoints.map((point) => [point.id, point]),
);

export const exercisesByLesson = new Map<string, Exercise[]>(
  lessons.map((lesson) => [
    lesson.id,
    lesson.exerciseIds
      .map((id) => exerciseById.get(id))
      .filter((exercise): exercise is Exercise => Boolean(exercise)),
  ]),
);

export const exercisesByReviewKey = new Map<string, Exercise[]>();
for (const exercise of exercises) {
  for (const target of exercise.reviewTargets) {
    const list = exercisesByReviewKey.get(target.key) ?? [];
    if (!list.some((candidate) => candidate.id === exercise.id)) {
      list.push(exercise);
    }
    exercisesByReviewKey.set(target.key, list);
  }
}

export const playableLessons = [...lessons]
  .filter((lesson) => lesson.status === "playable")
  .sort((a, b) => a.unitId.localeCompare(b.unitId) || a.index - b.index);

export function getLesson(lessonId: string): Lesson | undefined {
  return lessonById.get(lessonId);
}

export function getLessonExercises(lessonId: string): Exercise[] {
  return exercisesByLesson.get(lessonId) ?? [];
}

export function getUnitLessons(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.index - b.index);
}

export function getNextLesson(completedLessonIds: Iterable<string>): Lesson {
  const completed = new Set(completedLessonIds);
  return (
    playableLessons.find((lesson) => !completed.has(lesson.id)) ??
    playableLessons[0] ??
    lessons[0]!
  );
}
