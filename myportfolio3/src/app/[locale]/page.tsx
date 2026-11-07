import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { isLocale } from "@/lib/i18n";
import { displayTracking, labelStyle, shell } from "@/lib/styles";
import { CircleLink } from "@/components/circle-link";
import { ContactBand } from "@/components/contact-band";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
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
  const mono = `font-mono text-[11px] text-soft sm:text-[10px] ${labelStyle(locale)}`;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line sm:flex sm:min-h-[min(calc(100dvh-4rem),40rem)] sm:flex-col sm:justify-center">
        <div className={`${shell} pt-4 sm:pt-8`}>
          <div className="relative flex min-h-[340px] flex-col justify-center py-6 sm:min-h-[460px] sm:py-10">
            <h1
              data-rise
              aria-label={`${c.heroLines[0]} ${c.heroLines[1]}`}
              className={`relative z-10 font-display text-hero font-semibold uppercase leading-[0.84] ${displayTracking(locale)}`}
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

            <div className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-start gap-4 lg:flex">
              <p className={`${mono} text-start`}>{c.heroMeta}</p>
              <CircleLink href="#work" label={c.heroCta} icon="down" />
              <p className={`${mono} text-start`}>{c.availability}</p>
            </div>

            <div className="absolute right-0 top-1/2 z-20 hidden w-56 -translate-y-1/2 flex-col items-end gap-5 text-end lg:flex">
              <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.12em] sm:text-[10px]">
                {c.heroStatement}
              </p>
              <ul className="space-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-soft">
                {c.heroServices.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between gap-4 sm:mt-12 lg:hidden">
              <p className="max-w-[62%] font-mono text-[11px] uppercase leading-5 tracking-[0.1em] text-soft sm:text-[10px]">
                {c.heroStatement}
              </p>
              <CircleLink href="#work" label={c.heroCta} icon="down" />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 border-b border-line">
        <div className={`${shell} py-20 sm:py-28`}>
          <Reveal>
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
                  className="flex flex-col-reverse border border-line px-6 py-8"
                >
                  <dt className={`mt-2 ${mono}`}>{fact.label}</dt>
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
              className={`text-center font-display text-display font-semibold uppercase leading-none ${displayTracking(locale)}`}
            >
              {c.workLabel}
            </h2>
          </Reveal>
          <WorkGrid locale={locale} />
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20 border-b border-line">
        <div className={`${shell} py-20 sm:py-28`}>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2
                className={`display-wide font-display text-display font-semibold uppercase leading-tight text-balance ${displayTracking(locale)}`}
              >
                {c.servicesTitle}
              </h2>
              <p className="mt-5 font-mono text-[11px] uppercase leading-5 tracking-[0.1em] text-soft sm:text-[10px]">
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
    </>
  );
}
