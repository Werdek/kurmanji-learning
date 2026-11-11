import Dexie, { type Table } from "dexie";
import { z } from "zod";
import type { Exercise } from "@/content/schema";
import type { ExerciseResult, Outcome } from "@/lib/grading";
import {
  applyReviewOutcome,
  createReviewItem,
  type ReviewItem,
} from "@/lib/srs";
import { dayKeyOffset, todayKey } from "@/lib/utils";

export type Attempt = {
  id?: number;
  exerciseId: string;
  lessonId: string;
  unitId: string;
  timestamp: number;
  correct: boolean;
  scored: boolean;
  latencyMs: number;
  hintsUsed: number;
  answer: string;
  expected: string;
  errorTags: string[];
  outcomes: Outcome[];
};

export type CompletedLesson = {
  completedAt: number;
  accuracy: number;
};

export type Profile = {
  id: "local";
  createdAt: number;
  xp: number;
  streak: number;
  lastActiveDay: string;
  completedLessons: Record<string, CompletedLesson>;
};

export type Backup = {
  format: "kurmanji-backup";
  version: 1;
  exportedAt: number;
  profile: Profile;
  attempts: Attempt[];
  reviewItems: ReviewItem[];
};

class KurmanjiDatabase extends Dexie {
  attempts!: Table<Attempt, number>;
  reviewItems!: Table<ReviewItem, string>;
  profile!: Table<Profile, string>;

  constructor() {
    super("kurmanji-learning");
    this.version(1).stores({
      attempts: "++id, exerciseId, lessonId, timestamp, unitId",
      reviewItems: "key, due, unitId, mastery",
      profile: "id",
    });
  }
}

let database: KurmanjiDatabase | null = null;

export function getDb(): KurmanjiDatabase {
  if (typeof indexedDB === "undefined") {
    throw new Error("Learner data is only available in the browser.");
  }
  database ??= new KurmanjiDatabase();
  return database;
}

export function createProfile(now = Date.now()): Profile {
  return {
    id: "local",
    createdAt: now,
    xp: 0,
    streak: 0,
    lastActiveDay: "",
    completedLessons: {},
  };
}

export async function getProfile(): Promise<Profile> {
  const db = getDb();
  const existing = await db.profile.get("local");
  if (existing) return existing;
  const profile = createProfile();
  await db.profile.put(profile);
  return profile;
}

export async function listReviewItems(): Promise<ReviewItem[]> {
  return getDb().reviewItems.toArray();
}

export async function listAttempts(): Promise<Attempt[]> {
  return getDb().attempts.toArray();
}

export type LearnerSnapshot = {
  profile: Profile;
  reviewItems: ReviewItem[];
  attempts: Attempt[];
};

/**
 * Reads everything the dashboards need. Must stay read-only: it runs inside
 * Dexie's liveQuery, which rejects write transactions. The profile is created
 * on the first recorded answer, or by `getProfile()` outside a live query.
 */
export async function getLearnerSnapshot(): Promise<LearnerSnapshot> {
  const db = getDb();
  const [profile, reviewItems, attempts] = await Promise.all([
    db.profile.get("local"),
    db.reviewItems.toArray(),
    db.attempts.orderBy("timestamp").reverse().limit(400).toArray(),
  ]);
  return {
    profile: profile ?? createProfile(),
    reviewItems,
    attempts,
  };
}

