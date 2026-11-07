import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { isLocale } from "@/lib/i18n";
import {
  displayTracking,
  labelStyle,
  shell,
} from "@/lib/styles";
import { CircleLink } from "@/components/circle-link";
import { ContactBand } from "@/components/contact-band";
import { Portrait } from "@/components/portrait";
import { ServicesAccordion } from "@/components/services-accordion";
import { WorkGrid } from "@/components/work-grid";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    alternates: {
      languages: { en: "/en", fa: "/fa" },
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = copy[locale];
  const mono = `font-mono text-[10px] text-soft ${labelStyle(locale)}`;

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden border-b border-line sm:flex sm:min-h-[min(calc(100dvh-4rem),52rem)] sm:flex-col sm:justify-center">
        <div className={`${shell} pt-6 sm:pt-8`}>
          <div
            className={`flex items-center justify-between gap-4 border-b border-line pb-4 ${mono}`}
          >
            <span>{c.heroMeta}</span>
            <span>{c.heroLocation}</span>
          </div>

          <div className="relative mt-4">
            <h1
              data-rise
              aria-label={`${c.heroLines[0]} ${c.heroLines[1]}`}
              className={`display-fade display-wide relative z-10 font-display text-hero font-semibold uppercase leading-[0.84] ${displayTracking(locale)}`}
            >
              <span className="block">{c.heroLines[0]}</span>
              <span className="block">{c.heroLines[1]}</span>
            </h1>

            <div className="relative z-0 -mt-6 flex justify-center sm:-mt-10">
              <div className="pointer-events-none w-[80%] max-w-[320px] sm:w-[52%] sm:max-w-[400px]">
                <Portrait alt={c.portraitAlt} priority />
              </div>
            </div>

            <div className="pointer-events-none absolute end-0 top-[42%] z-20 hidden w-56 flex-col items-end gap-5 text-end lg:flex">
              <p className="font-mono text-[10px] uppercase leading-5 tracking-[0.12em]">
                {c.heroStatement}
              </p>
              <ul className="space-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-soft">
                {c.heroServices.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative z-10 mt-3 flex items-end justify-between gap-6 border-t border-line pt-5 sm:mt-5">
            <p className="max-w-xs font-mono text-[10px] uppercase leading-5 tracking-[0.1em] text-soft lg:hidden">
              {c.heroStatement}
            </p>
            <div className="ms-auto flex items-center gap-3">
              <span className={mono}>{c.availability}</span>
              <CircleLink href="#work" label={c.heroCta} icon="down" />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 border-b border-line">
        <div className={`${shell} py-20 sm:py-28`}>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex items-start gap-5">
              <h2
                className={`display-wide font-display text-display font-semibold uppercase leading-none ${displayTracking(locale)}`}
              >
                {c.aboutLabel}
              </h2>
              <CircleLink href="#work" label={c.workLabel} />
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase leading-6 tracking-[0.06em]">
                {c.aboutQuote}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-7 text-soft">
                {c.aboutBody}
              </p>
            </div>
          </div>

          <dl className="mt-14 grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {c.facts.map((fact, index) => (
              <div
                key={fact.label}
                className={`flex flex-col-reverse py-8 sm:px-8 ${
                  index === 0 ? "sm:ps-0" : ""
                } ${index === c.facts.length - 1 ? "sm:pe-0" : ""}`}
              >
                <dt className={`mt-2 ${mono}`}>{fact.label}</dt>
                <dd
                  className={`font-display text-5xl font-semibold leading-none ${displayTracking(locale)}`}
                >
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Featured projects */}
      <section id="work" className="scroll-mt-20 border-b border-line">
        <div className={`${shell} py-20 sm:py-28`}>
          <h2
            className={`display-wide font-display text-display font-semibold uppercase leading-none ${displayTracking(locale)}`}
          >
            {c.workLabel}
          </h2>
          <div className="mt-10">
            <WorkGrid locale={locale} />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20 border-b border-line">
        <div className={`${shell} py-20 sm:py-28`}>
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className={`display-wide font-display text-display font-semibold uppercase leading-tight text-balance ${displayTracking(locale)}`}
            >
              {c.servicesTitle}
            </h2>
            <p className="mt-5 font-mono text-[10px] uppercase leading-5 tracking-[0.1em] text-soft">
              {c.servicesLead}
            </p>
          </div>

          <div className="mt-12">
            <ServicesAccordion locale={locale} />
          </div>
        </div>
      </section>

      <ContactBand locale={locale} />
    </>
  );
}
