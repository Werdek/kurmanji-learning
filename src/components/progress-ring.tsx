import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  size?: number;
  stroke?: number;
  /** When provided the ring becomes a labelled image; otherwise it is decorative. */
  label?: string;
  className?: string;
  valueClassName?: string;
  trackClassName?: string;
  children?: ReactNode;
};

export function ProgressRing({
  value,
  size = 72,
  stroke = 8,
  label,
  className,
  valueClassName,
  trackClassName,
  children,
}: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        className,
      )}
      style={{ width: size, height: size }}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={cn("stroke-line", trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "stroke-brand transition-[stroke-dashoffset] duration-500",
            valueClassName,
          )}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        {children ?? (
          <span className="text-sm font-black text-brand">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    </div>
  );
}
