import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kurmancî — Learn Kurmanji",
    template: "%s · Kurmancî",
  },
  description:
    "A gamified, source-checked Kurmanji Kurdish course from A1.1 to B1. Unlimited practice, no hearts, no locks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
