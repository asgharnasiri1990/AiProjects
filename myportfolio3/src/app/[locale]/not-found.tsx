import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { copy } from "@/content/copy";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { displayTracking, focusRing, labelStyle, shell } from "@/lib/styles";

export async function generateMetadata(): Promise<Metadata> {
  const current = (await headers()).get("x-locale");
  const locale = isLocale(current) ? current : defaultLocale;

  return {
    title: locale === "fa" ? "صفحه پیدا نشد" : "Page not found",
    robots: { index: false, follow: false },
  };
}

export default async function LocaleNotFound() {
  // `not-found.tsx` gets no params. The proxy puts the current locale on the
  // request so this page can be rendered on the server, not only after hydration.
  const current = (await headers()).get("x-locale");
  const locale = isLocale(current) ? current : defaultLocale;
  const c = copy[locale];

  return (
    <div className={`${shell} py-24 sm:py-32`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft">
        404
      </p>
      <h1
        className={`mt-4 font-display text-display font-semibold leading-tight ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
      >
        {c.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-soft">
        {c.notFoundBody}
      </p>
      <Link
        href={`/${locale}`}
        className={`mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 font-mono text-[10px] text-paper transition-colors hover:bg-signal hover:text-signal-ink ${labelStyle(locale)} ${focusRing}`}
      >
        {c.notFoundCta}
      </Link>
    </div>
  );
}
