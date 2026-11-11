"use client";

import { useEffect, useState } from "react";
import { checkMultipleChoice } from "@/lib/grading";
import { cn } from "@/lib/utils";
import type { WidgetProps } from "./types";
import type { MultipleChoiceExercise } from "@/content/schema";

export function MultipleChoice({
  exercise,
  disabled,
  onSubmit,
}: WidgetProps<MultipleChoiceExercise>) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [exercise.id]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (selected) onSubmit(checkMultipleChoice(exercise, selected));
      }}
    >
      <fieldset disabled={disabled}>
        <legend className="sr-only">{exercise.prompt}</legend>
        <div className="grid gap-2.5">
          {exercise.options.map((option, index) => {
            const active = selected === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  "group flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3.5 transition-all",
                  active
                    ? "border-brand bg-brand-soft shadow-[inset_0_0_0_1px_var(--color-brand)]"
                    : "border-line bg-surface hover:border-brand/50 hover:bg-brand-soft/40",
                  disabled && "cursor-default",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-lg text-xs font-black transition-colors",
                    active
                      ? "bg-brand text-white"
                      : "bg-surface-muted text-ink-soft group-hover:bg-surface group-hover:text-brand",
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-[0.98rem] leading-snug">
                  {option.text}
                </span>
                <input
                  type="radio"
                  name={`choice-${exercise.id}`}
                  value={option.id}
                  checked={active}
                  onChange={() => setSelected(option.id)}
                  className="size-4 shrink-0 accent-brand"
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="btn btn-primary w-full sm:w-auto"
          disabled={!selected || disabled}
        >
          Check answer
        </button>
      </div>
    </form>
  );
}
