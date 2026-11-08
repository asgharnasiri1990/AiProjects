import type { Locale } from "@/lib/i18n";

export const shell =
  "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

/** Uppercase + tracking only works for Latin; Persian is a connected script. */
export function latinLabel(
  locale: Locale,
  tracking = "tracking-[0.16em]",
): string {
  return locale === "en" ? `uppercase ${tracking}` : "";
}

export function labelStyle(locale: Locale): string {
  return latinLabel(locale);
}

/** Tracking without uppercase, for display-sized Latin text. */
export function latinTracking(locale: Locale, tracking: string): string {
  return locale === "en" ? tracking : "";
}

export function displayTracking(locale: Locale): string {
  return locale === "en" ? "tracking-[-0.04em]" : "tracking-normal";
}
