import Link from "next/link";
import { ArrowRightIcon, HomeIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-10 text-center sm:py-16">
      <div className="card relative overflow-hidden px-6 py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-sun-soft/70 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-brand-soft/70 blur-2xl"
        />
        <div className="relative">
          <Mascot className="mx-auto w-28" />
          <p className="eyebrow mt-4 justify-center">404 · Rûpel nehat dîtin</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            This page is not here.
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            This lesson does not exist yet, or it is still being authored.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Link href="/" className="btn btn-primary">
              <HomeIcon /> Back to the path
            </Link>
            <Link href="/review" className="btn btn-secondary">
              Review instead <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
