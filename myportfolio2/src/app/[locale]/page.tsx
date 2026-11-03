import Link from "next/link";
import { notFound } from "next/navigation";
import { archive } from "@/content/archive";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import { work } from "@/content/work";
import { isLocale } from "@/lib/i18n";
import {
  displayTracking,
  focusRing,
  labelStyle,
  linkQuiet,
  metalButton,
  shell,
} from "@/lib/styles";
import { ArchiveGrid } from "@/components/archive-grid";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { WorkRow } from "@/components/work-row";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = copy[locale];

  return (
    <>
      <section
        className={`${shell} flex min-h-[min(calc(100dvh-3.5rem),52rem)] flex-col justify-between pb-8 pt-8 lg:pb-10 lg:pt-10`}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
          <p
            className={`font-mono text-[11px] text-muted ${labelStyle(locale)}`}
          >
            {profile.role[locale]} — {profile.location[locale]}
          </p>
          <p
            className={`flex items-center gap-2 font-mono text-[11px] ${labelStyle(
              locale,
            )}`}
          >
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {c.availability}
          </p>
        </div>

        <div className="relative flex flex-1 items-center py-10 lg:py-14">
          {/* The accent disc stands in for a portrait: one solid shape, the monogram. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute end-0 top-1/2 hidden -translate-y-1/2 sm:block"
          >
            <div className="grid size-[clamp(190px,25vw,370px)] place-items-center rounded-full bg-accent text-canvas">
              <span className="font-mono text-[clamp(2.25rem,6.5vw,5rem)] leading-none">
                {profile.initials}
              </span>
            </div>
          </div>

          <h1
            className={`relative max-w-[20ch] text-mega font-medium lg:max-w-[min(15ch,56%)] ${
              locale === "fa" ? "leading-[1.06]" : "leading-[0.95]"
            } ${displayTracking(locale)}`}
          >
            {c.heroStatement}
          </h1>
        </div>

        <div className="grid gap-8 border-t border-line pt-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p
              className={`max-w-[46ch] text-sm text-muted ${
                locale === "fa" ? "leading-8" : "leading-7"
              }`}
            >
              {c.heroLead}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={`/${locale}/work`} className={metalButton}>
                {c.ctaWork}
                <ArrowRightIcon className="rtl:-scale-x-100" />
              </Link>
              <Link href={`/${locale}/contact`} className={`text-sm ${linkQuiet}`}>
                {c.ctaContact}
              </Link>
            </div>
          </div>

          <ul className="flex flex-wrap items-end gap-x-6 gap-y-2 lg:col-span-4 lg:col-start-9 lg:justify-end">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-xs transition-colors hover:text-accent ${focusRing}`}
                >
                  {social.label}
                  <span className="sr-only"> ({c.externalLink})</span>
                  <ArrowUpRightIcon className="h-3 w-3 opacity-50" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className={shell}>
          <div className="grid grid-cols-3 gap-px bg-line">
            {c.facts.map((fact) => (
              <div key={fact.label} className="bg-paper p-5 sm:p-6">
                <p className="font-mono text-3xl nums sm:text-4xl">
                  <bdi dir="ltr">{fact.value}</bdi>
                </p>
                <p className="mt-1.5 text-[11px] leading-5 text-muted sm:text-xs">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${shell} py-14 lg:py-20`}>
        <SectionHeading
          locale={locale}
          label={`01 — ${c.nav.work}`}
          title={c.workTitle}
          href={`/${locale}/work`}
          hrefLabel={c.workAll}
        />
        <ol>
          {work.map((item) => (
            <WorkRow key={item.slug} item={item} locale={locale} />
          ))}
        </ol>
      </section>

      <section className={`${shell} pb-14 lg:pb-20`}>
        <SectionHeading
          locale={locale}
          label={`02 — ${c.nav.archive}`}
          title={c.archiveTitle}
          href={`/${locale}/archive`}
          hrefLabel={c.archiveAll}
        />
        <ArchiveGrid locale={locale} items={archive.slice(0, 6)} />
      </section>

      <section className="bg-ink text-paper">
        <div className={`${shell} py-14 lg:py-20`}>
          <p
            className={`font-mono text-[11px] text-paper/50 ${labelStyle(locale)}`}
          >
            {c.contactEmail}
          </p>
          <p className="mt-3">
            <a
              href={`mailto:${profile.email}`}
              dir="ltr"
              className={`inline-block break-all text-2xl font-medium underline decoration-paper/25 decoration-2 underline-offset-8 transition-colors hover:decoration-accent sm:text-4xl ${displayTracking(
                locale,
              )} ${focusRing}`}
            >
              {profile.email}
            </a>
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm text-paper/70 transition-colors hover:text-paper ${focusRing}`}
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
