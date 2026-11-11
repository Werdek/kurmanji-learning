"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  FlameIcon,
  InfoIcon,
  LayersIcon,
  RepeatIcon,
  SparkIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
} from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { ProgressRing } from "@/components/progress-ring";
import { SectionHeading } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import {
  contentBundle,
  getNextLesson,
  getUnitLessons,
  playableLessons,
} from "@/content";
import { getLearnerSnapshot } from "@/lib/db/repositories";
import { dueItems } from "@/lib/srs";
import { useHydrated } from "@/lib/use-hydrated";
import { cn, percent, unitNumber } from "@/lib/utils";

function Skeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-56 animate-pulse rounded-card bg-line/50" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-card bg-line/40"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-card bg-line/40" />
    </div>
  );
}

function HeroChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm">
      {children}
    </span>
  );
}

export default function HomePage() {
  const hydrated = useHydrated();
  if (!hydrated) return <Skeleton />;
  return <Dashboard />;
}

function Dashboard() {
  const snapshot = useLiveQuery(() => getLearnerSnapshot(), []);

  if (!snapshot) return <Skeleton />;

  const { profile, reviewItems } = snapshot;
  const due = dueItems(reviewItems);
  const completed = profile.completedLessons;
  const completedIds = Object.keys(completed);
  const nextLesson = getNextLesson(completedIds);
  const allPlayableDone = playableLessons.every(
    (lesson) => completed[lesson.id],
  );

  const currentUnit =
    contentBundle.units.find((unit) => unit.id === nextLesson.unitId) ??
    contentBundle.units[0];
  const currentLessons = currentUnit ? getUnitLessons(currentUnit.id) : [];
  const currentDone = currentLessons.filter(
    (lesson) => completed[lesson.id],
  ).length;

  const secureItems = reviewItems.filter((item) => item.mastery >= 3).length;
  const totalDone = playableLessons.filter(
    (lesson) => completed[lesson.id],
  ).length;
  const totalPct = percent(totalDone, playableLessons.length);
  const currentPct = percent(currentDone, currentLessons.length);

  if (!currentUnit) return null;

  return (
    <div className="space-y-6">
      <section className="card relative overflow-hidden border-0 bg-[linear-gradient(135deg,var(--color-brand)_0%,var(--color-brand-dark)_100%)] p-6 text-white shadow-glow sm:p-8">
        <div
          aria-hidden="true"
          className="hero-pattern absolute inset-0 opacity-25"
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-24 size-64 rounded-full bg-sun/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 left-1/3 size-56 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-sun/80 to-transparent"
        />

        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/90 ring-1 ring-white/15">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-sun"
              />
              {currentUnit.stage} · Unit {unitNumber(currentUnit.id)} ·{" "}
              {currentDone}/{currentLessons.length} lessons done
            </span>
            <div className="mt-3 flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                {allPlayableDone ? "Silav! Keep it warm." : "Silav, xwendekar!"}
              </h1>
              <Mascot className="size-14 shrink-0 sm:hidden" />
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90">
              {allPlayableDone
                ? "Every A1 and A2 lesson is complete. Spaced review will keep the grammar and vocabulary ready for B1."
                : `${currentUnit.description} No hearts, no limits.`}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={
                  allPlayableDone && due.length > 0
                    ? "/review"
                    : `/learn/${nextLesson.id}`
                }
                className="btn bg-sun text-ink shadow-[0_3px_0_var(--color-sun-deep)] hover:bg-white"
              >
                {allPlayableDone
                  ? due.length > 0
                    ? `Review ${due.length} due`
                    : "Practise A1–A2 again"
                  : `Continue: ${nextLesson.titleEn}`}
                <ArrowRightIcon />
              </Link>
              {due.length > 0 && !allPlayableDone ? (
                <Link
                  href="/review"
                  className="btn border-white/25 bg-white/10 text-white hover:bg-white/20"
                >
                  <RepeatIcon /> Review {due.length}
                </Link>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <HeroChip>
                <FlameIcon className="size-4 text-sun" />
                {profile.streak || 0} day streak
              </HeroChip>
              <HeroChip>
                <StarIcon className="size-4 text-sun" />
                {profile.xp} XP
              </HeroChip>
              <HeroChip>
                <TargetIcon className="size-4" />
                {totalDone}/{playableLessons.length} lessons
              </HeroChip>
            </div>
          </div>

          <div className="relative mx-auto hidden w-48 sm:block">
            <div
              aria-hidden="true"
              className="absolute inset-4 rounded-full bg-white/10 blur-2xl"
            />
            <Mascot className="relative w-full drop-shadow-[0_12px_20px_rgb(0_0_0/0.2)]" />
            <div className="absolute -bottom-3 -left-4 flex items-center gap-2.5 rounded-2xl bg-surface px-2.5 py-2 pr-3.5 text-ink shadow-lift ring-1 ring-black/5">
              <ProgressRing
                value={currentPct}
                size={48}
                stroke={6}
                label={`Unit progress: ${currentPct}%`}
              >
                <span className="text-[0.65rem] font-black text-brand">
                  {currentPct}%
                </span>
              </ProgressRing>
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
                  Unit {unitNumber(currentUnit.id)}
                </p>
                <p className="text-xs font-black text-brand">progress</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Your stats"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <StatCard
          label="Total XP"
          value={profile.xp}
          tone="sun"
          icon={<StarIcon className="size-4" />}
        />
        <StatCard
          label="Streak"
          value={`${profile.streak || 0}d`}
          tone="clay"
          icon={<FlameIcon className="size-4" />}
        />
        <StatCard
          label="Due now"
          value={due.length}
          tone="sky"
          icon={<RepeatIcon className="size-4" />}
        />
        <StatCard
          label="Secure items"
          value={`${secureItems}/${reviewItems.length}`}
          tone="brand"
          icon={<CheckIcon className="size-4" />}
        />
      </section>

      <section className="card relative overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 size-40 rounded-full bg-brand-soft/60 blur-2xl"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <SectionHeading
              icon={<LayersIcon className="size-4" />}
              title={
                <span>
                  A1–A2 curriculum · {totalDone}/{playableLessons.length}{" "}
                  lessons
                </span>
              }
            />
            <h2 className="mt-3 text-xl font-black tracking-tight">
              Twelve units, one conversation at a time
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
              A1.1–A1.2 cover greetings, family, food, time, the city and
              shopping; A2.1–A2.2 add the past, ergativity, ezafe chains,
              health, travel and culture. Every lesson is playable offline in
              this browser.
            </p>
          </div>
          <ProgressRing
            value={totalPct}
            size={96}
            stroke={10}
            label={`A1–A2 progress: ${totalPct}%`}
            className="mx-auto"
          >
            <div className="text-center">
              <p className="text-xl font-black leading-none text-brand">
                {totalPct}%
              </p>
              <p className="text-[0.55rem] font-bold uppercase tracking-wide text-ink-soft">
                A1–A2
              </p>
            </div>
          </ProgressRing>
        </div>

        <div className="relative mt-5 grid grid-cols-12 gap-1">
          {contentBundle.units.map((unit) => {
            const lessons = getUnitLessons(unit.id);
            const done = lessons.filter(
              (lesson) => completed[lesson.id],
            ).length;
            const value = percent(done, lessons.length);
            return (
              <span
                key={unit.id}
                title={`Unit ${unitNumber(unit.id)} · ${value}% complete`}
                className="h-2.5 overflow-hidden rounded-full bg-surface-muted"
              >
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-brand to-sun transition-[width] duration-500"
                  style={{ width: `${value}%` }}
                />
              </span>
            );
          })}
        </div>
        <div className="relative mt-2 grid grid-cols-4 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
          <span>A1.1</span>
          <span>A1.2</span>
          <span>A2.1</span>
          <span>A2.2</span>
        </div>
      </section>

      {contentBundle.units.map((unit) => {
        const unitLessons = getUnitLessons(unit.id);
        const unitItems = reviewItems.filter((item) => item.unitId === unit.id);
        const unitSecure = unitItems.filter((item) => item.mastery >= 3).length;
        const unitSecurePct =
          unitItems.length > 0 ? percent(unitSecure, unitItems.length) : 0;
        const unitDone = unitLessons.filter(
          (lesson) => completed[lesson.id],
        ).length;

        return (
          <section key={unit.id} className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-soft to-surface text-lg font-black text-brand-dark shadow-[inset_0_-2px_0_rgb(31_111_92/0.18)] ring-1 ring-brand/10"
                >
                  {unitNumber(unit.id)}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-brand">
                    {unit.stage} · Unit {unitNumber(unit.id)} · {unitDone}/
                    {unitLessons.length} done
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-tight">
                    {unit.titleKu}{" "}
                    <span className="font-semibold text-ink-soft">
                      · {unit.titleEn}
                    </span>
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                    {unit.description}
                  </p>
                  {unitDone === unitLessons.length && unitLessons.length > 0 ? (
                    <span className="chip mt-2 border-brand/30 bg-brand-soft text-brand-dark">
                      <TrophyIcon className="size-3.5" /> Unit complete
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex w-full items-center gap-3 rounded-2xl border border-line/70 bg-paper/60 px-3 py-2 sm:w-auto">
                <div className="flex flex-1 items-center justify-between gap-3 sm:block sm:flex-none sm:text-right">
                  <p className="text-lg font-black text-brand">
                    {unitSecurePct}%
                  </p>
                  <p className="text-[0.6rem] font-bold uppercase leading-tight tracking-wide text-ink-soft sm:max-w-24">
                    of introduced items secure
                  </p>
                </div>
                <div className="hidden sm:block">
                  <ProgressRing value={unitSecurePct} size={52} stroke={6}>
                    <span className="text-[0.6rem] font-black text-brand">
                      {unitSecurePct}%
                    </span>
                  </ProgressRing>
                </div>
              </div>
            </div>

            <ol className="relative mt-5 space-y-2.5">
              {unitLessons.map((lesson) => {
                const done = completed[lesson.id];
                const playable = lesson.status === "playable";
                const isNext = playable && lesson.id === nextLesson.id && !done;
                const detail = done
                  ? `Completed · ${percent(done.accuracy, 1)}% accuracy`
                  : playable
                    ? lesson.subtitle
                    : "Items are being authored.";

                const body = (
                  <>
                    <span
                      className={cn(
                        "relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 text-sm font-black transition-transform group-hover:scale-105",
                        done
                          ? "border-brand bg-brand text-white shadow-[0_3px_0_var(--color-brand-dark)]"
                          : isNext
                            ? "border-sun bg-sun text-ink shadow-[0_3px_0_var(--color-sun-deep)] ring-4 ring-sun/25"
                            : "border-line bg-surface-muted text-ink-soft shadow-[0_3px_0_var(--color-line)]",
                      )}
                    >
                      {done ? <CheckIcon className="size-5" /> : lesson.index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold">{lesson.titleEn}</span>
                        <span className="text-xs text-ink-soft" lang="ku">
                          {lesson.titleKu}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">
                        {detail}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "chip shrink-0",
                        done && "border-brand/30 bg-brand-soft text-brand-dark",
                        isNext && "border-sun bg-sun-soft text-ink",
                      )}
                    >
                      {done
                        ? "Done"
                        : playable
                          ? isNext
                            ? "Start"
                            : "Open"
                          : "In authoring"}
                    </span>
                  </>
                );

                return (
                  <li
                    key={lesson.id}
                    className="relative after:absolute after:left-6 after:top-full after:h-2.5 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-line last:after:hidden"
                  >
                    {playable ? (
                      <Link
                        href={`/learn/${lesson.id}`}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all",
                          isNext
                            ? "border-sun/70 bg-sun-soft/40 shadow-[0_2px_0_rgb(227_160_58/0.22)] hover:bg-sun-soft/70"
                            : "border-line bg-surface hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-soft/30 hover:shadow-card",
                        )}
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-line bg-paper/40 px-3 py-2.5 opacity-80">
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card p-5">
          <SectionHeading
            icon={<SparkIcon className="size-4" />}
            title="How practice works"
          />
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink-soft">
            <li className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
              />
              <span>
                <strong className="text-ink">No hearts or energy.</strong> A
                wrong answer costs nothing; it schedules an earlier review.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-sun"
              />
              <span>
                <strong className="text-ink">Accuracy drives the queue.</strong>{" "}
                Due dates are suggestions — “practice anyway” always works.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-sky"
              />
              <span>
                <strong className="text-ink">Mastery is visible.</strong> Six
                levels, from introduced to durable, replace a single completion
                tick.
              </span>
            </li>
          </ul>
        </section>

        <section className="card p-5">
          <SectionHeading
            icon={<InfoIcon className="size-4" />}
            title="Content status"
            tone="sun"
          />
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-ink-soft">Units</dt>
            <dd className="text-right font-bold">
              {contentBundle.units.length}
            </dd>
            <dt className="text-ink-soft">Lessons</dt>
            <dd className="text-right font-bold">
              {contentBundle.lessons.length}
            </dd>
            <dt className="text-ink-soft">Exercises</dt>
            <dd className="text-right font-bold">
              {contentBundle.exercises.length}
            </dd>
            <dt className="text-ink-soft">Lexemes</dt>
            <dd className="text-right font-bold">
              {contentBundle.lexemes.length}
            </dd>
            <dt className="text-ink-soft">Grammar points</dt>
            <dd className="text-right font-bold">
              {contentBundle.grammarPoints.length}
            </dd>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            All A1 and A2 text is source-checked against Thackston, Chyet and
            IKP. The course is text-first: no content audio, no microphone, and
            no native-review gate. Interface sounds are optional and can be
            muted.
          </p>
        </section>
      </div>

      <p className="text-center text-xs text-ink-soft">
        <FlameIcon className="mr-1 inline size-3.5 text-sun" />
        Streaks and XP are cosmetic. They never unlock or gate content.
      </p>
    </div>
  );
}
