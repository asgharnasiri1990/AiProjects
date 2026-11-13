import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import {
  displayTracking,
  focusRing,
  labelStyle,
  shell,
} from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";
import { CopyEmail } from "@/components/copy-email";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

export function ContactBand({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="border-t border-line bg-band text-band-ink">
      <div className={`${shell} pb-10 pt-16 sm:pt-24`}>
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
          <p
            className={`font-mono text-[12px] sm:text-[10px] text-band-ink/50 ${labelStyle(locale)}`}
          >
            {c.contactLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} — ${c.externalLink}`}
                className={`inline-flex h-10 items-center rounded-full border border-band-ink/30 px-4 font-mono text-[12px] transition-colors hover:border-signal hover:bg-signal hover:text-signal-ink sm:h-9 sm:text-[10px] ${labelStyle(locale)} ${focusRing}`}
              >
                {social.label}
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              className={`inline-flex h-10 items-center rounded-full border border-band-ink/30 px-4 font-mono text-[12px] transition-colors hover:border-signal hover:bg-signal hover:text-signal-ink sm:h-9 sm:text-[10px] ${labelStyle(locale)} ${focusRing}`}
            >
              {c.contactEmail}
            </a>
            <CopyEmail
              email={profile.email}
              label={c.copyEmail}
              copiedLabel={c.copied}
              locale={locale}
            />
          </div>
        </div>

        <h2
          className={`display-wide mt-14 font-display text-footer font-semibold leading-[0.9] text-signal ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
        >
          {c.contactTitle}
        </h2>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-md font-mono text-[12px] leading-5 text-band-ink/60 sm:text-[10px]">
            {c.contactLead}
          </p>
          <a
            href={`mailto:${profile.email}`}
            className={`inline-flex h-12 items-center gap-2 rounded-full bg-signal px-6 font-mono text-[12px] font-medium text-signal-ink transition-colors hover:bg-signal-hover sm:h-11 sm:text-[10px] ${labelStyle(locale)} ${focusRing}`}
          >
            {c.contactCta}
            <ArrowUpRightIcon width={14} height={14} />
          </a>
        </div>

        <div className="mt-14 border-t border-band-ink/25 pt-10 sm:mt-16 sm:pt-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,44rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p
                className={`font-mono text-[12px] text-band-ink/50 sm:text-[10px] ${labelStyle(locale)}`}
              >
                {c.formTitle}
              </p>
              <div className="mt-8">
                <ContactForm locale={locale} />
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-band-ink/15 pt-6 lg:items-end lg:border-0 lg:pt-1 lg:text-end">
              <p className="max-w-sm text-balance text-[12px] leading-6 text-band-ink/50">
                {c.formNote}
              </p>
              <div className="lg:mt-auto">
                <p
                  className={`font-mono text-[10px] text-band-ink/40 ${labelStyle(locale)}`}
                >
                  {c.contactEmail}
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  dir="ltr"
                  className="mt-2 inline-block font-mono text-[13px] text-band-ink transition-colors hover:text-signal focus-visible:text-signal focus-visible:outline-none"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-14 flex flex-col gap-2 border-t border-band-ink/25 pt-6 font-mono text-[11px] text-band-ink/60 sm:flex-row sm:items-center sm:justify-between sm:text-[10px] ${labelStyle(locale)}`}
        >
          <span>
            {c.footerRights} © {year}
          </span>
          <span>{c.footerCredit}</span>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
