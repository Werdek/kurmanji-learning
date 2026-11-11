import type { ContentBundle, Exercise } from "./schema";
import { normalizeKurdish } from "../lib/grading/normalize";

export type IssueLevel = "error" | "warning";

export type ContentIssue = {
  level: IssueLevel;
  code: string;
  message: string;
};

export type ValidationReport = {
  errors: ContentIssue[];
  warnings: ContentIssue[];
  stats: {
    units: number;
    lessons: number;
    playableLessons: number;
    exercises: number;
    lexemes: number;
    grammarPoints: number;
  };
};

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

function exerciseLabel(exercise: Exercise): string {
  return `${exercise.id} (${exercise.kind})`;
}

function auditExercise(exercise: Exercise): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const label = exerciseLabel(exercise);
  const seenTargets = new Set<string>();

  for (const target of exercise.reviewTargets) {
    const targetId = `${target.key}:${target.domain}`;
    if (seenTargets.has(targetId)) {
      issues.push({
        level: "error",
        code: "duplicate-review-target",
        message: `${label} repeats review target ${targetId}.`,
      });
    }
    seenTargets.add(targetId);
  }

  if (exercise.kind === "multipleChoice") {
    const ids = exercise.options.map((option) => option.id);
    if (duplicates(ids).length > 0) {
      issues.push({
        level: "error",
        code: "duplicate-option-id",
        message: `${label} has duplicate option ids.`,
      });
    }
    if (!ids.includes(exercise.correctOptionId)) {
      issues.push({
        level: "error",
        code: "missing-correct-option",
        message: `${label} points at a correctOptionId that is not in options.`,
      });
    }
    const texts = exercise.options.map((option) =>
      normalizeKurdish(option.text),
    );
    if (duplicates(texts).length > 0) {
      issues.push({
        level: "error",
        code: "duplicate-option-text",
        message: `${label} has two options with the same text.`,
      });
    }
    for (const key of Object.keys(exercise.optionExplanations)) {
      if (!ids.includes(key)) {
        issues.push({
          level: "error",
          code: "orphan-option-explanation",
          message: `${label} explains an option id that does not exist: ${key}.`,
        });
      }
    }
    if (exercise.options.length < 3) {
      issues.push({
        level: "warning",
        code: "thin-distractors",
        message: `${label} has fewer than three options.`,
      });
    }
  }

  if (exercise.kind === "fillInTheBlank") {
    const accepted = exercise.accepted.map(normalizeKurdish);
    if (!accepted.includes(normalizeKurdish(exercise.displayAnswer))) {
      issues.push({
        level: "error",
        code: "display-answer-not-accepted",
        message: `${label} does not accept its own displayAnswer.`,
      });
    }
    if (duplicates(accepted).length > 0) {
      issues.push({
        level: "error",
        code: "duplicate-accepted-answer",
        message: `${label} lists the same accepted answer twice.`,
      });
    }
    if (!exercise.before.includes(" ") && exercise.before.length > 0) {
      // A blank should attach to a real word boundary in most items.
      issues.push({
        level: "warning",
        code: "tight-blank-boundary",
        message: `${label} may need a space before the blank.`,
      });
    }
  }

  if (exercise.kind === "sentenceBuilder") {
    const tokenSet = new Set(exercise.tokens);
    for (const distractor of exercise.distractors) {
      if (tokenSet.has(distractor)) {
        issues.push({
          level: "error",
          code: "ambiguous-distractor",
          message: `${label} repeats a correct token as a distractor: ${distractor}.`,
        });
      }
    }
    if (duplicates(exercise.distractors).length > 0) {
      issues.push({
        level: "error",
        code: "duplicate-distractor",
        message: `${label} lists the same distractor twice.`,
      });
    }
  }

  if (exercise.kind === "vocabularyMatch") {
    const ku = exercise.pairs.map((pair) => normalizeKurdish(pair.ku));
    const en = exercise.pairs.map((pair) => normalizeKurdish(pair.en));
    if (duplicates(ku).length > 0 || duplicates(en).length > 0) {
      issues.push({
        level: "error",
        code: "ambiguous-pair",
        message: `${label} has duplicate Kurdish or English pair values.`,
      });
    }
    const targetKeys = new Set(
      exercise.reviewTargets.map((target) => target.key),
    );
    for (const pair of exercise.pairs) {
      if (!targetKeys.has(pair.reviewKey)) {
        issues.push({
          level: "error",
          code: "pair-not-tracked",
          message: `${label} pair ${pair.ku} has no matching review target.`,
        });
      }
    }
  }

  if (exercise.reviewStatus === "draft") {
    issues.push({
      level: "error",
      code: "draft-exercise",
      message: `${label} is still marked draft and cannot ship.`,
    });
  }

  return issues;
}

