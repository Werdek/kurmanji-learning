"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  FlameIcon,
  RepeatIcon,
  SparkIcon,
} from "@/components/icons";
import { LessonScreen } from "@/components/lesson-screen";
import { Mascot } from "@/components/mascot";
import { PageHeader } from "@/components/page-header";
import { ProgressRing } from "@/components/progress-ring";
import { SectionHeading } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import {
  exercisesByReviewKey,
  getLessonExercises,
  grammarById,
  lexemeById,
  playableLessons,
} from "@/content";
import type { Exercise, Lesson } from "@/content/schema";
import { getLearnerSnapshot } from "@/lib/db/repositories";
import {
  dueItems,
  masteryLabel,
  nextDue,
  weakItems,
  type ReviewItem,
} from "@/lib/srs";
import { useHydrated } from "@/lib/use-hydrated";
import { formatDue, percent, seededShuffle } from "@/lib/utils";

const reviewLesson: Lesson = {
  id: "u01-l6",
  unitId: "u01",
  index: 6,
  titleKu: "Dubarekirin",
  titleEn: "Spaced review",
  subtitle: "A queue built from your due and weak items.",
  inputDialogue: [],
  objectives: ["Retrieve items without prompts", "Strengthen fragile skills"],
  estimatedMinutes: 10,
  exerciseIds: [],
  status: "playable",
  sourceRefs: ["TH §11"],
  reviewStatus: "checked",
};

function allExercises(): Exercise[] {
  return playableLessons.flatMap((lesson) => getLessonExercises(lesson.id));
}

function queueFromItems(items: ReviewItem[], limit = 12): Exercise[] {
  const queue: Exercise[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const candidates = exercisesByReviewKey.get(item.key) ?? [];
    const exercise = candidates.find((candidate) => !seen.has(candidate.id));
    if (!exercise) continue;
    seen.add(exercise.id);
    queue.push(exercise);
    if (queue.length >= limit) break;
  }

  return queue;
}

function anythingQueue(): Exercise[] {
  return seededShuffle(allExercises(), String(Date.now())).slice(0, 10);
}

function reviewLabel(key: string): { ku: string; en: string } {
  const lexeme = lexemeById.get(key);
  if (lexeme) return { ku: lexeme.ku, en: lexeme.en };
  const grammar = grammarById.get(key);
  if (grammar) return { ku: grammar.title, en: `${grammar.id} · grammar` };
  return { ku: key, en: "" };
}

function Skeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-20 animate-pulse rounded-card bg-line/40" />
      <div className="h-40 animate-pulse rounded-card bg-line/50" />
      <div className="h-64 animate-pulse rounded-card bg-line/40" />
    </div>
  );
}

export default function ReviewPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <Skeleton />;
  return <ReviewHub />;
}

