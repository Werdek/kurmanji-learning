"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import {
  DownloadIcon,
  GearIcon,
  InfoIcon,
  KeyboardIcon,
  SpeakerIcon,
  TrashIcon,
  UploadIcon,
} from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import {
  exportBackup,
  getLearnerSnapshot,
  importBackup,
  resetProgress,
} from "@/lib/db/repositories";
import { KURDISH_CHARACTERS } from "@/lib/kurdish";
import { playSound } from "@/lib/sound";
import { usePreferences, type PreferenceKey } from "@/lib/store/preferences";
import { useHydrated } from "@/lib/use-hydrated";
import { downloadJson, todayKey } from "@/lib/utils";

function Skeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-20 animate-pulse rounded-card bg-line/40" />
      <div className="h-56 animate-pulse rounded-card bg-line/50" />
      <div className="h-40 animate-pulse rounded-card bg-line/40" />
    </div>
  );
}

function PreferenceToggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface p-3.5 transition-colors hover:border-brand/40 hover:bg-brand-tint/40">
      <label
        htmlFor={id}
        className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-describedby={`${id}-description`}
          className="peer absolute inset-0 z-20 size-full cursor-pointer appearance-none rounded-full opacity-0"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-line bg-surface-muted transition-colors peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-sun peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface"
        />
        <span
          aria-hidden="true"
          className="relative z-10 ml-0.5 size-5 rounded-full bg-surface shadow-[0_1px_2px_rgb(27_42_37/0.25)] transition-transform peer-checked:translate-x-5"
        />
      </label>
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-sm font-bold">
          {label}
        </label>
        <p
          id={`${id}-description`}
          className="mt-0.5 text-xs leading-relaxed text-ink-soft"
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <Skeleton />;
  return <SettingsPanel />;
}