export async function recordExerciseResult(params: {
  lessonId: string;
  unitId: string;
  exercise: Exercise;
  result: ExerciseResult;
  latencyMs: number;
}): Promise<Profile> {
  const { lessonId, unitId, exercise, result, latencyMs } = params;
  const now = Date.now();
  const db = getDb();

  return db.transaction(
    "rw",
    db.attempts,
    db.reviewItems,
    db.profile,
    async () => {
      await db.attempts.add({
        exerciseId: exercise.id,
        lessonId,
        unitId,
        timestamp: now,
        correct: result.correct,
        scored: result.scored,
        latencyMs,
        hintsUsed: result.hintsUsed,
        answer: result.answer,
        expected: result.expected,
        errorTags: result.errorTags,
        outcomes: result.outcomes,
      });

      if (result.scored) {
        for (const outcome of result.outcomes) {
          const existing = await db.reviewItems.get(outcome.key);
          const base = existing ?? createReviewItem(outcome.key, unitId, now);
          const next = applyReviewOutcome(base, outcome, now);
          await db.reviewItems.put(next);
        }
      }

      const profile = (await db.profile.get("local")) ?? createProfile(now);

      if (result.scored) {
        profile.xp += result.correct ? 10 : 2;
      }

      const today = todayKey(new Date(now));
      if (profile.lastActiveDay !== today) {
        profile.streak =
          profile.lastActiveDay === dayKeyOffset(-1, new Date(now))
            ? profile.streak + 1
            : 1;
        profile.lastActiveDay = today;
      }

      await db.profile.put(profile);
      return profile;
    },
  );
}

export async function markLessonComplete(
  lessonId: string,
  accuracy: number,
): Promise<void> {
  const db = getDb();
  const profile = (await db.profile.get("local")) ?? createProfile();
  const previous = profile.completedLessons[lessonId];
  profile.completedLessons[lessonId] = {
    completedAt: Date.now(),
    accuracy: Math.max(previous?.accuracy ?? 0, accuracy),
  };
  await db.profile.put(profile);
}

export async function exportBackup(): Promise<Backup> {
  const db = getDb();
  const [profile, attempts, reviewItems] = await Promise.all([
    getProfile(),
    db.attempts.toArray(),
    db.reviewItems.toArray(),
  ]);
  return {
    format: "kurmanji-backup",
    version: 1,
    exportedAt: Date.now(),
    profile,
    attempts,
    reviewItems,
  };
}

const backupEnvelopeSchema = z.object({
  format: z.literal("kurmanji-backup"),
  version: z.literal(1),
  exportedAt: z.number(),
  profile: z.record(z.string(), z.unknown()),
  attempts: z.array(z.record(z.string(), z.unknown())),
  reviewItems: z.array(z.record(z.string(), z.unknown())),
});

function assertReviewItems(value: unknown[]): asserts value is ReviewItem[] {
  for (const row of value) {
    const item = row as Partial<ReviewItem>;
    if (
      typeof item.key !== "string" ||
      typeof item.due !== "number" ||
      typeof item.ease !== "number" ||
      typeof item.mastery !== "number"
    ) {
      throw new Error("The backup contains a malformed review item.");
    }
  }
}

export async function importBackup(raw: string): Promise<void> {
  const parsedJson: unknown = JSON.parse(raw);
  const envelope = backupEnvelopeSchema.safeParse(parsedJson);
  if (!envelope.success) {
    throw new Error("This file is not a Kurmanji progress backup.");
  }
  assertReviewItems(envelope.data.reviewItems);

  const profile = envelope.data.profile as unknown as Profile;
  if (profile.id !== "local" || typeof profile.xp !== "number") {
    throw new Error("The backup profile is malformed.");
  }

  const db = getDb();
  await db.transaction(
    "rw",
    db.attempts,
    db.reviewItems,
    db.profile,
    async () => {
      await Promise.all([
        db.attempts.clear(),
        db.reviewItems.clear(),
        db.profile.clear(),
      ]);
      await db.profile.put(profile);
      await db.attempts.bulkPut(envelope.data.attempts as unknown as Attempt[]);
      await db.reviewItems.bulkPut(
        envelope.data.reviewItems as unknown as ReviewItem[],
      );
    },
  );
}

export async function resetProgress(): Promise<void> {
  const db = getDb();
  await db.transaction(
    "rw",
    db.attempts,
    db.reviewItems,
    db.profile,
    async () => {
      await Promise.all([
        db.attempts.clear(),
        db.reviewItems.clear(),
        db.profile.clear(),
      ]);
      await db.profile.put(createProfile());
    },
  );
}