function ReviewHub() {
  const snapshot = useLiveQuery(() => getLearnerSnapshot(), []);
  const [session, setSession] = useState<Exercise[] | null>(null);

  if (session && session.length > 0) {
    return (
      <LessonScreen
        lesson={reviewLesson}
        exercises={session}
        mode="review"
        onExit={() => setSession(null)}
      />
    );
  }

  if (!snapshot) return <Skeleton />;

  const due = dueItems(snapshot.reviewItems);
  const weak = weakItems(snapshot.reviewItems, 8);
  const upcoming = nextDue(snapshot.reviewItems);
  const dueQueue = queueFromItems(due);
  const weakQueue = queueFromItems(weak);
  const secure = snapshot.reviewItems.filter(
    (item) => item.mastery >= 3,
  ).length;
  const securePct =
    snapshot.reviewItems.length > 0
      ? percent(secure, snapshot.reviewItems.length)
      : 0;
  const fragileCount = snapshot.reviewItems.filter(
    (item) => item.attempts > 0 && item.mastery < 3,
  ).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Spaced retrieval"
        title="Review"
        description="Accuracy decides when an item comes back. Intervals are suggestions, never gates: you can practise anything at any time."
        accessory={<Mascot className="w-16 shrink-0 sm:w-24" />}
      />

      <section className="card relative overflow-hidden border-0 bg-[linear-gradient(135deg,var(--color-brand)_0%,var(--color-brand-dark)_100%)] p-6 text-white shadow-glow">
        <div
          aria-hidden="true"
          className="hero-pattern absolute inset-0 opacity-25"
        />
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-12 size-40 rounded-full bg-sun/20 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-sun/80 to-transparent"
        />
        <div className="relative grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/90 ring-1 ring-white/15">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-sun"
              />
              Due now
            </p>
            <p className="mt-2 text-5xl font-black leading-none">
              {due.length}
            </p>
            <p className="mt-2 max-w-md text-sm text-white/90">
              {due.length === 0
                ? "Nothing is due. Your memory is in good shape."
                : `${dueQueue.length} exercise${dueQueue.length === 1 ? "" : "s"} ready in this queue.`}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              {dueQueue.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSession(dueQueue)}
                  className="btn bg-sun text-ink shadow-[0_3px_0_var(--color-sun-deep)] hover:bg-white"
                >
                  Start review
                  <ArrowRightIcon />
                </button>
              ) : weakQueue.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSession(weakQueue)}
                  className="btn bg-sun text-ink shadow-[0_3px_0_var(--color-sun-deep)] hover:bg-white"
                >
                  Practise weak items
                  <ArrowRightIcon />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setSession(anythingQueue())}
                className="btn border-white/25 bg-white/10 text-white hover:bg-white/20"
              >
                <SparkIcon /> Practice anything
              </button>
            </div>
          </div>

          <div className="relative mx-auto hidden w-40 sm:block">
            <Mascot className="w-full drop-shadow-[0_12px_20px_rgb(0_0_0/0.18)]" />
            <div className="mt-2 flex items-center gap-2.5 rounded-2xl bg-white/10 p-2 pr-3.5 ring-1 ring-white/15 backdrop-blur-sm">
              <ProgressRing
                value={securePct}
                size={48}
                stroke={6}
                label={`Memory strength: ${securePct}%`}
                trackClassName="stroke-white/25"
                valueClassName="stroke-sun"
              >
                <span className="text-[0.65rem] font-black">{securePct}%</span>
              </ProgressRing>
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-white/75">
                  Memory
                </p>
                <p className="text-xs font-black">strength</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <StatCard
          label="Due"
          value={due.length}
          tone="sun"
          icon={<RepeatIcon className="size-4" />}
        />
        <StatCard
          label="Fragile"
          value={fragileCount}
          tone="clay"
          icon={<FlameIcon className="size-4" />}
        />
        <StatCard
          label="Secure"
          value={secure}
          tone="brand"
          icon={<CheckIcon className="size-4" />}
        />
      </section>

      <section className="card p-5 sm:p-6">
        <SectionHeading
          icon={<RepeatIcon className="size-4" />}
          title="Due queue"
        />
        {due.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">
            No reviews are due. Use “Practice anything” to keep the unit warm,
            or come back after the next interval.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {due.slice(0, 10).map((item) => {
              const label = reviewLabel(item.key);
              return (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 transition-colors hover:border-brand/40 hover:bg-brand-soft/25"
                >
                  <div className="min-w-0">
                    <p lang="ku" className="truncate font-semibold">
                      {label.ku}
                    </p>
                    <p className="truncate text-xs text-ink-soft">{label.en}</p>
                  </div>
                  <span className="chip shrink-0">
                    {masteryLabel(item.mastery)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <section className="card p-5">
          <SectionHeading
            icon={<FlameIcon className="size-4" />}
            title="Fragile items"
            tone="clay"
          />
          {weak.length === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">
              Nothing fragile yet. Answer a few items first.
            </p>
          ) : (
            <>
              <ul className="mt-3 space-y-1.5">
                {weak.slice(0, 5).map((item) => {
                  const label = reviewLabel(item.key);
                  return (
                    <li
                      key={item.key}
                      className="flex items-baseline justify-between gap-2 rounded-lg px-1 py-1 text-sm odd:bg-paper/40"
                    >
                      <span lang="ku" className="truncate font-semibold">
                        {label.ku}
                      </span>
                      <span className="shrink-0 text-xs text-ink-soft">
                        {Math.round(item.accuracy * 100)}%
                      </span>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => setSession(weakQueue)}
                className="btn btn-secondary mt-4 w-full"
              >
                Practise fragile items
              </button>
            </>
          )}
        </section>

        <section className="card p-5">
          <SectionHeading
            icon={<SparkIcon className="size-4" />}
            title="Coming up"
            tone="sky"
          />
          {upcoming.length === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">
              No scheduled intervals yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {upcoming.slice(0, 6).map((item) => {
                const label = reviewLabel(item.key);
                return (
                  <li
                    key={item.key}
                    className="flex items-baseline justify-between gap-2 rounded-lg px-1 py-1 text-sm odd:bg-paper/40"
                  >
                    <span lang="ku" className="truncate font-semibold">
                      {label.ku}
                    </span>
                    <span className="shrink-0 text-xs text-ink-soft">
                      {formatDue(item.due)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-4 rounded-xl bg-sky-soft/50 p-3 text-xs leading-relaxed text-ink-soft">
            An incorrect answer brings an item back in 10 minutes. A correct
            answer grows the interval from 1 day to 3 days, then by the item’s
            ease factor.
          </p>
        </section>
      </div>
    </div>
  );
}
