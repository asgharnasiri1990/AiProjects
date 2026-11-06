"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy } from "@/content/copy";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { displayTracking, focusRing, shell } from "@/lib/styles";

export default function LocaleNotFound() {
  const pathname = usePathname() ?? "";
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = isLocale(segment) ? segment : defaultLocale;
  const c = copy[locale];

  return (
    <div className={`${shell} py-24 sm:py-32`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft">
        404
      </p>
      <h1
        className={`mt-4 font-display text-display font-semibold uppercase leading-tight ${displayTracking(locale)}`}
      >
        {c.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-soft">
        {c.notFoundBody}
      </p>
      <Link
        href={`/${locale}`}
        className={`mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-soft ${focusRing}`}
      >
        {c.notFoundCta}
      </Link>
    </div>
  );
}
