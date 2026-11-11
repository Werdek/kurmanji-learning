"use client";

import { useEffect, useRef, useState } from "react";
import type { FillInTheBlankExercise } from "@/content/schema";
import { checkFillInTheBlank } from "@/lib/grading";
import { KurdishKeys, insertAtCursor } from "./kurdish-keys";
import type { WidgetProps } from "./types";

export function FillInTheBlank({
  exercise,
  disabled,
  onSubmit,
}: WidgetProps<FillInTheBlankExercise>) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
  }, [exercise.id]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (value.trim().length === 0) return;
        onSubmit(checkFillInTheBlank(exercise, value));
      }}
    >
      <p className="mb-2 text-sm text-ink-soft">{exercise.translation}</p>

      <div className="rounded-xl border border-line bg-paper/60 px-4 py-5">
        <label htmlFor={`blank-${exercise.id}`} className="sr-only">
          {exercise.prompt}
        </label>
        <p className="text-lg leading-loose sm:text-xl">
          <span className="whitespace-pre">{exercise.before}</span>
          <input
            ref={inputRef}
            id={`blank-${exercise.id}`}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            lang="ku"
            placeholder="…"
            style={{ width: `${Math.max(4, value.length + 2)}ch` }}
            className="mx-1 inline-block min-h-10 rounded-lg border-b-2 border-brand bg-surface px-2 py-1 text-center font-semibold text-brand-dark outline-none placeholder:text-ink-soft/50 focus:bg-brand-soft disabled:opacity-70"
          />
          <span className="whitespace-pre">{exercise.after}</span>
        </p>
      </div>

      <KurdishKeys
        disabled={disabled}
        onInsert={(character) =>
          insertAtCursor(inputRef.current, value, character, setValue)
        }
      />

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="btn btn-primary w-full sm:w-auto"
          disabled={disabled || value.trim().length === 0}
        >
          Check answer
        </button>
      </div>
    </form>
  );
}
