"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { ArrowRightIcon, FlameIcon, StarIcon } from "@/components/icons";
import { ProgressRing } from "@/components/progress-ring";
import { playableLessons } from "@/content";
import { getLearnerSnapshot } from "@/lib/db/repositories";
import { useHydrated } from "@/lib/use-hydrated";
import { percent } from "@/lib/utils";

/** A compact, live progress summary shown at the bottom of the desktop sidebar. */
export function SidebarProgress() {
  const hydrated = useHydrated();
  const snapshot = useLiveQuery(() => getLearnerSnapshot(), []);

  if (!hydrated || !snapshot) {
    return (
      <div
        className="h-[8.9rem] animate-pulse rounded-2xl border border-line/70 bg-surface-muted/60"
        aria-hidden="true"
      />
    );
  }

  const { profile } = snapshot;
  const done = playableLessons.filter(
    (lesson) => profile.completedLessons[lesson.id],
  ).length;
  const total = playableLessons.length;
  const value = percent(done, total);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-surface via-surface to-brand-tint p-4 shadow-card">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-8 size-20 rounded-full bg-sun-soft/70 blur-xl"
      />
      <div className="relative flex items-center gap-3">
        <ProgressRing
          value={value}
          size={54}
          stroke={6}
          label={`A1–A2 progress: ${value}%`}
        >
          <span className="text-[0.7rem] font-black text-brand">{value}%</span>
        </ProgressRing>
        <div className="min-w-0">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-brand">
            Your journey
          </p>
          <p className="text-sm font-black leading-tight">
            {done} / {total} lessons
          </p>
          <p className="text-[0.66rem] text-ink-soft">A1–A2 path</p>
        </div>
      </div>
      <div className="relative mt-3 flex items-center gap-1.5">
        <span className="chip flex-1 justify-center border-sun/40 bg-sun-soft/80 text-sun-ink">
          <StarIcon className="size-3.5" />
          {profile.xp} XP
        </span>
        <span className="chip flex-1 justify-center border-clay/25 bg-clay-soft/70 text-clay">
          <FlameIcon className="size-3.5" />
          {profile.streak || 0}d
        </span>
      </div>
      <Link
        href="/progress"
        className="relative mt-2.5 flex items-center justify-between rounded-lg px-1 py-0.5 text-[0.68rem] font-bold text-brand transition-colors hover:text-brand-dark"
      >
        View progress
        <ArrowRightIcon className="size-3.5" />
      </Link>
    </div>
  );
}
