"use client";

import { usePreferences } from "@/lib/store/preferences";

export type SoundName = "correct" | "incorrect" | "complete" | "tap";

type Tone = {
  frequency: number;
  delay: number;
  duration: number;
  type: OscillatorType;
  gain: number;
};

/**
 * Deliberately short, quiet and consonant. The tones confirm an action; they
 * never carry meaning and can be switched off from Settings or the lesson
 * header. Content itself stays text-only: there are no recordings, no speech
 * synthesis and no listening exercises.
 */
const SOUNDS: Record<SoundName, Tone[]> = {
  correct: [
    { frequency: 659.25, delay: 0, duration: 0.11, type: "sine", gain: 0.055 },
    {
      frequency: 987.77,
      delay: 0.08,
      duration: 0.16,
      type: "sine",
      gain: 0.045,
    },
  ],
  incorrect: [
    {
      frequency: 293.66,
      delay: 0,
      duration: 0.12,
      type: "triangle",
      gain: 0.04,
    },
    {
      frequency: 220,
      delay: 0.09,
      duration: 0.18,
      type: "triangle",
      gain: 0.035,
    },
  ],
  complete: [
    { frequency: 523.25, delay: 0, duration: 0.14, type: "sine", gain: 0.05 },
    { frequency: 659.25, delay: 0.1, duration: 0.14, type: "sine", gain: 0.05 },
    { frequency: 783.99, delay: 0.2, duration: 0.14, type: "sine", gain: 0.05 },
    {
      frequency: 1046.5,
      delay: 0.3,
      duration: 0.26,
      type: "sine",
      gain: 0.045,
    },
  ],
  tap: [
    { frequency: 880, delay: 0, duration: 0.05, type: "sine", gain: 0.025 },
  ],
};

type AudioContextConstructor = typeof AudioContext;

let context: AudioContext | null = null;
let unavailable = false;
let lastPlayedAt = 0;

function getAudioContextConstructor(): AudioContextConstructor | null {
  if (typeof window === "undefined") return null;
  const candidate =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext;
  return candidate ?? null;
}

function getContext(): AudioContext | null {
  if (unavailable) return null;
  const Constructor = getAudioContextConstructor();
  if (!Constructor) {
    unavailable = true;
    return null;
  }

  try {
    context ??= new Constructor();
    if (context.state === "suspended") {
      void context.resume();
    }
    return context;
  } catch {
    unavailable = true;
    return null;
  }
}

/**
 * Plays one of the optional interface cues. Safe to call anywhere: it is a
 * no-op during server rendering, in browsers without the Web Audio API and
 * whenever the learner has switched interface sounds off.
 */
export function playSound(name: SoundName): void {
  if (!usePreferences.getState().soundEnabled) return;

  const now = Date.now();
  if (now - lastPlayedAt < 35) return;
  lastPlayedAt = now;

  const audio = getContext();
  if (!audio) return;

  const start = audio.currentTime;

  for (const tone of SOUNDS[name]) {
    try {
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      const toneStart = start + tone.delay;
      const toneEnd = toneStart + tone.duration;

      oscillator.type = tone.type;
      oscillator.frequency.setValueAtTime(tone.frequency, toneStart);

      envelope.gain.setValueAtTime(0.0001, toneStart);
      envelope.gain.exponentialRampToValueAtTime(tone.gain, toneStart + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.0001, toneEnd);

      oscillator.connect(envelope);
      envelope.connect(audio.destination);
      oscillator.start(toneStart);
      oscillator.stop(toneEnd + 0.03);
    } catch {
      // A failed cue must never interrupt the lesson.
      return;
    }
  }
}