function SettingsPanel() {
  const snapshot = useLiveQuery(() => getLearnerSnapshot(), []);
  const reduceMotion = usePreferences((state) => state.reduceMotion);
  const highContrast = usePreferences((state) => state.highContrast);
  const largeText = usePreferences((state) => state.largeText);
  const soundEnabled = usePreferences((state) => state.soundEnabled);
  const setPreference = usePreferences((state) => state.setPreference);
  const resetPreferences = usePreferences((state) => state.resetPreferences);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const preferences: Array<{
    key: PreferenceKey;
    id: string;
    label: string;
    description: string;
    checked: boolean;
  }> = [
    {
      key: "reduceMotion",
      id: "pref-reduce-motion",
      label: "Reduce motion",
      description:
        "Removes non-essential animation and smooth scrolling. Your operating-system setting is always respected.",
      checked: reduceMotion,
    },
    {
      key: "highContrast",
      id: "pref-high-contrast",
      label: "High contrast",
      description:
        "Darkens text, strengthens borders and removes decorative shadows.",
      checked: highContrast,
    },
    {
      key: "largeText",
      id: "pref-large-text",
      label: "Larger text",
      description:
        "Increases the base text size by 12.5%. Text can also be zoomed to 200% without losing function.",
      checked: largeText,
    },
  ];

  const isDefault =
    !reduceMotion && !highContrast && !largeText && soundEnabled;

  async function handleExport() {
    setError(null);
    setMessage(null);
    try {
      const backup = await exportBackup();
      downloadJson(`kurmanji-progress-${todayKey()}.json`, backup);
      setMessage("Progress exported as JSON.");
    } catch {
      setError("The export failed in this browser.");
    }
  }

  async function handleImport(file: File | undefined) {
    if (!file) return;
    setError(null);
    setMessage(null);
    try {
      await importBackup(await file.text());
      setMessage("Progress imported. Your queue has been refreshed.");
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "The import failed.",
      );
    }
  }

  async function handleReset() {
    setError(null);
    setMessage(null);
    try {
      await resetProgress();
      setConfirmReset(false);
      setMessage("Progress reset. All lessons remain open.");
    } catch {
      setError("The reset failed in this browser.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Local-first"
        title="Settings"
        description="Display and sound preferences stay on this device. Progress lives in this browser only; no account is required and nothing is sent anywhere."
        accessory={<Mascot className="w-16 shrink-0 sm:w-24" />}
      />

      <section className="card p-5 sm:p-6" aria-labelledby="a11y-heading">
        <SectionHeading
          icon={<GearIcon className="size-4" />}
          title={<span id="a11y-heading">Accessibility</span>}
        />
        <div className="mt-4 grid gap-2.5">
          {preferences.map((preference) => (
            <PreferenceToggle
              key={preference.key}
              id={preference.id}
              label={preference.label}
              description={preference.description}
              checked={preference.checked}
              onChange={(checked) => setPreference(preference.key, checked)}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-4">
          <p className="text-xs leading-relaxed text-ink-soft">
            Preferences are stored separately from lesson progress and are not
            included in the JSON backup.
          </p>
          <button
            type="button"
            onClick={resetPreferences}
            disabled={isDefault}
            className="btn btn-ghost px-2 text-xs"
          >
            Reset display defaults
          </button>
        </div>
      </section>

      <section className="card p-5 sm:p-6" aria-labelledby="sound-heading">
        <SectionHeading
          icon={<SpeakerIcon className="size-4" />}
          title={<span id="sound-heading">Interface sound</span>}
          tone="sky"
        />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Short, quiet tones confirm a correct answer, a wrong answer and a
          finished lesson. They are optional feedback cues, not course audio: no
          recordings, speech synthesis or microphone access are used.
        </p>
        <div className="mt-4 grid gap-2.5">
          <PreferenceToggle
            id="pref-sound"
            label="Interface sounds"
            description="Play a brief cue when an answer is checked and when a lesson is completed. You can also mute sounds from the lesson header."
            checked={soundEnabled}
            onChange={(checked) => setPreference("soundEnabled", checked)}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => playSound("complete")}
            disabled={!soundEnabled}
            className="btn btn-secondary"
          >
            <SpeakerIcon /> Test sound
          </button>
          <p className="text-xs leading-relaxed text-ink-soft">
            {soundEnabled
              ? "The test plays the lesson-complete chime."
              : "Turn interface sounds on to hear the test."}
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card p-5" aria-labelledby="text-heading">
          <SectionHeading
            icon={<KeyboardIcon className="size-4" />}
            title={<span id="text-heading">Text-first learning</span>}
            tone="sun"
          />
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-soft">
            <li className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
              />
              <span>
                <strong className="text-ink">No content audio required.</strong>{" "}
                Every exercise can be completed by reading and typing; nothing
                depends on recordings, speech synthesis or a microphone.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-sun"
              />
              <span>
                <strong className="text-ink">Read at your own pace.</strong>{" "}
                Dialogues and explanations stay on screen, so you can pause,
                reread and copy letters without a timer.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-sky"
              />
              <span>
                <strong className="text-ink">Kurdish keyboard support.</strong>{" "}
                The character palette below covers the letters that are not on a
                standard English keyboard.
              </span>
            </li>
          </ul>
        </section>

        <section className="card p-5" aria-labelledby="keyboard-heading">
          <SectionHeading
            icon={<KeyboardIcon className="size-4" />}
            title={<span id="keyboard-heading">Kurdish keyboard</span>}
            tone="brand"
          />
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Typed exercises accept the letters that are not on a standard
            English keyboard. You can type them directly or use your operating
            system&apos;s keyboard layout.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {KURDISH_CHARACTERS.map((character) => (
              <span
                key={character}
                lang="ku"
                className="grid size-10 place-items-center rounded-lg border border-line bg-surface font-mono text-base font-semibold shadow-[0_1px_0_var(--color-line)] transition-colors hover:border-brand/40 hover:bg-brand-soft/40"
              >
                {character}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            Hints and feedback never depend on colour alone. Minor punctuation
            differences are ignored when an answer is checked.
          </p>
        </section>
      </div>

      <section className="card p-5 sm:p-6" aria-labelledby="data-heading">
        <SectionHeading
          icon={<DownloadIcon className="size-4" />}
          title={<span id="data-heading">Your data</span>}
          tone="clay"
        />
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Progress lives in this browser (IndexedDB). Export a JSON backup
          before clearing site data or changing device.
        </p>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl bg-paper/60 p-3.5 text-sm">
          <dt className="text-ink-soft">Attempts stored</dt>
          <dd className="text-right font-bold">
            {snapshot ? snapshot.attempts.length : "—"}
          </dd>
          <dt className="text-ink-soft">Memory items</dt>
          <dd className="text-right font-bold">
            {snapshot ? snapshot.reviewItems.length : "—"}
          </dd>
          <dt className="text-ink-soft">Lessons completed</dt>
          <dd className="text-right font-bold">
            {snapshot
              ? Object.keys(snapshot.profile.completedLessons).length
              : "—"}
          </dd>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="btn btn-secondary"
          >
            <DownloadIcon /> Export JSON
          </button>

          <label className="btn btn-secondary cursor-pointer">
            <UploadIcon /> Import JSON
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(event) => {
                void handleImport(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>

          {confirmReset ? (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="btn bg-clay text-white hover:bg-clay/90"
              >
                <TrashIcon /> Yes, delete everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="btn btn-ghost text-clay"
            >
              <TrashIcon /> Reset progress
            </button>
          )}
        </div>

        {message ? (
          <p
            role="status"
            className="mt-3 flex items-center gap-2 rounded-xl border border-brand/20 bg-brand-soft px-3 py-2 text-sm text-brand-dark"
          >
            <InfoIcon className="size-4 shrink-0" />
            {message}
          </p>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-xl border border-clay/30 bg-clay-soft px-3 py-2 text-sm text-clay"
          >
            {error}
          </p>
        ) : null}
      </section>

      <section className="card p-5" aria-labelledby="about-heading">
        <SectionHeading
          icon={<InfoIcon className="size-4" />}
          title={<span id="about-heading">About this build</span>}
          tone="sky"
        />
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-ink-soft">Stage</dt>
          <dd className="text-right font-bold">A1–A2 complete · 12 units</dd>
          <dt className="text-ink-soft">Content status</dt>
          <dd className="text-right font-bold">Source-checked</dd>
          <dt className="text-ink-soft">Data model</dt>
          <dd className="text-right font-bold">Local IndexedDB</dd>
          <dt className="text-ink-soft">Account</dt>
          <dd className="text-right font-bold">Not required</dd>
        </dl>
        <p className="mt-3 rounded-xl bg-paper/60 p-3 text-xs leading-relaxed text-ink-soft">
          No hearts, energy, lives, cooldowns or daily locks exist in this
          build. XP and streaks are cosmetic and never gate content.
        </p>
      </section>

      <p className="text-center text-xs text-ink-soft">
        Settings apply immediately and persist across reloads.
      </p>
    </div>
  );
}
