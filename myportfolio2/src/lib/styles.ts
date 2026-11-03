import type { Locale } from "@/lib/i18n";

/**
 * Persian is a connected script: letter-spacing and aggressive negative
 * tracking visually break words. Only apply Latin typographic tricks to /en.
 */
export function displayTracking(locale: Locale): string {
  return locale === "en" ? "tracking-[-0.03em]" : "tracking-normal";
}

/** Small all-caps labels look right in English only. */
export function labelStyle(locale: Locale): string {
  return locale === "en"
    ? "uppercase tracking-[0.16em]"
    : "tracking-normal";
}

/** The page shell: one max width, one set of gutters, everywhere. */
export const shell = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export const linkQuiet = `underline decoration-line decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${focusRing}`;

export const buttonPrimary = `inline-flex h-11 items-center justify-center gap-2 bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-accent ${focusRing}`;

export const buttonGhost = `inline-flex h-11 items-center justify-center gap-2 border border-line px-6 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-paper ${focusRing}`;

/** The one loud button on the site: see globals.css for the metal treatment. */
export const metalButton = `metal-button ${focusRing}`;

export const fieldStyle =
  "mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-ink focus:outline-none focus:ring-0";
