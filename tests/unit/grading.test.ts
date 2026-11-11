import { describe, expect, it } from "vitest";
import { exerciseById } from "@/content";
import {
  checkFillInTheBlank,
  checkMultipleChoice,
  checkSentenceBuilder,
  checkVocabularyMatch,
} from "@/lib/grading";
import { normalizeKurdish, stripDiacritics } from "@/lib/grading/normalize";
import type { Exercise } from "@/content/schema";

function exercise<T extends Exercise["kind"]>(
  id: string,
  kind: T,
): Extract<Exercise, { kind: T }> {
  const found = exerciseById.get(id);
  if (!found || found.kind !== kind) {
    throw new Error(`Missing ${kind} exercise ${id}`);
  }
  return found as Extract<Exercise, { kind: T }>;
}

describe("normalisation", () => {
  it("ignores case, spacing and punctuation but keeps diacritics", () => {
    expect(normalizeKurdish("  Silav,  ez Anna me. ")).toBe("silav ez anna me");
    expect(normalizeKurdish("Navê min Ehmed e.")).toBe("navê min ehmed e");
    expect(normalizeKurdish("navê")).not.toBe(normalizeKurdish("nave"));
  });

  it("strips diacritics only for diagnosis", () => {
    expect(stripDiacritics("Navê min")).toBe("nave min");
    expect(stripDiacritics("şêst")).toBe("sest");
  });
});

describe("multiple choice", () => {
  const ex = exercise("ex.u01.l1.01", "multipleChoice");

  it("accepts the authored key", () => {
    const result = checkMultipleChoice(ex, "a");
    expect(result.correct).toBe(true);
    expect(result.expected).toBe("I am Anna.");
    expect(result.outcomes.every((outcome) => outcome.correct)).toBe(true);
  });

  it("rejects a distractor and keeps the exercise tag", () => {
    const result = checkMultipleChoice(ex, "b");
    expect(result.correct).toBe(false);
    expect(result.choiceId).toBe("b");
    expect(result.errorTags).toContain("copula");
  });

  it("tags a wrong copula form inside a full sentence", () => {
    const copulaExercise = exercise("ex.u01.l2.03", "multipleChoice");
    const result = checkMultipleChoice(copulaExercise, "b");
    expect(result.correct).toBe(false);
    expect(result.errorTags).toContain("copula-allomorphy");
  });
});

describe("fill in the blank", () => {
  const ex = exercise("ex.u01.l1.04", "fillInTheBlank");

  it("accepts the right copula", () => {
    const result = checkFillInTheBlank(ex, "ME");
    expect(result.correct).toBe(true);
    expect(result.expected).toBe("me");
  });

  it("rejects im after a vowel and tags the allomorphy", () => {
    const result = checkFillInTheBlank(ex, "im");
    expect(result.correct).toBe(false);
    expect(result.errorTags).toContain("copula-allomorphy");
  });

  it("flags a missing diacritic instead of accepting it", () => {
    const diacriticExercise = exercise("ex.u01.l2.04", "fillInTheBlank");
    const result = checkFillInTheBlank(diacriticExercise, "i");
    expect(result.correct).toBe(false);
    expect(result.errorTags).toContain("spelling-diacritic");
  });
});

describe("sentence builder", () => {
  const ex = exercise("ex.u01.l1.06", "sentenceBuilder");

  it("accepts the authored order", () => {
    const result = checkSentenceBuilder(ex, ["Ez", "ji", "Almanyayê", "me"]);
    expect(result.correct).toBe(true);
    expect(result.expected).toBe("Ez ji Almanyayê me.");
  });

  it("recognises a word-order error", () => {
    const result = checkSentenceBuilder(ex, ["Ez", "ji", "me", "Almanyayê"]);
    expect(result.correct).toBe(false);
    expect(result.errorTags).toContain("word-order");
  });
});

describe("vocabulary match", () => {
  const ex = exercise("ex.u01.l1.03", "vocabularyMatch");

  it("scores each pair independently", () => {
    const result = checkVocabularyMatch(ex, { 0: 0, 1: 1, 2: 2, 3: 3, 4: 3 });
    expect(result.correct).toBe(false);
    expect(result.outcomes).toHaveLength(5);
    expect(result.outcomes.filter((outcome) => outcome.correct)).toHaveLength(
      4,
    );
    expect(result.outcomes[4]?.key).toBe("lex.sev-bas");
  });
});
