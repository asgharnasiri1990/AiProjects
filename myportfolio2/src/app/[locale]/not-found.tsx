"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy } from "@/content/copy";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { buttonPrimary, displayTracking, labelStyle, shell } from "@/lib/styles";

export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = isLocale(segment) ? segment : defaultLocale;
  const c = copy[locale];

  return (
    <div className={`${shell} pb-24 pt-16 lg:pt-24`}>
      <p className={`font-mono text-[11px] text-muted nums ${labelStyle(locale)}`}>
        <bdi dir="ltr">404</bdi>
      </p>
      <h1
        className={`mt-3 max-w-[20ch] text-display font-medium leading-[1.1] ${displayTracking(
          locale,
        )}`}
      >
        {c.notFoundTitle}
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted">{c.notFoundBody}</p>
      <Link href={`/${locale}`} className={`mt-8 ${buttonPrimary}`}>
        {c.notFoundCta}
      </Link>
    </div>
  );
}
