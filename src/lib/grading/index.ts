import type {
  Exercise,
  FillInTheBlankExercise,
  MultipleChoiceExercise,
  ReviewDomain,
  SentenceBuilderExercise,
  VocabularyMatchExercise,
} from "@/content/schema";
import { normalizeKurdish, stripDiacritics } from "./normalize";

export type Outcome = {
  key: string;
  domain: ReviewDomain;
  correct: boolean;
  hintsUsed: number;
};

export type ExerciseResult = {
  correct: boolean;
  scored: boolean;
  skipped?: boolean;
  answer: string;
  expected: string;
  hintsUsed: number;
  errorTags: string[];
  outcomes: Outcome[];
  choiceId?: string;
};

const COPULA_FORMS = new Set(["im", "î", "e", "in", "me", "yî", "ye", "ne"]);

function outcomesFor(
  exercise: Exercise,
  correct: boolean,
  hintsUsed: number,
): Outcome[] {
  return exercise.reviewTargets.map((target) => ({
    key: target.key,
    domain: target.domain,
    correct,
    hintsUsed,
  }));
}

function diagnose(
  expected: string,
  actual: string,
  kind: Exercise["kind"],
  extraTags: string[] = [],
): string[] {
  const tags = new Set(extraTags);
  const normalizedExpected = normalizeKurdish(expected);
  const normalizedActual = normalizeKurdish(actual);

  if (
    normalizedActual.length > 0 &&
    normalizedExpected !== normalizedActual &&
    stripDiacritics(normalizedExpected) === stripDiacritics(normalizedActual)
  ) {
    tags.add("spelling-diacritic");
  }

  if (
    COPULA_FORMS.has(normalizedActual) ||
    COPULA_FORMS.has(normalizedExpected)
  ) {
    tags.add("copula-allomorphy");
  }

  const actualWords = normalizedActual.split(" ").filter(Boolean);
  const expectedWords = normalizedExpected.split(" ").filter(Boolean);
  const actualLast = actualWords[actualWords.length - 1];
  const expectedLast = expectedWords[expectedWords.length - 1];
  if (
    (actualLast && COPULA_FORMS.has(actualLast)) ||
    (expectedLast && COPULA_FORMS.has(expectedLast))
  ) {
    tags.add("copula-allomorphy");
  }

  if (kind === "sentenceBuilder") {
    const sortedExpected = normalizedExpected.split(" ").sort().join(" ");
    const sortedActual = normalizedActual.split(" ").sort().join(" ");
    if (
      sortedExpected === sortedActual &&
      normalizedExpected !== normalizedActual
    ) {
      tags.add("word-order");
    }
  }

  if (kind === "vocabularyMatch") {
    tags.add("vocab-confusion");
  }

  return [...tags];
}

export function checkMultipleChoice(
  exercise: MultipleChoiceExercise,
  optionId: string,
  hintsUsed = 0,
): ExerciseResult {
  const correctOption = exercise.options.find(
    (option) => option.id === exercise.correctOptionId,
  );
  const expected = correctOption?.text ?? "";
  const chosen = exercise.options.find((option) => option.id === optionId);
  const correct = optionId === exercise.correctOptionId;

  return {
    correct,
    scored: true,
    answer: chosen?.text ?? "",
    expected,
    hintsUsed,
    errorTags: correct
      ? []
      : diagnose(expected, chosen?.text ?? "", exercise.kind, exercise.tags),
    outcomes: outcomesFor(exercise, correct, hintsUsed),
    choiceId: optionId,
  };
}

export function checkFillInTheBlank(
  exercise: FillInTheBlankExercise,
  input: string,
  hintsUsed = 0,
): ExerciseResult {
  const normalized = normalizeKurdish(input);
  const correct =
    normalized.length > 0 &&
    exercise.accepted.some((answer) => normalizeKurdish(answer) === normalized);

  return {
    correct,
    scored: true,
    answer: input.trim(),
    expected: exercise.displayAnswer,
    hintsUsed,
    errorTags: correct
      ? []
      : diagnose(exercise.displayAnswer, input, exercise.kind, exercise.tags),
    outcomes: outcomesFor(exercise, correct, hintsUsed),
  };
}

export function checkSentenceBuilder(
  exercise: SentenceBuilderExercise,
  orderedTokens: string[],
  hintsUsed = 0,
): ExerciseResult {
  const expected = `${exercise.tokens.join(" ")}${exercise.punctuation}`;
  const answer = `${orderedTokens.join(" ")}${exercise.punctuation}`;
  const correct =
    orderedTokens.length === exercise.tokens.length &&
    orderedTokens.every(
      (token, index) =>
        normalizeKurdish(token) ===
        normalizeKurdish(exercise.tokens[index] ?? ""),
    );

  return {
    correct,
    scored: true,
    answer,
    expected,
    hintsUsed,
    errorTags: correct
      ? []
      : diagnose(expected, answer, exercise.kind, exercise.tags),
    outcomes: outcomesFor(exercise, correct, hintsUsed),
  };
}

/**
 * `matches` maps each Kurdish pair index to the English pair index chosen by
 * the learner. Pair order is the authored order in the exercise.
 */
export function checkVocabularyMatch(
  exercise: VocabularyMatchExercise,
  matches: Record<number, number>,
  hintsUsed = 0,
): ExerciseResult {
  const outcomes: Outcome[] = [];
  let correctCount = 0;

  exercise.pairs.forEach((pair, kuIndex) => {
    const target = exercise.reviewTargets.find(
      (candidate) => candidate.key === pair.reviewKey,
    );
    const correct = matches[kuIndex] === kuIndex;
    if (correct) correctCount += 1;
    outcomes.push({
      key: pair.reviewKey,
      domain: target?.domain ?? "recognition",
      correct,
      hintsUsed,
    });
  });

  const correct = correctCount === exercise.pairs.length;

  return {
    correct,
    scored: true,
    answer: `${correctCount}/${exercise.pairs.length} pairs matched`,
    expected: `All ${exercise.pairs.length} pairs matched`,
    hintsUsed,
    errorTags: correct ? [] : ["vocab-confusion"],
    outcomes,
  };
}

export function sessionAccuracy(results: ExerciseResult[]): number {
  const scored = results.filter((result) => result.scored);
  if (scored.length === 0) return 0;
  return scored.filter((result) => result.correct).length / scored.length;
}

export function mistakeTagLabel(tag: string): string {
  const labels: Record<string, string> = {
    "copula-allomorphy": "Copula after a vowel vs. consonant",
    "spelling-diacritic": "Diacritic slip (ê, î, û, ş, ç)",
    "word-order": "Word order",
    "vocab-confusion": "Meaning confusion",
    "common-error": "Common learner error",
  };
  return labels[tag] ?? tag.replaceAll("-", " ");
}
