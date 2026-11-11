"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ExerciseRenderer } from "@/components/exercises";
import { FeedbackPanel } from "@/components/feedback-panel";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  BulbIcon,
  CheckIcon,
  FlameIcon,
  PenIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
} from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { SoundToggle } from "@/components/sound-toggle";
import { StatCard } from "@/components/stat-card";
import { playableLessons } from "@/content";
import type { Exercise, Lesson } from "@/content/schema";
import {
  markLessonComplete,
  recordExerciseResult,
} from "@/lib/db/repositories";
import { sessionAccuracy, type ExerciseResult } from "@/lib/grading";
import { exerciseKindLabel, skillLabel } from "@/lib/labels";
import { playSound } from "@/lib/sound";
import { useSessionStore, type SessionMode } from "@/lib/store/session";
import { percent, unitNumber } from "@/lib/utils";

type Props = {
  lesson: Lesson;
  exercises: Exercise[];
  mode?: SessionMode;
  onExit?: () => void;
  onComplete?: () => void;
};

function DialogueCard({ lesson }: { lesson: Lesson }) {
  return (
    <details
      open
      className="card group mb-4 overflow-hidden p-0 [&::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer select-none items-center justify-between gap-3 border-b border-line/70 bg-paper/60 px-4 py-3 transition-colors hover:bg-paper">
        <span className="flex items-center gap-2 text-sm font-bold">
          <span className="icon-badge size-7 rounded-lg bg-brand-soft text-brand">
            <BookIcon className="size-4" />
          </span>
          Dialogue · {lesson.titleKu}
        </span>
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
          Tap to {""}
          <span className="group-open:hidden">open</span>
          <span className="hidden group-open:inline">close</span>
        </span>
      </summary>
      <ol className="space-y-3 px-4 py-4">
        {lesson.inputDialogue.map((line, index) => (
          <li
            key={`${line.speaker}-${index}`}
            className="flex gap-3 rounded-xl px-1 py-0.5"
          >
            <span className="mt-0.5 inline-flex h-6 min-w-14 items-center justify-center rounded-full bg-brand-soft px-2 text-[0.65rem] font-bold uppercase tracking-wide text-brand-dark">
              {line.speaker}
            </span>
            <div>
              <p lang="ku" className="font-semibold leading-snug">
                {line.ku}
              </p>
              <p className="text-sm text-ink-soft">{line.en}</p>
            </div>
          </li>
        ))}
      </ol>
    </details>
  );
}

const CONFETTI_COLORS = ["#e3a03a", "#1f6f5c", "#a84a32", "#3d7c9f", "#f2bd61"];

function Confetti() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {Array.from({ length: 22 }).map((_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            left: `${(index * 37) % 100}%`,
            animationDelay: `${(index % 7) * 0.11}s`,
            animationDuration: `${1.8 + (index % 5) * 0.18}s`,
            backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
          }}
        />
      ))}
    </div>
  );
}

