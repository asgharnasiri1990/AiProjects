export const locales = ["fa", "en"] as const;

export type Locale = (typeof locales)[number];

/** Persian is the default; the language switch stores an explicit choice. */
export const defaultLocale: Locale = "fa";

export const localeCookie = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "fa" || value === "en";
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "fa" ? "en" : "fa";
}

/** Maps /fa/work/x to /en/work/x and leaves the rest of the path intact. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return `/${target}`;
  if (isLocale(segments[0])) segments[0] = target;
  else segments.unshift(target);

  return `/${segments.join("/")}`;
}

export interface Localized {
  fa: string;
  en: string;
}

export function t(value: Localized, locale: Locale): string {
  return value[locale];
}
