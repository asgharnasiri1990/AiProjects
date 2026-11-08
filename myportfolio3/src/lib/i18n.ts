export const locales = ["en", "fa"] as const;

export type Locale = (typeof locales)[number];

/** English is the default for this version. */
export const defaultLocale: Locale = "en";

export const localeCookie = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "fa";
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "fa" : "en";
}

export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return `/${target}`;
  if (isLocale(segments[0])) segments[0] = target;
  else segments.unshift(target);

  return `/${segments.join("/")}`;
}

export interface Localized {
  en: string;
  fa: string;
}
