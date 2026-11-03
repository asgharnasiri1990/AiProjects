"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import {
  localeCookie,
  otherLocale,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n";
import { focusRing, labelStyle, shell } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";

const links = ["work", "archive", "about", "contact"] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const target = otherLocale(locale);

  function switchLanguage() {
    document.cookie = `${localeCookie}=${target}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    router.push(switchLocalePath(pathname, target));
  }

  function isActive(section: (typeof links)[number]) {
    const href = `/${locale}/${section}`;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className={`${shell} flex h-14 items-center justify-between gap-6`}>
        <Link
          href={`/${locale}`}
          className={`flex items-baseline gap-2 ${focusRing}`}
        >
          <span className="text-sm font-medium">{profile.name[locale]}</span>
          <span className="hidden font-mono text-[10px] text-muted sm:inline">
            {profile.role[locale]}
          </span>
        </Link>

        <nav aria-label={c.nav.work} className="hidden md:block">
          <ul className="flex items-center gap-7">
            {links.map((section) => (
              <li key={section}>
                <Link
                  href={`/${locale}/${section}`}
                  aria-current={isActive(section) ? "page" : undefined}
                  className={`text-sm transition-colors hover:text-accent ${
                    isActive(section) ? "text-accent" : "text-ink"
                  } ${focusRing}`}
                >
                  {c.nav[section]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={switchLanguage}
            aria-label={c.switchLanguage}
            className={`flex items-center gap-1 font-mono text-[11px] ${labelStyle(
              locale,
            )} ${focusRing}`}
          >
            <span aria-hidden="true" className={locale === "fa" ? "text-ink" : "text-muted"}>
              FA
            </span>
            <span aria-hidden="true" className="text-line">
              /
            </span>
            <span aria-hidden="true" className={locale === "en" ? "text-ink" : "text-muted"}>
              EN
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-menu"
            className={`flex items-center gap-1.5 text-sm md:hidden ${focusRing}`}
          >
            {open ? c.closeMenu : c.openMenu}
          </button>
        </div>
      </div>

      {open ? (
        <div id="site-menu" className="border-t border-line md:hidden">
          <nav aria-label={c.nav.work} className={`${shell} py-2`}>
            <ul className="divide-y divide-line">
              {links.map((section) => (
                <li key={section}>
                  <Link
                    href={`/${locale}/${section}`}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(section) ? "page" : undefined}
                    className={`flex items-center justify-between py-3 text-base ${
                      isActive(section) ? "text-accent" : "text-ink"
                    } ${focusRing}`}
                  >
                    {c.nav[section]}
                    <ArrowUpRightIcon className="opacity-40 rtl:-scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
