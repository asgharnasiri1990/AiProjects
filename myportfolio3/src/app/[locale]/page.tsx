import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { isLocale } from "@/lib/i18n";
import {
  displayTracking,
  labelStyle,
  latinLabel,
  shell,
} from "@/lib/styles";
import { CircleLink } from "@/components/circle-link";
import { ContactBand } from "@/components/contact-band";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
import { ServicesAccordion } from "@/components/services-accordion";
import { VisitTracker } from "@/components/visit-tracker";
import { WorkGrid } from "@/components/work-grid";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", fa: "/fa", "x-default": "/en" },
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = copy[locale];
  const mono = `font-mono text-[11px] sm:text-[10px] ${labelStyle(locale)}`;

  return (
    <>
      {/* Hero. A lime block in both themes, so its type is `signal-ink`. */}
      <section className="relative overflow-hidden border-b border-signal-ink/20 bg-signal text-signal-ink sm:flex sm:min-h-[min(calc(100dvh-4rem),40rem)] sm:flex-col sm:justify-center">
        <div className={`${shell} pt-4 sm:pt-8`}>
          <div className="relative flex min-h-[340px] flex-col justify-center py-6 sm:min-h-[460px] sm:py-10">
            {/*
              The two side columns are absolutely positioned, so the headline
              is padded by their width and sized against that content box
              (15.4cqw ≈ one line). Its own 10vw size overlapped the right
              column between ~1024px and ~1380px.
            */}
            <div className="@container z-10 lg:px-56">
              <h1
                data-rise
                dir="ltr"
                lang={locale === "fa" ? "en" : undefined}
                aria-label={`${c.heroLines[0]} ${c.heroLines[1]}`}
                className={`hero-on-signal relative font-display text-hero font-semibold uppercase leading-[0.84] tracking-[-0.04em] lg:text-[clamp(3.15rem,15.4cqw,9.2rem)]`}
              >
                <span className="block text-center">
                  <span className="display-fade-l inline-block">
                    {c.heroLines[0]}
                  </span>
                </span>
                <span className="block text-center">
                  <span className="display-fade-r inline-block">
                    {c.heroLines[1]}
                  </span>
                </span>
              </h1>
            </div>

            <div className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-start gap-4 lg:flex">
              <p className={`${mono} text-start text-signal-ink/70`}>{c.heroMeta}</p>
            </div>

            <div className="absolute right-0 top-1/2 z-20 hidden w-56 -translate-y-1/2 flex-col items-end gap-5 text-end lg:flex">
              <p
                className={`font-mono text-[11px] leading-5 sm:text-[10px] ${latinLabel(locale, "tracking-[0.12em]")}`}
              >
                {c.heroStatement}
              </p>
              <ul
                className={`space-y-2 font-mono text-[10px] text-signal-ink/60 ${latinLabel(locale, "tracking-[0.12em]")}`}
              >
                {c.heroServices.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-8 max-w-[85%] sm:mt-12 lg:hidden">
              <p
                className={`font-mono text-[11px] text-signal-ink/70 sm:text-[10px] ${latinLabel(locale, "tracking-[0.12em]")}`}
              >
                {c.heroMeta}
              </p>
              <p
                className={`mt-2 font-mono text-[11px] leading-5 text-signal-ink/70 sm:text-[10px] ${latinLabel(locale, "tracking-[0.1em]")}`}
              >
                {c.heroStatement}
              </p>
            </div>
          </div>

          <div className="-mx-5 mt-8 bg-signal-ink px-5 py-3 text-signal sm:-mx-8 sm:mt-10 sm:px-8 lg:-mx-12 lg:px-12">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] sm:hidden">
              <span aria-hidden className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
              </span>
              <span className={latinLabel(locale, "tracking-[0.14em]")}>
                {c.availability}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`hidden shrink-0 items-center gap-2 font-mono text-[10px] sm:flex ${latinLabel(locale, "tracking-[0.14em]")}`}
              >
                <span aria-hidden className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-signal opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                </span>
                {c.availability}
              </span>

              <div
                aria-hidden="true"
                dir="ltr"
                className="hero-ticker relative min-w-0 flex-1 overflow-hidden"
              >
                <div className="hero-ticker-track flex w-max items-center font-mono text-[10px] uppercase tracking-[0.14em]">
                  {[...c.heroTicker, ...c.heroTicker].map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="flex items-center gap-4 pe-4"
                    >
                      <span>{item}</span>
                      <span aria-hidden className="h-1 w-1 rounded-full bg-signal/40" />
                    </span>
                  ))}
                </div>
              </div>

              <CircleLink
                href="#work"
                label={c.heroCta}
                icon="down"
                onDark
                className="shrink-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 border-b border-line bg-wash">
        <div className={`${shell} py-20 sm:py-28`}>
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex items-start gap-5">
                <h2
                  className={`display-wide font-display text-display font-semibold leading-none ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
                >
                  {c.aboutLabel}
                </h2>
                <CircleLink href="#work" label={c.workLabel} />
              </div>

              <div>
                <p className="max-w-xl text-lg leading-8 text-ink text-pretty">
                  {c.aboutLead}
                </p>
                <div className="mt-5 max-w-xl space-y-4 text-[15px] leading-7 text-soft sm:text-sm">
                  {c.aboutBody.map((paragraph) => (
                    <p key={paragraph} className="text-pretty">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <dl className="mt-14 grid gap-4 sm:grid-cols-3">
              {c.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col-reverse border border-line bg-paper px-6 py-8 transition-colors hover:border-signal hover:bg-signal/15"
                >
                  <dt className={`mt-2 text-soft ${mono}`}>{fact.label}</dt>
                  <dd
                    className={`font-display text-4xl font-semibold leading-none sm:text-5xl ${displayTracking(locale)}`}
                  >
                    <CountUp value={fact.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Featured projects */}
      <section id="work" className="scroll-mt-20 border-b border-line">
        <div className={`${shell} py-20 sm:py-28`}>
          <Reveal>
            <h2
              className={`text-center font-display text-display font-semibold leading-none ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
            >
              {c.workLabel}
            </h2>
          </Reveal>
          <WorkGrid locale={locale} />
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20 border-b border-line bg-wash">
        <div className={`${shell} py-20 sm:py-28`}>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2
                className={`display-wide font-display text-display font-semibold leading-tight text-balance ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
              >
                {c.servicesTitle}
              </h2>
              <p
                className={`mt-5 font-mono text-[11px] leading-5 text-soft sm:text-[10px] ${latinLabel(locale, "tracking-[0.1em]")}`}
              >
                {c.servicesLead}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12">
              <ServicesAccordion locale={locale} />
            </div>
          </Reveal>
        </div>
      </section>

      <ContactBand locale={locale} />
      <VisitTracker />
    </>
  );
}
