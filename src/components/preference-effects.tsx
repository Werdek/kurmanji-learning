"use client";

import { useEffect } from "react";
import { usePreferences } from "@/lib/store/preferences";

/**
 * Mirrors the persisted display preferences onto the document root so plain
 * CSS can respond to them without every component reading the store.
 */
export function PreferenceEffects() {
  const reduceMotion = usePreferences((state) => state.reduceMotion);
  const highContrast = usePreferences((state) => state.highContrast);
  const largeText = usePreferences((state) => state.largeText);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("reduce-motion", reduceMotion);
    root.dataset.contrast = highContrast ? "high" : "normal";
    root.dataset.textSize = largeText ? "large" : "normal";
  }, [reduceMotion, highContrast, largeText]);

  return null;
}
