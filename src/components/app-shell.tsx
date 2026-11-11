"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ChartIcon, GearIcon, HomeIcon, RepeatIcon } from "@/components/icons";
import { PreferenceEffects } from "@/components/preference-effects";
import { SidebarProgress } from "@/components/sidebar-progress";
import { SoundToggle } from "@/components/sound-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Learn", icon: HomeIcon },
  { href: "/review", label: "Review", icon: RepeatIcon },
  { href: "/progress", label: "Progress", icon: ChartIcon },
  { href: "/settings", label: "Settings", icon: GearIcon },
] as const;

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-lg font-black text-white shadow-[0_3px_0_var(--color-brand-dark),inset_0_1px_0_rgb(255_255_255/0.28)]",
        className,
      )}
    >
      K
      <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-sun ring-2 ring-paper" />
      <span className="absolute inset-x-2 bottom-1 h-px rounded-full bg-white/25" />
    </span>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  compact = false,
}: {
  href: string;
  label: string;
  icon: typeof HomeIcon;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (compact) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group flex flex-1 flex-col items-center gap-1 rounded-xl px-1.5 py-2 text-[0.62rem] font-bold transition-colors",
          active
            ? "bg-brand text-white shadow-[0_2px_0_var(--color-brand-dark)]"
            : "text-ink-soft hover:bg-surface-muted hover:text-ink",
        )}
      >
        <Icon className={cn("size-5", active && "text-white")} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-2.5 py-2.5 text-sm font-semibold transition-all",
        active
          ? "bg-brand text-white shadow-[0_4px_0_var(--color-brand-dark)]"
          : "text-ink-soft hover:bg-surface-muted/80 hover:text-ink",
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-xl transition-colors",
          active
            ? "bg-white/15 text-white"
            : "bg-surface-muted/80 text-ink-soft group-hover:bg-surface group-hover:text-brand",
        )}
      >
        <Icon className="size-[1.15rem]" />
      </span>
      <span>{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "ml-auto size-1.5 rounded-full transition-opacity",
          active ? "bg-sun" : "opacity-0",
        )}
      />
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:pl-[17.5rem]">
      <PreferenceEffects />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lift"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17.5rem] flex-col overflow-hidden border-r border-line/70 bg-surface/75 backdrop-blur-xl lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-brand-soft/70 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-20 size-64 rounded-full bg-sun-soft/60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="dot-pattern pointer-events-none absolute inset-y-0 right-0 w-24 opacity-[0.35] [mask-image:linear-gradient(to_left,black,transparent)]"
        />

        <div className="relative flex min-h-0 flex-1 flex-col px-5 py-7">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-2xl px-1 py-1"
          >
            <BrandMark />
            <span className="leading-tight">
              <span className="block text-[1.05rem] font-black tracking-tight">
                Kurmancî
              </span>
              <span className="block text-xs font-semibold text-ink-soft">
                A1 → B1 course
              </span>
            </span>
          </Link>

          <p className="mt-8 flex items-center gap-2 px-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink-soft">
            Menu
            <span aria-hidden="true" className="h-px flex-1 bg-line/80" />
          </p>

          <nav aria-label="Main" className="mt-3 flex flex-col gap-1.5">
            {navigation.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          <div className="mt-auto space-y-3 pt-8">
            <SidebarProgress />
            <div className="rounded-2xl border border-line/80 bg-paper/70 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-brand">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-sun"
                  />
                  No barriers
                </p>
                <SoundToggle className="-mr-1" />
              </div>
              <p className="mt-1.5 text-[0.7rem] leading-relaxed text-ink-soft">
                No hearts, energy, daily limits or paywalls. Practise as long as
                you like; mastery decides what to review next.
              </p>
            </div>
            <p className="px-1 text-[0.66rem] leading-relaxed text-ink-soft">
              Local-first: your progress stays in this browser.
            </p>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/85 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <BrandMark />
            <span className="leading-tight">
              <span className="block text-base font-black tracking-tight">
                Kurmancî
              </span>
              <span className="block text-[0.65rem] font-semibold text-ink-soft">
                A1 → B1
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="chip bg-surface/80">A1–A2</span>
            <SoundToggle />
          </div>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-5xl px-4 pb-32 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-10"
      >
        {children}
      </main>

      <nav
        aria-label="Main"
        className="fixed inset-x-3 bottom-[max(0.65rem,env(safe-area-inset-bottom))] z-30 flex items-stretch gap-0.5 rounded-2xl border border-line/80 bg-surface/90 p-1.5 shadow-lift backdrop-blur-xl lg:hidden"
      >
        {navigation.map((item) => (
          <NavLink key={item.href} {...item} compact />
        ))}
      </nav>
    </div>
  );
}