export function validateContent(bundle: ContentBundle): ValidationReport {
  const issues: ContentIssue[] = [];

  const collections: Array<[string, string[]]> = [
    ["unit", bundle.units.map((unit) => unit.id)],
    ["lesson", bundle.lessons.map((lesson) => lesson.id)],
    ["exercise", bundle.exercises.map((exercise) => exercise.id)],
    ["lexeme", bundle.lexemes.map((lexeme) => lexeme.id)],
    ["grammar", bundle.grammarPoints.map((point) => point.id)],
  ];

  for (const [kind, ids] of collections) {
    for (const id of duplicates(ids)) {
      issues.push({
        level: "error",
        code: "duplicate-id",
        message: `Duplicate ${kind} id: ${id}.`,
      });
    }
  }

  const unitById = new Map(bundle.units.map((unit) => [unit.id, unit]));
  const lessonById = new Map(
    bundle.lessons.map((lesson) => [lesson.id, lesson]),
  );
  const exerciseById = new Map(
    bundle.exercises.map((exercise) => [exercise.id, exercise]),
  );
  const lexemeIds = new Set(bundle.lexemes.map((lexeme) => lexeme.id));
  const grammarIds = new Set(bundle.grammarPoints.map((point) => point.id));

  for (const unit of bundle.units) {
    if (unit.lessonIds.length !== 6) {
      issues.push({
        level: "error",
        code: "unit-lesson-count",
        message: `Unit ${unit.id} must list six lessons.`,
      });
    }
    for (const lessonId of unit.lessonIds) {
      const lesson = lessonById.get(lessonId);
      if (!lesson) {
        issues.push({
          level: "error",
          code: "missing-lesson",
          message: `Unit ${unit.id} references missing lesson ${lessonId}.`,
        });
        continue;
      }
      if (lesson.unitId !== unit.id) {
        issues.push({
          level: "error",
          code: "lesson-unit-mismatch",
          message: `Lesson ${lessonId} points at ${lesson.unitId}, not ${unit.id}.`,
        });
      }
    }
    for (const lexemeId of unit.lexemeRefs) {
      if (!lexemeIds.has(lexemeId)) {
        issues.push({
          level: "error",
          code: "missing-lexeme",
          message: `Unit ${unit.id} references missing lexeme ${lexemeId}.`,
        });
      }
    }
    for (const grammarId of unit.grammarRefs) {
      if (!grammarIds.has(grammarId)) {
        issues.push({
          level: "error",
          code: "missing-grammar",
          message: `Unit ${unit.id} references missing grammar point ${grammarId}.`,
        });
      }
    }
  }

  for (const lesson of bundle.lessons) {
    const unit = unitById.get(lesson.unitId);
    if (!unit) {
      issues.push({
        level: "error",
        code: "orphan-lesson",
        message: `Lesson ${lesson.id} points at missing unit ${lesson.unitId}.`,
      });
    } else if (!unit.lessonIds.includes(lesson.id)) {
      issues.push({
        level: "error",
        code: "lesson-not-in-unit",
        message: `Lesson ${lesson.id} is not listed in unit ${unit.id}.`,
      });
    }
    for (const exerciseId of lesson.exerciseIds) {
      if (!exerciseById.has(exerciseId)) {
        issues.push({
          level: "error",
          code: "missing-exercise",
          message: `Lesson ${lesson.id} references missing exercise ${exerciseId}.`,
        });
      }
    }
    if (lesson.reviewStatus === "draft") {
      issues.push({
        level: "error",
        code: "draft-lesson",
        message: `Lesson ${lesson.id} is still marked draft.`,
      });
    }
  }

  const trackedLexemes = new Set<string>();
  const trackedGrammar = new Set<string>();

  for (const exercise of bundle.exercises) {
    issues.push(...auditExercise(exercise));

    const lesson = lessonById.get(exercise.lessonId);
    if (!lesson) {
      issues.push({
        level: "error",
        code: "orphan-exercise",
        message: `${exerciseLabel(exercise)} points at missing lesson ${exercise.lessonId}.`,
      });
      continue;
    }
    if (!lesson.exerciseIds.includes(exercise.id)) {
      issues.push({
        level: "error",
        code: "exercise-not-in-lesson",
        message: `${exerciseLabel(exercise)} is not listed in ${lesson.id}.`,
      });
    }
    const unit = unitById.get(lesson.unitId);

    for (const target of exercise.reviewTargets) {
      if (target.key.startsWith("lex.")) {
        trackedLexemes.add(target.key);
        if (!lexemeIds.has(target.key)) {
          issues.push({
            level: "error",
            code: "missing-review-lexeme",
            message: `${exerciseLabel(exercise)} targets missing lexeme ${target.key}.`,
          });
        }
        if (unit && !unit.lexemeRefs.includes(target.key)) {
          issues.push({
            level: "error",
            code: "lexeme-outside-unit",
            message: `${exerciseLabel(exercise)} targets ${target.key}, which is not in ${unit.id}'s lexicon.`,
          });
        }
      } else {
        trackedGrammar.add(target.key);
        if (!grammarIds.has(target.key)) {
          issues.push({
            level: "error",
            code: "missing-review-grammar",
            message: `${exerciseLabel(exercise)} targets missing grammar point ${target.key}.`,
          });
        }
        if (unit && !unit.grammarRefs.includes(target.key)) {
          issues.push({
            level: "error",
            code: "grammar-outside-unit",
            message: `${exerciseLabel(exercise)} targets ${target.key}, which is not in ${unit.id}'s grammar list.`,
          });
        }
      }
    }
  }

  const playableLessons = bundle.lessons.filter(
    (lesson) => lesson.status === "playable",
  ).length;

  return {
    errors: issues.filter((issue) => issue.level === "error"),
    warnings: issues.filter((issue) => issue.level === "warning"),
    stats: {
      units: bundle.units.length,
      lessons: bundle.lessons.length,
      playableLessons,
      exercises: bundle.exercises.length,
      lexemes: bundle.lexemes.length,
      grammarPoints: bundle.grammarPoints.length,
    },
  };
}
