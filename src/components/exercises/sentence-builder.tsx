"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useEffect, useState } from "react";
import type { SentenceBuilderExercise } from "@/content/schema";
import { checkSentenceBuilder } from "@/lib/grading";
import { cn, seededShuffle } from "@/lib/utils";
import type { WidgetProps } from "./types";

type Token = { uid: string; text: string };

function AnswerToken({
  token,
  disabled,
  onRemove,
}: {
  token: Token;
  disabled: boolean;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: token.uid, disabled });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
      }}
      className={cn(
        "flex items-center gap-1 rounded-xl border border-brand/40 bg-brand-soft py-1 pl-2.5 pr-1 text-[0.95rem] font-semibold text-brand-dark shadow-sm",
        isDragging && "opacity-90 shadow-lift",
      )}
    >
      <span
        {...attributes}
        {...listeners}
        className={cn(
          "select-none py-1",
          disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        )}
      >
        {token.text}
      </span>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${token.text}`}
        className="grid size-7 place-items-center rounded-lg text-brand-dark/60 hover:bg-surface hover:text-clay disabled:opacity-40"
      >
        ×
      </button>
    </li>
  );
}

export function SentenceBuilder({
  exercise,
  disabled,
  onSubmit,
}: WidgetProps<SentenceBuilderExercise>) {
  const makeTokens = useCallback(
    () =>
      seededShuffle(
        [...exercise.tokens, ...exercise.distractors].map((text, index) => ({
          uid: `${exercise.id}-t${index}`,
          text,
        })),
        exercise.id,
      ),
    [exercise],
  );

  const [bank, setBank] = useState<Token[]>(makeTokens);
  const [answer, setAnswer] = useState<Token[]>([]);

  useEffect(() => {
    setBank(makeTokens());
    setAnswer([]);
  }, [makeTokens]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setAnswer((items) => {
      const oldIndex = items.findIndex((item) => item.uid === active.id);
      const newIndex = items.findIndex((item) => item.uid === over.id);
      if (oldIndex < 0 || newIndex < 0) return items;
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (answer.length === 0) return;
        onSubmit(
          checkSentenceBuilder(
            exercise,
            answer.map((token) => token.text),
          ),
        );
      }}
    >
      <p className="mb-2 text-sm text-ink-soft">{exercise.translation}</p>

      <div className="rounded-xl border-2 border-dashed border-line bg-paper/60 p-3">
        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
          Your sentence
        </p>
        {answer.length === 0 ? (
          <p className="py-3 text-sm text-ink-soft">
            Tap or drag words here to build the sentence.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={answer.map((token) => token.uid)}
              strategy={horizontalListSortingStrategy}
            >
              <ul className="flex flex-wrap items-center gap-2">
                {answer.map((token) => (
                  <AnswerToken
                    key={token.uid}
                    token={token}
                    disabled={disabled}
                    onRemove={() => {
                      if (disabled) return;
                      setAnswer((items) =>
                        items.filter((item) => item.uid !== token.uid),
                      );
                      setBank((items) => [...items, token]);
                    }}
                  />
                ))}
                <li
                  aria-hidden="true"
                  className="px-1 text-xl font-bold text-ink-soft"
                >
                  {exercise.punctuation}
                </li>
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
          Word bank
        </p>
        <div className="flex flex-wrap gap-2">
          {bank.length === 0 ? (
            <p className="text-sm text-ink-soft">All words used.</p>
          ) : (
            bank.map((token) => (
              <button
                key={token.uid}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setBank((items) =>
                    items.filter((item) => item.uid !== token.uid),
                  );
                  setAnswer((items) => [...items, token]);
                }}
                className="min-h-11 rounded-xl border border-line bg-surface px-3 py-1.5 text-[0.95rem] font-semibold shadow-sm transition-colors hover:border-brand hover:bg-brand-soft disabled:opacity-50"
              >
                {token.text}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="btn btn-primary w-full sm:w-auto"
          disabled={disabled || answer.length === 0}
        >
          Check answer
        </button>
      </div>
    </form>
  );
}
