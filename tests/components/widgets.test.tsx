import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { exerciseById } from "@/content";
import type { ExerciseResult } from "@/lib/grading";
import type {
  FillInTheBlankExercise,
  MultipleChoiceExercise,
  SentenceBuilderExercise,
  VocabularyMatchExercise,
} from "@/content/schema";
import { MultipleChoice } from "@/components/exercises/multiple-choice";
import { FillInTheBlank } from "@/components/exercises/fill-in-the-blank";
import { SentenceBuilder } from "@/components/exercises/sentence-builder";
import { VocabularyMatch } from "@/components/exercises/vocabulary-match";

function requireExercise<T extends string>(
  id: string,
  kind: T,
): Extract<
  | MultipleChoiceExercise
  | FillInTheBlankExercise
  | SentenceBuilderExercise
  | VocabularyMatchExercise,
  { kind: T }
> {
  const found = exerciseById.get(id);
  if (!found || found.kind !== kind) {
    throw new Error(`Missing ${kind} ${id}`);
  }
  return found as Extract<
    | MultipleChoiceExercise
    | FillInTheBlankExercise
    | SentenceBuilderExercise
    | VocabularyMatchExercise,
    { kind: T }
  >;
}

describe("MultipleChoice", () => {
  it("submits the selected option", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(result: ExerciseResult) => void>();
    const exercise = requireExercise("ex.u01.l1.01", "multipleChoice");

    render(
      <MultipleChoice
        exercise={exercise}
        disabled={false}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "I am Anna." }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]?.correct).toBe(true);
  });
});

describe("FillInTheBlank", () => {
  it("accepts a typed copula", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(result: ExerciseResult) => void>();
    const exercise = requireExercise("ex.u01.l1.04", "fillInTheBlank");

    render(
      <FillInTheBlank
        exercise={exercise}
        disabled={false}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByRole("textbox"), "me");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]?.correct).toBe(true);
    expect(onSubmit.mock.calls[0]?.[0]?.expected).toBe("me");
  });
});

describe("SentenceBuilder", () => {
  it("builds the authored order by tapping tokens", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(result: ExerciseResult) => void>();
    const exercise = requireExercise("ex.u01.l1.06", "sentenceBuilder");

    render(
      <SentenceBuilder
        exercise={exercise}
        disabled={false}
        onSubmit={onSubmit}
      />,
    );

    for (const token of ["Ez", "ji", "Almanyayê", "me"]) {
      await user.click(screen.getByRole("button", { name: token }));
    }
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]?.correct).toBe(true);
  });
});

describe("VocabularyMatch", () => {
  it("pairs every Kurdish item with its English match", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(result: ExerciseResult) => void>();
    const exercise = requireExercise("ex.u01.l1.03", "vocabularyMatch");

    render(
      <VocabularyMatch
        exercise={exercise}
        disabled={false}
        onSubmit={onSubmit}
      />,
    );

    const pairs: Array<[string, string]> = [
      ["silav", "hello"],
      ["spas", "thank you"],
      ["roj baş", "good day"],
      ["êvar baş", "good evening"],
      ["şev baş", "good night"],
    ];

    for (const [ku, en] of pairs) {
      await user.click(
        screen.getByRole("button", { name: new RegExp(`^${ku}`) }),
      );
      await user.click(
        screen.getByRole("button", { name: new RegExp(`^${en}`) }),
      );
    }

    await user.click(screen.getByRole("button", { name: /Check matches/ }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const result = onSubmit.mock.calls[0]?.[0];
    expect(result?.correct).toBe(true);
    expect(result?.outcomes).toHaveLength(5);
  });
});
