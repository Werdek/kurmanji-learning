"use client";

import { useEffect, useMemo, useState } from "react";
import type { VocabularyMatchExercise } from "@/content/schema";
import { checkVocabularyMatch } from "@/lib/grading";
import { cn, seededShuffle } from "@/lib/utils";
import type { WidgetProps } from "./types";

export function VocabularyMatch({
  exercise,
  disabled,
  onSubmit,
}: WidgetProps<VocabularyMatchExercise>) {
  const kuOrder = useMemo(
    () =>
      seededShuffle(
        exercise.pairs.map((pair, pairIndex) => ({
          pairIndex,
          ku: pair.ku,
        })),
        `${exercise.id}-ku`,
      ),
    [exercise],
  );

  const enOrder = useMemo(
    () =>
      seededShuffle(
        exercise.pairs.map((pair, pairIndex) => ({
          pairIndex,
          en: pair.en,
        })),
        `${exercise.id}-en`,
      ),
    [exercise],
  );

  const [selectedKu, setSelectedKu] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelectedKu(null);
    setMatches({});
    setSubmitted(false);
  }, [exercise.id]);

  const matchedCount = Object.keys(matches).length;
  const allMatched = matchedCount === exercise.pairs.length;

  function labelForKu(pairIndex: number): number | null {
    if (matches[pairIndex] === undefined) return null;
    const position = kuOrder.findIndex(
      (entry) => entry.pairIndex === pairIndex,
    );
    return position >= 0 ? position + 1 : null;
  }

  function labelForEn(pairIndex: number): number | null {
    const match = kuOrder.find(
      (entry) => matches[entry.pairIndex] === pairIndex,
    );
    return match ? kuOrder.indexOf(match) + 1 : null;
  }

  function chooseKu(pairIndex: number) {
    if (disabled || submitted) return;
    setSelectedKu(pairIndex);
    setMatches((current) => {
      const next = { ...current };
      delete next[pairIndex];
      return next;
    });
  }

  function chooseEn(pairIndex: number) {
    if (disabled || submitted) return;

    if (selectedKu === null) {
      setMatches((current) => {
        const next = { ...current };
        for (const key of Object.keys(next)) {
          if (next[Number(key)] === pairIndex) delete next[Number(key)];
        }
        return next;
      });
      return;
    }

    setMatches((current) => {
      const next = { ...current };
      for (const key of Object.keys(next)) {
        if (next[Number(key)] === pairIndex) delete next[Number(key)];
      }
      next[selectedKu] = pairIndex;
      return next;
    });
    setSelectedKu(null);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!allMatched) return;
        setSubmitted(true);
        onSubmit(checkVocabularyMatch(exercise, matches));
      }}
    >
      <p className="mb-3 text-sm text-ink-soft">
        Tap a Kurdish item, then its English match.
      </p>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        <div>
          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
            Kurdish
          </p>
          <div className="grid gap-2">
            {kuOrder.map((entry) => {
              const label = labelForKu(entry.pairIndex);
              const isSelected = selectedKu === entry.pairIndex;
              const isCorrect =
                submitted && matches[entry.pairIndex] === entry.pairIndex;
              const isWrong =
                submitted &&
                matches[entry.pairIndex] !== undefined &&
                !isCorrect;

              return (
                <button
                  key={entry.pairIndex}
                  type="button"
                  onClick={() => chooseKu(entry.pairIndex)}
                  disabled={disabled || submitted}
                  aria-pressed={isSelected}
                  lang="ku"
                  className={cn(
                    "flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-[0.95rem] font-semibold transition-colors",
                    isSelected
                      ? "border-brand bg-brand-soft text-brand-dark"
                      : "border-line bg-surface hover:border-brand/50",
                    label !== null && !isSelected && "border-brand/40",
                    isCorrect && "border-brand bg-brand-soft text-brand-dark",
                    isWrong && "border-clay bg-clay-soft text-clay",
                    disabled && "cursor-default",
                  )}
                >
                  <span>{entry.ku}</span>
                  {label !== null ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold text-white",
                        isWrong ? "bg-clay" : "bg-brand",
                      )}
                    >
                      {label}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
            English
          </p>
          <div className="grid gap-2">
            {enOrder.map((entry) => {
              const label = labelForEn(entry.pairIndex);
              return (
                <button
                  key={entry.pairIndex}
                  type="button"
                  onClick={() => chooseEn(entry.pairIndex)}
                  disabled={disabled || submitted}
                  className={cn(
                    "flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-[0.95rem] transition-colors",
                    label !== null
                      ? "border-brand/40 bg-surface"
                      : "border-line bg-surface hover:border-brand/50",
                    disabled && "cursor-default",
                  )}
                >
                  <span>{entry.en}</span>
                  {label !== null ? (
                    <span
                      aria-hidden="true"
                      className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-[0.65rem] font-bold text-white"
                    >
                      {label}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => {
            setMatches({});
            setSelectedKu(null);
          }}
          disabled={disabled || submitted || matchedCount === 0}
          className="btn btn-ghost"
        >
          Clear pairs
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={disabled || !allMatched}
        >
          Check matches{" "}
          {allMatched ? "" : `(${matchedCount}/${exercise.pairs.length})`}
        </button>
      </div>
    </form>
  );
}
