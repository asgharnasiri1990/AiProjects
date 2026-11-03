"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy } from "@/content/copy";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { buttonPrimary, displayTracking } from "@/lib/styles";

export default function LocaleNotFound() {
  const pathname = usePathname() ?? "";
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = isLocale(segment) ? segment : defaultLocale;
  const c = copy[locale];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-start px-6 py-24 sm:py-32">
      <p className="text-sm font-medium text-accent">404</p>
      <h1
        className={`mt-4 text-display font-semibold leading-tight ${displayTracking(locale)}`}
      >
        {c.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-md text-base leading-8 text-ink-soft">
        {c.notFoundBody}
      </p>
      <Link href={`/${locale}`} className={`mt-8 ${buttonPrimary}`}>
        {c.notFoundCta}
      </Link>
    </div>
  );
}
