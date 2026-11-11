import { beforeEach, describe, expect, it } from "vitest";
import { defaultPreferences, usePreferences } from "@/lib/store/preferences";

describe("preferences store", () => {
  beforeEach(() => {
    localStorage.clear();
    usePreferences.getState().resetPreferences();
  });

  it("starts from the documented defaults", () => {
    const state = usePreferences.getState();
    expect(state.reduceMotion).toBe(defaultPreferences.reduceMotion);
    expect(state.highContrast).toBe(defaultPreferences.highContrast);
    expect(state.largeText).toBe(defaultPreferences.largeText);
    expect(state.soundEnabled).toBe(defaultPreferences.soundEnabled);
  });

  it("updates one preference without disturbing the others", () => {
    usePreferences.getState().setPreference("highContrast", true);

    const state = usePreferences.getState();
    expect(state.highContrast).toBe(true);
    expect(state.reduceMotion).toBe(false);
    expect(state.largeText).toBe(false);
  });

  it("persists display preferences to localStorage", () => {
    usePreferences.getState().setPreference("largeText", true);

    const stored = JSON.parse(
      localStorage.getItem("kurmanji-preferences") ?? "{}",
    ) as { state?: { largeText?: boolean } };

    expect(stored.state?.largeText).toBe(true);
  });

  it("resets every preference to its default", () => {
    usePreferences.getState().setPreference("reduceMotion", true);
    usePreferences.getState().setPreference("highContrast", true);
    usePreferences.getState().setPreference("soundEnabled", false);
    usePreferences.getState().resetPreferences();

    const state = usePreferences.getState();
    expect(state.reduceMotion).toBe(false);
    expect(state.highContrast).toBe(false);
    expect(state.largeText).toBe(false);
    expect(state.soundEnabled).toBe(true);
  });
});
