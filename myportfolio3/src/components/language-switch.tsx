"use client";

import { useEffect, useState } from "react";
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
  const visible = target === "fa" ? "FA" : "EN";
  const [hash, setHash] = useState("");

  // Keep the current anchor (#work, #services, …) when switching language.
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  const remember = () => {
    document.cookie = `${localeCookie}=${target}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <Link
      href={`${switchLocalePath(pathname, target)}${hash}`}
      hrefLang={target}
      lang={target}
      onClick={remember}
      aria-label={`${visible} — ${label}`}
      className={`inline-flex h-10 min-w-11 items-center justify-center rounded-full border border-line px-3 font-mono text-[12px] font-medium text-soft transition-colors hover:border-ink hover:text-ink sm:h-9 sm:text-[10px] ${focusRing}`}
    >
      {visible}
    </Link>
  );
}
