import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatTone = "brand" | "sun" | "sky" | "clay";

const tones: Record<StatTone, { badge: string; value: string; bar: string }> = {
  brand: {
    badge: "bg-brand-soft text-brand",
    value: "text-brand",
    bar: "from-brand/70 to-brand/10",
  },
  sun: {
    badge: "bg-sun-soft text-sun-ink",
    value: "text-sun-ink",
    bar: "from-sun to-sun/10",
  },
  sky: {
    badge: "bg-sky-soft text-sky",
    value: "text-sky",
    bar: "from-sky to-sky/10",
  },
  clay: {
    badge: "bg-clay-soft text-clay",
    value: "text-clay",
    bar: "from-clay to-clay/10",
  },
};

type Props = {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: StatTone;
  hint?: string;
  className?: string;
};

/** Uniform metric tile used on the dashboard, review and progress screens. */
export function StatCard({
  label,
  value,
  icon,
  tone = "brand",
  hint,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "card card-interactive relative overflow-hidden px-4 py-4",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          tones[tone].bar,
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "text-2xl font-black leading-none tracking-tight",
              tones[tone].value,
            )}
          >
            {value}
          </p>
          <p className="mt-1.5 pr-1 text-[0.62rem] font-bold uppercase leading-tight tracking-[0.13em] text-ink-soft">
            {label}
          </p>
        </div>
        <span
          aria-hidden="true"
          className={cn("icon-badge size-9 rounded-xl", tones[tone].badge)}
        >
          {icon}
        </span>
      </div>
      {hint ? <p className="mt-2 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
