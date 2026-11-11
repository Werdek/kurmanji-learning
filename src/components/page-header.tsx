import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  accessory?: ReactNode;
  className?: string;
};

/** Consistent page masthead used by every top-level screen. */
export function PageHeader({
  eyebrow,
  title,
  description,
  accessory,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "relative flex items-center justify-between gap-4 sm:gap-6",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="eyebrow">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-sun" />
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[1.75rem] font-black leading-[1.1] tracking-tight sm:text-[2.1rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]">
            {description}
          </p>
        ) : null}
      </div>
      {accessory ? <div className="shrink-0">{accessory}</div> : null}
    </header>
  );
}
