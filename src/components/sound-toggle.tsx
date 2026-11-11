"use client";

import { SpeakerIcon, SpeakerOffIcon } from "@/components/icons";
import { playSound } from "@/lib/sound";
import { usePreferences } from "@/lib/store/preferences";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const soundEnabled = usePreferences((state) => state.soundEnabled);
  const setPreference = usePreferences((state) => state.setPreference);

  return (
    <button
      type="button"
      aria-pressed={soundEnabled}
      aria-label="Interface sounds"
      title={
        soundEnabled ? "Mute interface sounds" : "Turn interface sounds on"
      }
      onClick={() => {
        const next = !soundEnabled;
        setPreference("soundEnabled", next);
        if (next) playSound("tap");
      }}
      className={cn(
        "btn btn-ghost min-h-0 size-9 shrink-0 rounded-full p-0",
        soundEnabled ? "text-brand" : "text-ink-soft",
        className,
      )}
    >
      {soundEnabled ? (
        <SpeakerIcon className="size-[1.1rem]" />
      ) : (
        <SpeakerOffIcon className="size-[1.1rem]" />
      )}
    </button>
  );
}
