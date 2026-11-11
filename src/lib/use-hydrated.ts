"use client";

import { useEffect, useState } from "react";

/**
 * True only after hydration. Use it before rendering IndexedDB-backed data so
 * server markup and the first client render stay identical.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
