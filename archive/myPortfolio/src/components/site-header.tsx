"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import { type Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/styles";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { LanguageSwitch } from "@/components/language-switch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);

  const links = [
    { label: c.navWork, path: `/${locale}#work`, active: pathname.includes("/work") },
    { label: c.navLog, path: `/${locale}/log`, active: pathname.includes("/log") },
    { label: c.navAbout, path: `/${locale}#about`, active: false },
    { label: c.navContact, path: `/${locale}#contact`, active: false },
  ];

  const close = () => setOpen(false);

  const navLink = (link: (typeof links)[number]) =>
    `relative rounded-md px-3 py-2 text-sm transition-colors ${
      link.active ? "text-ink" : "text-ink-soft hover:text-ink"
    } ${focusRing}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-6">
        <Link
          href={`/${locale}`}
          onClick={close}
          className={`flex items-center gap-3 rounded-md ${focusRing}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-[11px] font-semibold text-canvas">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-medium sm:block">
            {profile.name[locale]}
          </span>
        </Link>

        <nav aria-label={c.navHome} className="ms-auto hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              aria-current={link.active ? "page" : undefined}
              className={navLink(link)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <LanguageSwitch locale={locale} label={c.switchLanguage} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? c.closeMenu : c.openMenu}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink md:hidden ${focusRing}`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-canvas md:hidden">
          <nav aria-label={c.navHome} className="mx-auto flex max-w-5xl flex-col px-6 py-3">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={close}
                className={`rounded-md px-2 py-3 text-sm transition-colors ${
                  link.active ? "text-ink" : "text-ink-soft hover:text-ink"
                } ${focusRing}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
