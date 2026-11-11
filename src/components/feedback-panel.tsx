"use client";

import { forwardRef } from "react";
import type { Exercise } from "@/content/schema";
import { mistakeTagLabel, type ExerciseResult } from "@/lib/grading";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CheckIcon,
  InfoIcon,
  SparkIcon,
  XIcon,
} from "@/components/icons";

type Props = {
  exercise: Exercise;
  result: ExerciseResult;
  isLast: boolean;
  onContinue: () => void;
};

export const FeedbackPanel = forwardRef<HTMLElement, Props>(
  function FeedbackPanel({ exercise, result, isLast, onContinue }, ref) {
    const state = result.correct ? "correct" : "incorrect";

    const title =
      state === "correct" ? "Rast e — correct!" : "Ne rast e — not quite";

    const subtitle =
      state === "correct"
        ? "That is the form a Kurmanji speaker would use."
        : result.hintsUsed > 0
          ? "You used a hint, so the review interval grows more slowly."
          : "Read why, then meet this item again in review.";

    const optionNote =
      exercise.kind === "multipleChoice" && result.choiceId
        ? exercise.optionExplanations[result.choiceId]
        : undefined;

    const tags = result.errorTags;

    return (
      <section
        ref={ref}
        aria-live="polite"
        className={cn(
          "card relative mt-4 scroll-mt-24 overflow-hidden border-t-4 p-5 sm:p-6",
          state === "correct" && "animate-pop border-t-brand bg-brand-soft/30",
          state === "incorrect" &&
            "animate-shake border-t-clay bg-clay-soft/30",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -right-12 -top-16 size-40 rounded-full blur-3xl",
            state === "correct" ? "bg-brand-soft" : "bg-clay-soft",
          )}
        />
        <div className="relative flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full text-white shadow-[0_3px_0_rgb(27_42_37/0.15)]",
              state === "correct" && "animate-pop bg-brand",
              state === "incorrect" && "bg-clay",
            )}
          >
            {state === "correct" ? <CheckIcon /> : <XIcon />}
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-black tracking-tight">{title}</h2>
            <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
              {subtitle}
            </p>
          </div>
          {state === "correct" ? (
            <span
              aria-hidden="true"
              className="ml-auto hidden shrink-0 items-center gap-0.5 text-sun sm:flex"
            >
              <SparkIcon className="size-4" />
              <SparkIcon className="size-3" />
              <SparkIcon className="size-5" />
            </span>
          ) : null}
        </div>

        {state !== "correct" || result.hintsUsed > 0 ? (
          <div className="relative mt-4 rounded-xl border border-line bg-surface p-3.5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
              Correct answer
            </p>
            <p
              lang="ku"
              className="mt-1 break-words font-mono text-base font-semibold text-brand-dark sm:text-lg"
            >
              {result.expected}
            </p>
          </div>
        ) : null}

        {optionNote ? (
          <p className="relative mt-3 rounded-lg bg-surface/80 px-3 py-2 text-sm text-clay">
            {optionNote}
          </p>
        ) : null}

        <div className="relative mt-4 flex items-start gap-2 rounded-xl bg-surface/60 p-3">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-ink-soft" />
          <p className="text-sm leading-relaxed text-ink">
            {exercise.explanation}
          </p>
        </div>

        {tags.length > 0 ? (
          <div className="relative mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="chip border-clay/30 text-clay">
                {mistakeTagLabel(tag)}
              </span>
            ))}
          </div>
        ) : null}

        <div className="relative mt-4 flex flex-wrap items-center gap-2 border-t border-line/70 pt-3">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
            Sources
          </span>
          {exercise.sourceRefs.map((source) => (
            <span key={source} className="chip">
              {source}
            </span>
          ))}
          <span className="chip border-brand/30 bg-brand-soft/60 text-brand-dark">
            {exercise.reviewStatus}
          </span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          autoFocus
          className="btn btn-primary relative mt-4 w-full sm:w-auto"
        >
          {isLast ? "See results" : "Continue"}
          <ArrowRightIcon className="size-4" />
        </button>
      </section>
    );
  },
);
