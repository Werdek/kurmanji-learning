import { describe, expect, it } from "vitest";
import {
  DAY_MS,
  RETRY_INTERVAL_DAYS,
  applyReviewOutcome,
  computeMastery,
  createReviewItem,
  dueItems,
  type ReviewItem,
} from "@/lib/srs";

const T0 = Date.UTC(2026, 0, 1, 9, 0, 0);

function correct(
  item: ReviewItem,
  domain: Parameters<typeof applyReviewOutcome>[1]["domain"],
  at: number,
  hintsUsed = 0,
): ReviewItem {
  return applyReviewOutcome(
    item,
    { key: item.key, domain, correct: true, hintsUsed },
    at,
  );
}

describe("scheduler", () => {
  it("introduces an item as due immediately", () => {
    const item = createReviewItem("lex.silav", "u01", T0);
    expect(item.due).toBe(T0);
    expect(item.mastery).toBe(0);
    expect(item.ease).toBe(2.5);
  });

  it("schedules the first success in one day and the second in three", () => {
    let item = createReviewItem("lex.silav", "u01", T0);
    item = correct(item, "production", T0);
    expect(item.intervalDays).toBe(1);
    expect(item.due).toBe(T0 + DAY_MS);
    expect(item.ease).toBeCloseTo(2.55);
    expect(item.successes).toBe(1);
    expect(item.mastery).toBe(3);

    item = correct(item, "production", T0 + DAY_MS);
    expect(item.intervalDays).toBe(3);
    expect(item.successes).toBe(2);
  });

  it("grows intervals by the ease factor after two successes", () => {
    let item = createReviewItem("lex.silav", "u01", T0);
    item = correct(item, "production", T0);
    item = correct(item, "production", T0 + DAY_MS);
    item = correct(item, "production", T0 + 4 * DAY_MS);
    expect(item.intervalDays).toBe(Math.max(1, Math.round(3 * 2.6)));
  });

  it("retries a lapse in ten minutes and lowers ease", () => {
    let item = createReviewItem("lex.silav", "u01", T0);
    item = correct(item, "production", T0);
    item = applyReviewOutcome(
      item,
      { key: "lex.silav", domain: "production", correct: false, hintsUsed: 0 },
      T0 + 2 * DAY_MS,
    );
    expect(item.intervalDays).toBeCloseTo(RETRY_INTERVAL_DAYS);
    expect(item.due).toBe(T0 + 2 * DAY_MS + 10 * 60_000);
    expect(item.lapses).toBe(1);
    expect(item.ease).toBeCloseTo(2.35);
  });

  it("degrades a hinted success", () => {
    let item = createReviewItem("lex.silav", "u01", T0);
    item = correct(item, "production", T0, 1);
    expect(item.intervalDays).toBe(1);
    expect(item.ease).toBeCloseTo(2.45);
    expect(item.mastery).toBe(2);
  });

  it("updates accuracy as an EWMA", () => {
    let item = createReviewItem("lex.silav", "u01", T0);
    item = correct(item, "production", T0);
    expect(item.accuracy).toBe(1);
    item = applyReviewOutcome(
      item,
      { key: "lex.silav", domain: "production", correct: false, hintsUsed: 0 },
      T0 + DAY_MS,
    );
    expect(item.accuracy).toBeCloseTo(0.65);
  });
});

describe("mastery", () => {
  it("reaches level 4 across two domains spaced three days", () => {
    let item = createReviewItem("G03", "u01", T0);
    item = correct(item, "production", T0);
    item = correct(item, "recognition", T0 + 3 * DAY_MS);
    expect(item.mastery).toBe(4);
  });

  it("reaches level 5 with three domains spaced seven days", () => {
    let item = createReviewItem("G03", "u01", T0);
    item = correct(item, "production", T0);
    item = correct(item, "recognition", T0 + 3 * DAY_MS);
    item = correct(item, "grammar", T0 + 7 * DAY_MS);
    expect(item.mastery).toBe(5);
    expect(computeMastery(item)).toBe(5);
  });

  it("does not award level 3 for recognition alone", () => {
    let item = createReviewItem("lex.silav", "u01", T0);
    item = correct(item, "recognition", T0);
    expect(item.mastery).toBe(2);
  });
});

describe("queue helpers", () => {
  it("orders due items and ignores future items", () => {
    const a = { ...createReviewItem("a", "u01", T0), due: T0 - 1000 };
    const b = { ...createReviewItem("b", "u01", T0), due: T0 + 10 * DAY_MS };
    expect(dueItems([b, a], T0).map((item) => item.key)).toEqual(["a"]);
  });
});
