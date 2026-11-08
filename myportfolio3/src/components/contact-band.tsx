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
                className={`inline-flex h-10 items-center rounded-full border border-band-ink/30 px-4 font-mono text-[12px] transition-colors hover:border-[#5eead4] hover:bg-[#5eead4]/10 hover:text-[#5eead4] sm:h-9 sm:text-[10px] ${labelStyle(locale)} ${focusRing}`}
              >
                {social.label}
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              className={`inline-flex h-10 items-center rounded-full border border-band-ink/30 px-4 font-mono text-[12px] transition-colors hover:border-[#5eead4] hover:bg-[#5eead4]/10 hover:text-[#5eead4] sm:h-9 sm:text-[10px] ${labelStyle(locale)} ${focusRing}`}
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
          className={`display-fade-light display-wide mt-14 font-display text-footer font-semibold leading-[0.9] ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
        >
          {c.contactTitle}
        </h2>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-md font-mono text-[12px] leading-5 text-band-ink/60 sm:text-[10px]">
            {c.contactLead}
          </p>
          <a
            href={`mailto:${profile.email}`}
            className={`inline-flex h-12 items-center gap-2 rounded-full bg-[#7c3aed] px-6 font-mono text-[12px] font-medium text-white transition-all hover:bg-[#6d28d9] hover:shadow-[0_0_0_3px_#ddd6fe] sm:h-11 sm:text-[10px] ${labelStyle(locale)} ${focusRing}`}
          >
            {c.contactCta}
            <ArrowUpRightIcon width={14} height={14} />
          </a>
        </div>

        <div
          className={`mt-16 flex flex-col gap-2 border-t border-band-ink/15 pt-6 font-mono text-[11px] text-band-ink/60 sm:flex-row sm:items-center sm:justify-between sm:text-[10px] ${labelStyle(locale)}`}
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
