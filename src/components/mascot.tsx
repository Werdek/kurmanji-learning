import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** A one-off celebration pose; omit for the gentle idle float. */
  cheer?: boolean;
};

/**
 * “Roj”, the course mascot: a friendly sun. Purely decorative, so it is
 * hidden from assistive technology and never carries instructions.
 */
export function Mascot({ className, cheer = false }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("overflow-visible", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g className={cheer ? "animate-pop" : "animate-float"}>
        <g
          stroke="var(--color-sun)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="60"
              y1="7"
              x2="60"
              y2="18"
              transform={`rotate(${angle} 60 60)`}
            />
          ))}
        </g>

        <circle
          cx="60"
          cy="60"
          r="36"
          fill="var(--color-sun)"
          stroke="#c98726"
          strokeWidth="2"
        />
        <circle cx="60" cy="60" r="30" fill="#f2bd61" />

        <circle cx="49" cy="56" r="3.6" fill="var(--color-ink)" />
        <circle cx="71" cy="56" r="3.6" fill="var(--color-ink)" />
        <circle cx="50.2" cy="54.7" r="1.1" fill="#fffdf7" />
        <circle cx="72.2" cy="54.7" r="1.1" fill="#fffdf7" />

        <circle cx="42" cy="66" r="4.6" fill="#d97757" opacity="0.5" />
        <circle cx="78" cy="66" r="4.6" fill="#d97757" opacity="0.5" />

        <path
          d="M50 69c3.2 5 7 7.4 10 7.4s6.8-2.4 10-7.4"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <g fill="var(--color-brand)">
          <path d="M24 34.5c.8 2.2 2.3 3.7 4.5 4.5-2.2.8-3.7 2.3-4.5 4.5-.8-2.2-2.3-3.7-4.5-4.5 2.2-.8 3.7-2.3 4.5-4.5Z" />
          <path d="M96 40c.6 1.7 1.8 2.9 3.5 3.5-1.7.6-2.9 1.8-3.5 3.5-.6-1.7-1.8-2.9-3.5-3.5 1.7-.6 2.9-1.8 3.5-3.5Z" />
        </g>
      </g>
    </svg>
  );
}
