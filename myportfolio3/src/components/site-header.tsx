"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { focusRing, labelStyle, shell } from "@/lib/styles";
import {
  CloseIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MenuIcon,
} from "@/components/icons";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({
  locale,
  theme,
}: {
  locale: Locale;
  theme: "paper" | "ink";
}) {
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
  const instagram = profile.socials.find((item) => item.label === "Instagram");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className={`${shell} flex h-16 items-center gap-4`}>
        <Link
          href={`/${locale}`}
          onClick={close}
          className={`flex items-center gap-2.5 rounded font-display text-[15px] font-semibold uppercase tracking-[0.2em] sm:text-sm ${focusRing}`}
        >
          <Image
            src={profile.photo}
            alt={profile.name[locale]}
            width={36}
            height={36}
            className="h-10 w-10 rounded-full border-2 border-[#7c3aed]/40 object-cover sm:h-9 sm:w-9 hover:border-[#7c3aed] transition-colors"
          />
          <span dir="ltr" className="max-[359px]:hidden">
            PORTFOLIO.
          </span>
        </Link>

        <nav
          aria-label={c.navPrimary}
          className="mx-auto hidden items-center gap-2 md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full border border-line px-4 py-2 font-mono text-[11px] sm:text-[10px] text-soft transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#f5f3ff] ${labelStyle(locale)} ${focusRing}`}
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
              aria-label={`${social.label} — ${c.externalLink}`}
              className={`hidden h-9 w-9 place-items-center rounded-full border border-line text-soft transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#f5f3ff] sm:grid ${focusRing}`}
            >
              <GitHubIcon width={16} height={16} />
            </a>
          ) : null}
          {linkedin ? (
            <a
              href={linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${linkedin.label} — ${c.externalLink}`}
              className={`hidden h-9 w-9 place-items-center rounded-full border border-line text-soft transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#f5f3ff] sm:grid ${focusRing}`}
            >
              <LinkedInIcon width={15} height={15} />
            </a>
          ) : null}
          {instagram ? (
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${instagram.label} — ${c.externalLink}`}
              className={`hidden h-9 w-9 place-items-center rounded-full border border-line text-soft transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#f5f3ff] sm:grid ${focusRing}`}
            >
              <InstagramIcon width={16} height={16} />
            </a>
          ) : null}
          <ThemeToggle label={c.switchTheme} theme={theme} />
          <LanguageSwitch locale={locale} label={c.switchLanguage} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? c.closeMenu : c.openMenu}
            className={`grid h-10 w-10 place-items-center rounded-full border border-line text-soft transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed] sm:h-9 sm:w-9 md:hidden ${focusRing}`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-paper md:hidden">
          <nav
            aria-label={c.navMobile}
            className={`${shell} flex flex-col gap-1 pb-1 pt-3`}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={`rounded-full border border-line px-4 py-3.5 text-sm text-soft transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#f5f3ff] ${labelStyle(locale)} ${focusRing}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div
            className={`${shell} flex flex-wrap items-center gap-2 border-t border-line py-3`}
          >
            {profile.socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.label} — ${c.externalLink}`}
                className={`inline-flex h-10 items-center rounded-full border border-line px-4 font-mono text-[12px] text-soft transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#f5f3ff] ${focusRing}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