export function LessonScreen({
  lesson,
  exercises,
  mode = "lesson",
  onExit,
  onComplete,
}: Props) {
  const {
    queue,
    index,
    phase,
    results,
    lastResult,
    itemStartedAt,
    start,
    submit,
    next,
  } = useSessionStore();

  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [saving, setSaving] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const feedbackRef = useRef<HTMLElement>(null);
  const startedRef = useRef("");
  const completedRef = useRef(false);

  useEffect(() => {
    const key = `${lesson.id}:${mode}`;
    if (startedRef.current === key) return;
    startedRef.current = key;
    completedRef.current = false;
    setHintsUsed(0);
    setShowHint(false);
    setStorageError(null);
    start({ lessonId: lesson.id, mode, queue: exercises });
  }, [lesson.id, mode, exercises, start]);

  useEffect(() => {
    setHintsUsed(0);
    setShowHint(false);
  }, [index]);

  useEffect(() => {
    if (phase === "feedback") {
      feedbackRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "complete") {
      window.scrollTo({ top: 0 });
    }
  }, [phase]);

  const accuracy = sessionAccuracy(results);

  let combo = 0;
  for (let position = results.length - 1; position >= 0; position -= 1) {
    const result = results[position];
    if (!result?.correct) break;
    combo += 1;
  }

  useEffect(() => {
    if (phase !== "complete" || completedRef.current) {
      return;
    }
    completedRef.current = true;
    playSound("complete");
    if (mode === "lesson") {
      void markLessonComplete(lesson.id, accuracy);
    }
    onComplete?.();
  }, [phase, mode, lesson.id, accuracy, onComplete]);

  const current = queue[index];

  if (!current) {
    return (
      <div className="card p-8">
        <p className="text-sm text-ink-soft">Preparing lesson…</p>
      </div>
    );
  }

  if (phase === "complete") {
    const scored = results.filter((result) => result.scored);
    const correct = scored.filter((result) => result.correct).length;
    const xp = scored.reduce(
      (total, result) => total + (result.correct ? 10 : 2),
      0,
    );
    const currentIndex = playableLessons.findIndex(
      (candidate) => candidate.id === lesson.id,
    );
    const nextLesson =
      currentIndex >= 0 ? playableLessons[currentIndex + 1] : undefined;

    return (
      <div className="mx-auto max-w-2xl">
        <div className="card relative overflow-hidden">
          <Confetti />
          <div className="relative overflow-hidden bg-brand px-6 py-8 text-white">
            <div
              aria-hidden="true"
              className="hero-pattern absolute inset-0 opacity-30"
            />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="grid size-14 place-items-center rounded-full bg-white/15 ring-4 ring-white/10">
                  <TrophyIcon className="size-8" />
                </span>
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-white/90">
                  {mode === "review" ? "Review complete" : "Lesson complete"}
                </p>
                <h1 className="mt-1 text-3xl font-black tracking-tight">
                  Temam bû!
                </h1>
                <p className="mt-1 text-white/90">
                  {lesson.titleEn} · {lesson.titleKu}
                </p>
              </div>
              <Mascot cheer className="hidden w-24 shrink-0 sm:block" />
            </div>
          </div>

          <div className="relative p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard
                label="Accuracy"
                value={`${percent(accuracy, 1)}%`}
                tone="brand"
                icon={<TargetIcon className="size-4" />}
              />
              <StatCard
                label="Correct"
                value={`${correct}/${scored.length}`}
                tone="sun"
                icon={<CheckIcon className="size-4" />}
              />
              <StatCard
                label="XP earned"
                value={`+${xp}`}
                tone="clay"
                icon={<StarIcon className="size-4" />}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Reviews are scheduled from accuracy, not from a timer. You can
              repeat this lesson immediately, and nothing is locked.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              {mode === "lesson" && nextLesson ? (
                <Link
                  href={`/learn/${nextLesson.id}`}
                  className="btn btn-primary"
                >
                  Next: {nextLesson.titleEn}
                  <ArrowRightIcon />
                </Link>
              ) : null}
              {mode === "review" && onExit ? (
                <button
                  type="button"
                  onClick={onExit}
                  className="btn btn-primary"
                >
                  Back to review
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  completedRef.current = false;
                  start({ lessonId: lesson.id, mode, queue: exercises });
                }}
                className="btn btn-secondary"
              >
                <PenIcon /> Practise again
              </button>
              <Link
                href={mode === "review" ? "/review" : "/"}
                className="btn btn-ghost"
              >
                {mode === "review" ? "Review hub" : "Back to path"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = percent(
    index + (phase === "feedback" ? 1 : 0),
    queue.length,
  );
  const isLast = index === queue.length - 1;
  const disabled = phase !== "answering" || saving;

  async function handleAnswer(result: ExerciseResult) {
    if (!current || saving) return;
    playSound(result.correct ? "correct" : "incorrect");

    const enriched: ExerciseResult = {
      ...result,
      hintsUsed,
      outcomes: result.outcomes.map((outcome) => ({
        ...outcome,
        hintsUsed,
      })),
    };

    setSaving(true);
    setStorageError(null);
    try {
      await recordExerciseResult({
        lessonId: lesson.id,
        unitId: lesson.unitId,
        exercise: current,
        result: enriched,
        latencyMs: Date.now() - itemStartedAt,
      });
    } catch {
      setStorageError(
        "Progress could not be saved in this browser. You can keep practising, but this attempt will not appear in review.",
      );
    } finally {
      submit(enriched);
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={mode === "review" ? "/review" : "/"}
          className="btn btn-secondary min-h-9 px-3 text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          {mode === "review" ? "Review" : "Path"}
        </Link>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-bold leading-tight">{lesson.titleEn}</p>
            <p className="text-xs text-ink-soft">
              {mode === "review"
                ? "Spaced review"
                : `Unit ${unitNumber(lesson.unitId)} · Lesson ${lesson.index}`}
            </p>
          </div>
          <SoundToggle />
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
          Question {Math.min(index + 1, queue.length)} of {queue.length}
        </p>
        <div className="flex items-center gap-2">
          {combo >= 2 ? (
            <span className="chip border-sun/70 bg-sun-soft text-sun-ink">
              <FlameIcon className="size-3.5" />
              {combo} in a row
            </span>
          ) : null}
          <span className="text-xs font-black text-brand">{progress}%</span>
        </div>
      </div>

      <div
        className="mb-6 h-3 overflow-hidden rounded-full border border-line/60 bg-surface-muted shadow-inner"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Lesson progress"
      >
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-brand via-brand to-sun transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-4 bg-white/25"
          />
          <span
            aria-hidden="true"
            className="absolute inset-y-1 right-1 w-1 rounded-full bg-white/60"
          />
        </div>
      </div>

      {lesson.inputDialogue.length > 0 && index === 0 ? (
        <DialogueCard lesson={lesson} />
      ) : null}

      <section
        key={current.id}
        className="card animate-rise relative overflow-hidden p-5 sm:p-7"
        aria-busy={saving}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-sun to-brand"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-brand-soft/40 blur-3xl"
        />
        <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip border-brand/30 bg-brand-soft/70 text-brand-dark">
              {exerciseKindLabel(current.kind)}
            </span>
            <span className="chip">{skillLabel(current.skill)}</span>
          </div>
          {phase === "answering" && current.hints.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setShowHint(true);
                setHintsUsed(1);
              }}
              className="btn btn-ghost min-h-8 border border-line/70 bg-surface px-3 text-xs"
              disabled={showHint || saving}
            >
              <BulbIcon className="size-4 text-sun-ink" />
              {showHint ? "Hint shown" : "Hint"}
            </button>
          ) : null}
        </div>

        <h1 className="relative text-xl font-black leading-snug tracking-tight sm:text-2xl">
          {current.prompt}
        </h1>

        {showHint && current.hints[0] ? (
          <p className="relative mt-3 flex items-start gap-2 rounded-xl border border-sun/40 bg-sun-soft/70 px-3.5 py-2.5 text-sm">
            <BulbIcon className="mt-0.5 size-4 shrink-0 text-sun-ink" />
            {current.hints[0]}
          </p>
        ) : null}

        <div className="relative mt-5">
          <ExerciseRenderer
            exercise={current}
            disabled={disabled}
            onSubmit={(result) => {
              void handleAnswer(result);
            }}
          />
        </div>
      </section>

      {storageError ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-clay/40 bg-clay-soft p-3 text-sm text-clay"
        >
          {storageError}
        </p>
      ) : null}

      {phase === "feedback" && lastResult ? (
        <FeedbackPanel
          ref={feedbackRef}
          exercise={current}
          result={lastResult}
          isLast={isLast}
          onContinue={next}
        />
      ) : null}

      <p className="mt-4 text-center text-xs text-ink-soft">
        {mode === "review"
          ? "Practice is unlimited. Nothing is locked or timed."
          : "Leave at any time — progress is saved after every answer."}
      </p>
    </div>
  );
}
