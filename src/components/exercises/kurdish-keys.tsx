"use client";

import { KURDISH_CHARACTERS } from "@/lib/kurdish";

export function KurdishKeys({
  onInsert,
  disabled,
}: {
  onInsert: (character: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-soft">
        Letters
      </span>
      {KURDISH_CHARACTERS.map((character) => (
        <button
          key={character}
          type="button"
          disabled={disabled}
          onClick={() => onInsert(character)}
          aria-label={`Insert ${character}`}
          className="min-h-9 min-w-9 rounded-lg border border-line bg-surface px-2 font-mono text-sm font-semibold text-ink hover:border-brand hover:bg-brand-soft disabled:opacity-50"
        >
          {character}
        </button>
      ))}
    </div>
  );
}

export function insertAtCursor(
  element: HTMLInputElement | HTMLTextAreaElement | null,
  value: string,
  character: string,
  setValue: (next: string) => void,
): void {
  if (!element) {
    setValue(value + character);
    return;
  }
  const start = element.selectionStart ?? value.length;
  const end = element.selectionEnd ?? start;
  const next = `${value.slice(0, start)}${character}${value.slice(end)}`;
  setValue(next);
  const restore = () => {
    element.focus();
    element.setSelectionRange(
      start + character.length,
      start + character.length,
    );
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(restore);
  } else {
    setTimeout(restore, 0);
  }
}
