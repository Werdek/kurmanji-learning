"use client";

import { create } from "zustand";
import type { Exercise } from "@/content/schema";
import type { ExerciseResult } from "@/lib/grading";

export type SessionMode = "lesson" | "review";
export type SessionPhase = "answering" | "feedback" | "complete";

type StartArgs = {
  lessonId: string;
  mode: SessionMode;
  queue: Exercise[];
};

type SessionState = {
  sessionId: number;
  lessonId: string | null;
  mode: SessionMode;
  queue: Exercise[];
  index: number;
  phase: SessionPhase;
  results: ExerciseResult[];
  lastResult: ExerciseResult | null;
  startedAt: number;
  itemStartedAt: number;
  start: (args: StartArgs) => void;
  submit: (result: ExerciseResult) => void;
  next: () => void;
  reset: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: 0,
  lessonId: null,
  mode: "lesson",
  queue: [],
  index: 0,
  phase: "answering",
  results: [],
  lastResult: null,
  startedAt: 0,
  itemStartedAt: 0,

  start: ({ lessonId, mode, queue }) =>
    set((state) => ({
      sessionId: state.sessionId + 1,
      lessonId,
      mode,
      queue,
      index: 0,
      phase: "answering",
      results: [],
      lastResult: null,
      startedAt: Date.now(),
      itemStartedAt: Date.now(),
    })),

  submit: (result) =>
    set((state) => ({
      phase: "feedback",
      lastResult: result,
      results: [...state.results, result],
    })),

  next: () =>
    set((state) => {
      const nextIndex = state.index + 1;
      if (nextIndex >= state.queue.length) {
        return { phase: "complete", lastResult: null };
      }
      return {
        phase: "answering",
        index: nextIndex,
        lastResult: null,
        itemStartedAt: Date.now(),
      };
    }),

  reset: () =>
    set({
      sessionId: 0,
      lessonId: null,
      mode: "lesson",
      queue: [],
      index: 0,
      phase: "answering",
      results: [],
      lastResult: null,
      startedAt: 0,
      itemStartedAt: 0,
    }),
}));
