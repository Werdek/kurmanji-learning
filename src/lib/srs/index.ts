import type { ReviewDomain } from "@/content/schema";

export const DAY_MS = 86_400_000;
export const MINUTE_MS = 60_000;
export const RETRY_INTERVAL_DAYS = 10 / (60 * 24);

export type DomainStat = {
  attempts: number;
  correct: number;
  hintedCorrect: number;
  firstNoHintAt?: number;
  lastNoHintAt?: number;
};

export type ReviewItem = {
  key: string;
  unitId: string;
  due: number;
  intervalDays: number;
  ease: number;
  reps: number;
  successes: number;
  lapses: number;
  accuracy: number;
  attempts: number;
  domains: Partial<Record<ReviewDomain, DomainStat>>;
  introducedAt: number;
  lastAttemptAt: number;
  lastSuccessAt?: number;
  mastery: number;
};

export type ReviewOutcome = {
  key: string;
  domain: ReviewDomain;
  correct: boolean;
  hintsUsed: number;
};

export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

export function createReviewItem(
  key: string,
  unitId: string,
  now = Date.now(),
): ReviewItem {
  return {
    key,
    unitId,
    due: now,
    intervalDays: 0,
    ease: 2.5,
    reps: 0,
    successes: 0,
    lapses: 0,
    accuracy: 0,
    attempts: 0,
    domains: {},
    introducedAt: now,
    lastAttemptAt: now,
    mastery: 0,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function computeMastery(item: ReviewItem): MasteryLevel {
  if (item.attempts === 0) return 0;

  const domains = Object.entries(item.domains) as Array<
    [ReviewDomain, DomainStat]
  >;
  const withCorrect = domains.filter(([, stat]) => stat.correct > 0);
  if (withCorrect.length === 0) return 1;

  const withUnhinted = domains.filter(
    ([, stat]) => stat.correct - stat.hintedCorrect > 0 && stat.lastNoHintAt,
  );
  if (withUnhinted.length === 0) return 2;

  const names = new Set(withUnhinted.map(([name]) => name));
  const firsts = withUnhinted
    .map(([, stat]) => stat.firstNoHintAt)
    .filter((value): value is number => typeof value === "number");
  const lasts = withUnhinted
    .map(([, stat]) => stat.lastNoHintAt)
    .filter((value): value is number => typeof value === "number");
  const span =
    firsts.length > 0 && lasts.length > 0
      ? Math.max(...lasts) - Math.min(...firsts)
      : 0;

  if (
    names.has("production") &&
    names.has("grammar") &&
    names.has("recognition") &&
    span >= 7 * DAY_MS
  ) {
    return 5;
  }

  if (withUnhinted.length >= 2 && span >= 3 * DAY_MS) {
    return 4;
  }

  if (names.has("production") || names.has("grammar")) {
    return 3;
  }

  return 2;
}

export function applyReviewOutcome(
  base: ReviewItem,
  outcome: ReviewOutcome,
  now = Date.now(),
): ReviewItem {
  const item: ReviewItem = {
    ...base,
    domains: { ...base.domains },
  };

  const hinted = outcome.hintsUsed > 0;
  const previousAccuracy = item.accuracy;
  const previousAttempts = item.attempts;

  item.attempts += 1;
  item.reps += 1;
  item.lastAttemptAt = now;
  item.accuracy =
    previousAttempts === 0
      ? outcome.correct
        ? 1
        : 0
      : clamp(previousAccuracy * 0.65 + (outcome.correct ? 0.35 : 0), 0, 1);

  const previousDomain: DomainStat = item.domains[outcome.domain] ?? {
    attempts: 0,
    correct: 0,
    hintedCorrect: 0,
  };

  const domain: DomainStat = {
    ...previousDomain,
    attempts: previousDomain.attempts + 1,
  };

  if (outcome.correct) {
    domain.correct += 1;
    if (hinted) {
      domain.hintedCorrect += 1;
    } else {
      domain.firstNoHintAt ??= now;
      domain.lastNoHintAt = now;
    }
    item.lastSuccessAt = now;
    item.successes += 1;
  }

  item.domains[outcome.domain] = domain;

  if (outcome.correct && !hinted) {
    if (item.successes === 1) {
      item.intervalDays = 1;
    } else if (item.successes === 2) {
      item.intervalDays = 3;
    } else {
      item.intervalDays = Math.max(
        1,
        Math.round(item.intervalDays * item.ease),
      );
    }
    item.ease = clamp(item.ease + 0.05, 1.3, 2.8);
  } else if (outcome.correct && hinted) {
    item.intervalDays = Math.max(1, Math.round(item.intervalDays * 1.2));
    item.ease = clamp(item.ease - 0.05, 1.3, 2.8);
  } else {
    item.intervalDays = RETRY_INTERVAL_DAYS;
    item.ease = clamp(item.ease - 0.2, 1.3, 2.8);
    item.lapses += 1;
  }

  item.due = now + item.intervalDays * DAY_MS;
  item.mastery = computeMastery(item);
  return item;
}

export function masteryLabel(level: number): string {
  return (
    [
      "Unseen",
      "Introduced",
      "Recognized",
      "Recalled",
      "Independent",
      "Durable",
    ][level] ?? "Unseen"
  );
}

export function dueItems(items: ReviewItem[], now = Date.now()): ReviewItem[] {
  return items.filter((item) => item.due <= now).sort((a, b) => a.due - b.due);
}

export function weakItems(items: ReviewItem[], limit = 8): ReviewItem[] {
  return items
    .filter((item) => item.attempts > 0 && item.mastery < 3)
    .sort((a, b) => a.accuracy - b.accuracy || a.due - b.due)
    .slice(0, limit);
}

export function nextDue(items: ReviewItem[], now = Date.now()): ReviewItem[] {
  return items
    .filter((item) => item.due > now)
    .sort((a, b) => a.due - b.due)
    .slice(0, 8);
}
