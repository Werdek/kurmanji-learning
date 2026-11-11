"use client";

import type { Exercise } from "@/content/schema";
import type { ExerciseResult } from "@/lib/grading";
import { FillInTheBlank } from "./fill-in-the-blank";
import { MultipleChoice } from "./multiple-choice";
import { SentenceBuilder } from "./sentence-builder";
import { VocabularyMatch } from "./vocabulary-match";

export type { WidgetProps } from "./types";

export function ExerciseRenderer({
  exercise,
  disabled,
  onSubmit,
}: {
  exercise: Exercise;
  disabled: boolean;
  onSubmit: (result: ExerciseResult) => void;
}) {
  switch (exercise.kind) {
    case "multipleChoice":
      return (
        <MultipleChoice
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "fillInTheBlank":
      return (
        <FillInTheBlank
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "sentenceBuilder":
      return (
        <SentenceBuilder
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "vocabularyMatch":
      return (
        <VocabularyMatch
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    default: {
      const exhaustive: never = exercise;
      return exhaustive;
    }
  }
}
