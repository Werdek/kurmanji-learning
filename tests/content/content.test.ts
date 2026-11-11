import { describe, expect, it } from "vitest";
import {
  contentBundle,
  exercises,
  lessons,
  playableLessons,
  units,
} from "@/content";
import { validateContent } from "@/content/validate";

describe("content gate", () => {
  it("has no structural errors", () => {
    const report = validateContent(contentBundle);
    expect(report.errors).toEqual([]);
  });

  it("has the complete A1 and A2 curriculum", () => {
    expect(units).toHaveLength(12);
    expect(lessons).toHaveLength(72);
    expect(playableLessons).toHaveLength(72);
    expect(exercises).toHaveLength(460);
  });

  it("gives every playable lesson at least six exercises", () => {
    for (const lesson of playableLessons) {
      expect(lesson.exerciseIds.length).toBeGreaterThanOrEqual(6);
      expect(lesson.inputDialogue.length).toBeGreaterThanOrEqual(0);
    }
  });

  it("requires every exercise to carry sources, explanation and targets", () => {
    for (const exercise of exercises) {
      expect(exercise.sourceRefs.length).toBeGreaterThan(0);
      expect(exercise.explanation.length).toBeGreaterThan(20);
      expect(exercise.reviewTargets.length).toBeGreaterThan(0);
      expect(exercise.reviewStatus).not.toBe("draft");
    }
  });

  it("reports cross-reference damage", () => {
    const broken = {
      ...contentBundle,
      lexemes: contentBundle.lexemes.filter(
        (lexeme) => lexeme.id !== "lex.silav",
      ),
    };
    const report = validateContent(broken);
    expect(report.errors.length).toBeGreaterThan(0);
    expect(report.errors.map((issue) => issue.code)).toContain(
      "missing-review-lexeme",
    );
  });

  it("contains no coercive product mechanics in lesson copy", () => {
    const text = lessons
      .map((lesson) => JSON.stringify(lesson))
      .join(" ")
      .toLowerCase();
    for (const banned of ["hearts", "lives", "energy", "cooldown", "paywall"]) {
      expect(text).not.toContain(banned);
    }
  });
});
