import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { exerciseById } from "@/content";
import { checkMultipleChoice } from "@/lib/grading";
import {
  exportBackup,
  getDb,
  getLearnerSnapshot,
  importBackup,
  recordExerciseResult,
  resetProgress,
} from "@/lib/db/repositories";
import type { MultipleChoiceExercise } from "@/content/schema";

function multipleChoice(): MultipleChoiceExercise {
  const exercise = exerciseById.get("ex.u01.l1.01");
  if (!exercise || exercise.kind !== "multipleChoice") {
    throw new Error("Missing exercise");
  }
  return exercise;
}

describe("repository", () => {
  beforeEach(async () => {
    await resetProgress();
  });

  it("persists an attempt, XP and a review item", async () => {
    const exercise = multipleChoice();
    const result = checkMultipleChoice(exercise, "a");
    const profile = await recordExerciseResult({
      lessonId: exercise.lessonId,
      unitId: "u01",
      exercise,
      result,
      latencyMs: 1200,
    });

    expect(profile.xp).toBe(10);
    expect(profile.streak).toBe(1);

    const snapshot = await getLearnerSnapshot();
    expect(snapshot.attempts).toHaveLength(1);
    expect(snapshot.attempts[0]?.scored).toBe(true);

    const item = snapshot.reviewItems.find((entry) => entry.key === "lex.ez");
    expect(item).toBeDefined();
    expect(item?.attempts).toBe(1);
    expect(item?.mastery).toBe(2);
    expect(item?.due).toBeGreaterThan(Date.now());
  });

  it("returns a transient profile without writing inside a read query", async () => {
    await getDb().profile.clear();

    const snapshot = await getLearnerSnapshot();

    expect(snapshot.profile.id).toBe("local");
    expect(snapshot.profile.xp).toBe(0);
    expect(await getDb().profile.count()).toBe(0);
  });

  it("does not schedule SRS for unscored answers", async () => {
    const exercise = multipleChoice();
    const result = {
      ...checkMultipleChoice(exercise, "a"),
      scored: false,
      outcomes: [],
    };
    await recordExerciseResult({
      lessonId: exercise.lessonId,
      unitId: "u01",
      exercise,
      result,
      latencyMs: 500,
    });

    const snapshot = await getLearnerSnapshot();
    expect(snapshot.attempts).toHaveLength(1);
    expect(snapshot.reviewItems).toHaveLength(0);
    expect(snapshot.profile.xp).toBe(0);
  });

  it("round-trips a backup", async () => {
    const exercise = multipleChoice();
    await recordExerciseResult({
      lessonId: exercise.lessonId,
      unitId: "u01",
      exercise,
      result: checkMultipleChoice(exercise, "a"),
      latencyMs: 900,
    });

    const backup = await exportBackup();
    await resetProgress();
    await importBackup(JSON.stringify(backup));

    const snapshot = await getLearnerSnapshot();
    expect(snapshot.attempts).toHaveLength(1);
    expect(snapshot.reviewItems).toHaveLength(2);
    expect(snapshot.profile.xp).toBe(10);
  });
});
