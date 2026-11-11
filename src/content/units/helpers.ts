/**
 * Small authoring helpers shared by the A1 unit files.
 *
 * Every factory returns a plain object that is parsed by Zod at import time.
 * The helpers keep the content files focused on language rather than on
 * repeating the same metadata fields forty times per unit.
 */

import type { Exercise, Lesson, ReviewDomain, Unit } from "../schema";

const REVIEW = "checked" as const;

type Target = readonly [key: string, domain: ReviewDomain];

type Base = {
  id: string;
  lessonId: string;
  prompt: string;
  explanation: string;
  skill: ReviewDomain;
  difficulty: 1 | 2 | 3;
  targets: readonly Target[];
  hints?: readonly string[];
  tags?: readonly string[];
  sourceRefs?: readonly string[];
};

function base(input: Base) {
  return {
    id: input.id,
    lessonId: input.lessonId,
    prompt: input.prompt,
    explanation: input.explanation,
    hints: [...(input.hints ?? [])],
    skill: input.skill,
    difficulty: input.difficulty,
    sourceRefs: [...(input.sourceRefs ?? ["TH §11"])],
    reviewStatus: REVIEW,
    reviewTargets: input.targets.map(([key, domain]) => ({ key, domain })),
    tags: [...(input.tags ?? [])],
  };
}

export function mc(
  input: Base & {
    options: readonly { id: string; text: string }[];
    correct: string;
    optionExplanations?: Record<string, string>;
  },
): Exercise {
  return {
    ...base(input),
    kind: "multipleChoice",
    options: input.options.map((option) => ({ ...option })),
    correctOptionId: input.correct,
    optionExplanations: { ...(input.optionExplanations ?? {}) },
  };
}

export function fib(
  input: Base & {
    before: string;
    after?: string;
    accepted: readonly string[];
    displayAnswer: string;
    translation: string;
  },
): Exercise {
  return {
    ...base(input),
    kind: "fillInTheBlank",
    before: input.before,
    after: input.after ?? "",
    accepted: [...input.accepted],
    displayAnswer: input.displayAnswer,
    translation: input.translation,
  };
}

export function sb(
  input: Base & {
    tokens: readonly string[];
    distractors?: readonly string[];
    translation: string;
    punctuation?: "." | "?" | "!";
  },
): Exercise {
  return {
    ...base(input),
    kind: "sentenceBuilder",
    tokens: [...input.tokens],
    distractors: [...(input.distractors ?? [])],
    translation: input.translation,
    punctuation: input.punctuation ?? ".",
  };
}

export function vm(
  input: Base & {
    pairs: readonly { ku: string; en: string; reviewKey: string }[];
  },
): Exercise {
  return {
    ...base(input),
    kind: "vocabularyMatch",
    pairs: input.pairs.map((pair) => ({ ...pair })),
  };
}

export function lesson(input: {
  id: string;
  unitId: string;
  index: number;
  titleKu: string;
  titleEn: string;
  subtitle: string;
  objectives: readonly string[];
  estimatedMinutes: number;
  exerciseIds: readonly string[];
  inputDialogue?: readonly { speaker: string; ku: string; en: string }[];
  sourceRefs?: readonly string[];
}): Lesson {
  return {
    id: input.id,
    unitId: input.unitId,
    index: input.index,
    titleKu: input.titleKu,
    titleEn: input.titleEn,
    subtitle: input.subtitle,
    inputDialogue: [...(input.inputDialogue ?? [])],
    objectives: [...input.objectives],
    estimatedMinutes: input.estimatedMinutes,
    exerciseIds: [...input.exerciseIds],
    status: "playable",
    sourceRefs: [...(input.sourceRefs ?? ["TH §11"])],
    reviewStatus: REVIEW,
  };
}

export function unit(input: {
  id: string;
  stage: Unit["stage"];
  order: number;
  titleKu: string;
  titleEn: string;
  description: string;
  outcomes: readonly string[];
  lessonIds: readonly string[];
  grammarRefs: readonly string[];
  lexemeRefs: readonly string[];
}): Unit {
  return {
    id: input.id,
    stage: input.stage,
    order: input.order,
    titleKu: input.titleKu,
    titleEn: input.titleEn,
    description: input.description,
    outcomes: [...input.outcomes],
    lessonIds: [...input.lessonIds],
    grammarRefs: [...input.grammarRefs],
    lexemeRefs: [...input.lexemeRefs],
  };
}

/** `ex.u02.l3.04` */
export function exId(unitId: string, lessonIndex: number, n: number): string {
  return `ex.${unitId}.l${lessonIndex}.${String(n).padStart(2, "0")}`;
}

/** Every exercise id for one lesson, in order. */
export function exIds(
  unitId: string,
  lessonIndex: number,
  count: number,
): string[] {
  return Array.from({ length: count }, (_, index) =>
    exId(unitId, lessonIndex, index + 1),
  );
}
