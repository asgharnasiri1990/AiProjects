"use client";

import { useState } from "react";
import Link from "next/link";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { focusRing, labelStyle, shell } from "@/lib/styles";
import {
  CloseIcon,
  GitHubIcon,
  LinkedInIcon,
  MenuIcon,
} from "@/components/icons";
import { LanguageSwitch } from "@/components/language-switch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [open, setOpen] = useState(false);

  const links = [
    { label: c.nav.home, href: `/${locale}#home` },
    { label: c.nav.about, href: `/${locale}#about` },
    { label: c.nav.services, href: `/${locale}#services` },
    { label: c.nav.projects, href: `/${locale}#work` },
  ];

  const close = () => setOpen(false);

  const social = profile.socials.find((item) => item.label === "GitHub");
  const linkedin = profile.socials.find((item) => item.label === "LinkedIn");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className={`${shell} flex h-16 items-center gap-4`}>
        <Link
          href={`/${locale}`}
          onClick={close}
          className={`rounded font-display text-sm font-semibold uppercase tracking-[0.2em] ${focusRing}`}
        >
          PORTFOLIO.
        </Link>

        <nav
          aria-label={c.nav.home}
          className="mx-auto hidden items-center gap-2 md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full border border-line px-4 py-2 font-mono text-[10px] text-soft transition-colors hover:border-ink hover:text-ink ${labelStyle(locale)} ${focusRing}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5 md:ms-0">
          {social ? (
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`grid h-9 w-9 place-items-center rounded-full border border-line text-soft transition-colors hover:border-ink hover:text-ink ${focusRing}`}
            >
              <GitHubIcon width={16} height={16} />
            </a>
          ) : null}
          {linkedin ? (
            <a
              href={linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`grid h-9 w-9 place-items-center rounded-full border border-line text-soft transition-colors hover:border-ink hover:text-ink ${focusRing}`}
            >
              <LinkedInIcon width={15} height={15} />
            </a>
          ) : null}
          <LanguageSwitch locale={locale} label={c.switchLanguage} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? c.closeMenu : c.openMenu}
            className={`grid h-9 w-9 place-items-center rounded-full border border-line text-soft transition-colors hover:border-ink hover:text-ink md:hidden ${focusRing}`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-paper md:hidden">
          <nav
            aria-label={c.nav.home}
            className={`${shell} flex flex-col gap-1 py-3`}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={`rounded-full border border-line px-4 py-3 font-mono text-[10px] text-soft transition-colors hover:border-ink hover:text-ink ${labelStyle(locale)} ${focusRing}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
