"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  localeCookie,
  otherLocale,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n";
import { focusRing } from "@/lib/styles";

export function LanguageSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const target = otherLocale(locale);

  // Remember the explicit choice so "/" stops guessing.
  const remember = () => {
    document.cookie = `${localeCookie}=${target}; path=/; max-age=31536000; samesite=lax`;
  };

  const visible = target === "fa" ? "فا" : "EN";

  return (
    <Link
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      lang={target}
      onClick={remember}
      aria-label={`${visible} — ${label}`}
      className={`inline-flex h-9 min-w-11 items-center justify-center rounded-full border border-line px-3 text-xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink ${focusRing}`}
    >
      {visible}
    </Link>
  );
}
