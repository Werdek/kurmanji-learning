import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionTone = "brand" | "sun" | "clay" | "sky";

const tones: Record<SectionTone, string> = {
  brand: "bg-brand-soft text-brand-dark",
  sun: "bg-sun-soft text-sun-ink",
  clay: "bg-clay-soft text-clay",
  sky: "bg-sky-soft text-sky",
};

type Props = {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  tone?: SectionTone;
  className?: string;
  id?: string;
};

/** A small icon badge plus an uppercase label, shared across all cards. */
export function SectionHeading({
  icon,
  title,
  description,
  tone = "brand",
  className,
  id,
}: Props) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span
        aria-hidden="true"
        className={cn("icon-badge size-9 rounded-xl", tones[tone])}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h2 id={id} className="text-sm font-black uppercase tracking-[0.1em]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
