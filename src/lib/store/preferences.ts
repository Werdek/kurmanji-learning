"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PreferenceKey =
  "reduceMotion" | "highContrast" | "largeText" | "soundEnabled";

type Preferences = Record<PreferenceKey, boolean> & {
  setPreference: (key: PreferenceKey, value: boolean) => void;
  resetPreferences: () => void;
};

export const defaultPreferences: Record<PreferenceKey, boolean> = {
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  soundEnabled: true,
};

/**
 * Display preferences are device-level, so they live in localStorage rather
 * than in the learner's IndexedDB progress. They are deliberately not part of
 * the JSON progress backup.
 */
export const usePreferences = create<Preferences>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      setPreference: (key, value) => set({ [key]: value }),
      resetPreferences: () => set({ ...defaultPreferences }),
    }),
    {
      name: "kurmanji-preferences",
      version: 1,
      partialize: (state) => ({
        reduceMotion: state.reduceMotion,
        highContrast: state.highContrast,
        largeText: state.largeText,
        soundEnabled: state.soundEnabled,
      }),
    },
  ),
);
