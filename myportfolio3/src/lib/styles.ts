import type { Locale } from "@/lib/i18n";

export const shell =
  "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

/** Uppercase + tracking only works for Latin; Persian is a connected script. */
export function labelStyle(locale: Locale): string {
  return locale === "en" ? "uppercase tracking-[0.16em]" : "";
}

export function displayTracking(locale: Locale): string {
  return locale === "en" ? "tracking-[-0.04em]" : "tracking-normal";
}
