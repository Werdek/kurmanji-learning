"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import {
  ChartIcon,
  CheckIcon,
  FlameIcon,
  GearIcon,
  StarIcon,
  TargetIcon,
} from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { PageHeader } from "@/components/page-header";
import { ProgressRing } from "@/components/progress-ring";
import { SectionHeading } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import {
  contentBundle,
  getUnitLessons,
  grammarById,
  lexemeById,
} from "@/content";
import type { ReviewDomain } from "@/content/schema";
import { getLearnerSnapshot } from "@/lib/db/repositories";
import { masteryLabel } from "@/lib/srs";
import { useHydrated } from "@/lib/use-hydrated";
import { cn, percent, unitNumber } from "@/lib/utils";

const DOMAINS: ReviewDomain[] = ["recognition", "production", "grammar"];

function reviewLabel(key: string): string {
  const lexeme = lexemeById.get(key);
  if (lexeme) return `${lexeme.ku} — ${lexeme.en}`;
  const grammar = grammarById.get(key);
  if (grammar) return `${grammar.id} · ${grammar.title}`;
  return key;
}

function Skeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-20 animate-pulse rounded-card bg-line/40" />
      <div className="h-28 animate-pulse rounded-card bg-line/50" />
      <div className="h-64 animate-pulse rounded-card bg-line/40" />
    </div>
  );
}

export default function ProgressPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <Skeleton />;
  return <ProgressDashboard />;
}

