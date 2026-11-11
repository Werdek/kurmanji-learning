import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PreferenceEffects } from "@/components/preference-effects";
import { usePreferences } from "@/lib/store/preferences";

afterEach(() => {
  usePreferences.getState().resetPreferences();
  delete document.documentElement.dataset.contrast;
  delete document.documentElement.dataset.textSize;
  document.documentElement.classList.remove("reduce-motion");
});

describe("PreferenceEffects", () => {
  it("mirrors preferences onto the document root", async () => {
    render(<PreferenceEffects />);

    usePreferences.getState().setPreference("highContrast", true);
    usePreferences.getState().setPreference("largeText", true);
    usePreferences.getState().setPreference("reduceMotion", true);

    await waitFor(() => {
      expect(document.documentElement.dataset.contrast).toBe("high");
      expect(document.documentElement.dataset.textSize).toBe("large");
      expect(document.documentElement.classList.contains("reduce-motion")).toBe(
        true,
      );
    });
  });

  it("returns the document root to defaults", async () => {
    render(<PreferenceEffects />);

    usePreferences.getState().setPreference("highContrast", true);
    await waitFor(() =>
      expect(document.documentElement.dataset.contrast).toBe("high"),
    );

    usePreferences.getState().setPreference("highContrast", false);
    await waitFor(() =>
      expect(document.documentElement.dataset.contrast).toBe("normal"),
    );
  });
});
