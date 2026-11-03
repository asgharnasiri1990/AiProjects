import type { Locale } from "@/lib/i18n";

/**
 * Persian is a connected script: letter-spacing and aggressive negative
 * tracking visually break words. Only apply Latin typographic tricks to /en.
 */
export function displayTracking(locale: Locale): string {
  return locale === "en" ? "tracking-tight" : "";
}

/** Small all-caps labels look right in English only. */
export function eyebrowStyle(locale: Locale): string {
  return locale === "en"
    ? "uppercase tracking-[0.18em]"
    : "tracking-normal";
}

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export const buttonPrimary = `inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-canvas transition-colors hover:bg-accent ${focusRing}`;

export const buttonGhost = `inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line px-6 text-sm font-medium text-ink transition-colors hover:border-ink ${focusRing}`;