function ProgressDashboard() {
  const snapshot = useLiveQuery(() => getLearnerSnapshot(), []);

  if (!snapshot) return <Skeleton />;

  const { profile, reviewItems, attempts } = snapshot;
  const scoredAttempts = attempts.filter((attempt) => attempt.scored);
  const correctAttempts = scoredAttempts.filter(
    (attempt) => attempt.correct,
  ).length;
  const accuracy =
    scoredAttempts.length > 0
      ? percent(correctAttempts, scoredAttempts.length)
      : 0;

  const secure = reviewItems.filter((item) => item.mastery >= 3).length;
  const securePct =
    reviewItems.length > 0 ? percent(secure, reviewItems.length) : 0;

  const distribution = [0, 1, 2, 3, 4, 5].map(
    (level) => reviewItems.filter((item) => item.mastery === level).length,
  );
  const maxLevel = Math.max(1, ...distribution);

  const domainTotals = DOMAINS.map((domain) => {
    let attemptsCount = 0;
    let correct = 0;
    for (const item of reviewItems) {
      const stat = item.domains[domain];
      if (!stat) continue;
      attemptsCount += stat.attempts;
      correct += stat.correct;
    }
    return { domain, attempts: attemptsCount, correct };
  });

  const weak = reviewItems
    .filter((item) => item.attempts > 0 && item.mastery < 3)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Local-first dashboard"
        title="Progress"
        description="Evidence, not streaks: mastery levels combine accuracy, skill domain and spacing. XP and streak are cosmetic."
        accessory={<Mascot className="w-16 shrink-0 sm:w-24" />}
      />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Overall accuracy"
          value={`${accuracy}%`}
          tone="brand"
          icon={<TargetIcon className="size-4" />}
        />
        <StatCard
          label="Items tracked"
          value={reviewItems.length}
          tone="sky"
          icon={<ChartIcon className="size-4" />}
        />
        <StatCard
          label="A1–A2 secure"
          value={`${securePct}%`}
          tone="sun"
          icon={<CheckIcon className="size-4" />}
        />
        <StatCard
          label="XP"
          value={profile.xp}
          tone="clay"
          icon={<StarIcon className="size-4" />}
        />
      </section>

      <section className="card relative overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-12 size-44 rounded-full bg-brand-soft/60 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand via-brand to-sun"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <SectionHeading
              icon={<FlameIcon className="size-4" />}
              title="A1–A2 journey"
            />
            <h2 className="mt-3 text-xl font-black tracking-tight">
              {secure} of {reviewItems.length} items are secure
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
              Secure means mastery level 3 or higher: you have retrieved the
              item without hints, across more than one day.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip border-brand/30 bg-brand-soft text-brand-dark">
                <FlameIcon className="size-3.5" /> {profile.streak || 0} day
                streak
              </span>
              <span className="chip border-sun/50 bg-sun-soft text-sun-ink">
                <StarIcon className="size-3.5" /> {profile.xp} XP
              </span>
            </div>
          </div>
          <ProgressRing
            value={securePct}
            size={104}
            stroke={11}
            label={`A1–A2 secure: ${securePct}%`}
            className="mx-auto"
          >
            <div className="text-center">
              <p className="text-2xl font-black leading-none text-brand">
                {securePct}%
              </p>
              <p className="text-[0.55rem] font-bold uppercase tracking-wide text-ink-soft">
                secure
              </p>
            </div>
          </ProgressRing>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card p-5">
          <SectionHeading
            icon={<ChartIcon className="size-4" />}
            title="Mastery distribution"
          />
          <ul className="mt-4 space-y-2">
            {distribution.map((count, level) => (
              <li key={level} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-semibold text-ink-soft">
                  {level} · {masteryLabel(level)}
                </span>
                <span className="h-3 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <span
                    className={cn(
                      "block h-full rounded-full transition-[width] duration-500",
                      level >= 4
                        ? "bg-brand"
                        : level === 3
                          ? "bg-sun"
                          : "bg-line",
                    )}
                    style={{ width: `${(count / maxLevel) * 100}%` }}
                  />
                </span>
                <span className="w-6 text-right text-xs font-bold">
                  {count}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-xl bg-paper/60 p-3 text-xs leading-relaxed text-ink-soft">
            Level 3 needs unhinted production or grammar; levels 4–5 also need
            spacing across domains and days.
          </p>
        </section>

        <section className="card p-5">
          <SectionHeading
            icon={<TargetIcon className="size-4" />}
            title="Skill accuracy"
            tone="sky"
          />
          <ul className="mt-4 space-y-3">
            {domainTotals.map((entry) => {
              const value =
                entry.attempts > 0 ? percent(entry.correct, entry.attempts) : 0;
              return (
                <li key={entry.domain}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold capitalize">
                      {entry.domain}
                    </span>
                    <span className="text-ink-soft">
                      {entry.attempts > 0 ? `${value}%` : "no data"}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky to-sky/60 transition-[width] duration-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 rounded-xl bg-sky-soft/50 p-3 text-xs leading-relaxed text-ink-soft">
            Recognition, production and grammar are tracked separately so a
            strong reading score never hides a fragile speaking skill.
          </p>
        </section>
      </div>

      {contentBundle.units.map((unit) => {
        const unitLessons = getUnitLessons(unit.id);
        const unitDone = unitLessons.filter(
          (lesson) => profile.completedLessons[lesson.id],
        ).length;
        const unitPct = percent(unitDone, unitLessons.length);

        return (
          <section key={unit.id} className="card card-interactive p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-soft to-surface text-sm font-black text-brand-dark shadow-[inset_0_-2px_0_rgb(31_111_92/0.16)] ring-1 ring-brand/10"
                >
                  {unitNumber(unit.id)}
                </span>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.1em]">
                    Unit {unitNumber(unit.id)} · {unit.titleEn}
                  </h2>
                  <p className="text-xs text-ink-soft" lang="ku">
                    {unit.titleKu}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="chip">
                  {unit.stage} · {unitDone}/{unitLessons.length} done
                </span>
                <div className="hidden sm:block">
                  <ProgressRing
                    value={unitPct}
                    size={40}
                    stroke={5}
                    label={`Unit ${unitNumber(unit.id)} progress: ${unitPct}%`}
                  >
                    <span className="text-[0.5rem] font-black text-brand">
                      {unitPct}%
                    </span>
                  </ProgressRing>
                </div>
              </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-sun transition-[width] duration-500"
                style={{ width: `${unitPct}%` }}
              />
            </div>

            <ul className="mt-3 divide-y divide-line/70">
              {unitLessons.map((lesson) => {
                const done = profile.completedLessons[lesson.id];
                return (
                  <li
                    key={lesson.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {lesson.index}. {lesson.titleEn}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {lesson.status === "playable"
                          ? "Playable"
                          : "In authoring"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "chip shrink-0",
                        done && "border-brand/30 bg-brand-soft text-brand-dark",
                      )}
                    >
                      {done ? (
                        <>
                          <CheckIcon className="size-3.5" />
                          {percent(done.accuracy, 1)}%
                        </>
                      ) : lesson.status === "playable" ? (
                        "Open"
                      ) : (
                        "Pending"
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="card p-5">
        <SectionHeading
          icon={<FlameIcon className="size-4" />}
          title="Fragile items"
          tone="clay"
        />
        {weak.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">
            No fragile items yet. Complete a lesson to start building evidence.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line/70">
            {weak.map((item) => (
              <li
                key={item.key}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span
                  lang="ku"
                  className="min-w-0 truncate text-sm font-semibold"
                >
                  {reviewLabel(item.key)}
                </span>
                <span className="chip shrink-0 border-clay/25 bg-clay-soft/70 text-clay">
                  {masteryLabel(item.mastery)} ·{" "}
                  {Math.round(item.accuracy * 100)}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <SectionHeading
            icon={<GearIcon className="size-4" />}
            title="Your data"
            tone="sky"
          />
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            Progress lives in this browser (IndexedDB). Export a JSON backup,
            import one, or reset progress from Settings.
          </p>
        </div>
        <Link href="/settings" className="btn btn-secondary">
          <GearIcon /> Open settings
        </Link>
      </section>

      <p className="text-center text-xs text-ink-soft">
        {attempts.length} attempts stored locally · {reviewItems.length} memory
        items · no answer text leaves this device.
      </p>
    </div>
  );
}
