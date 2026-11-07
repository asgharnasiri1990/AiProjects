import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { getWork, nextWork, work } from "@/content/work";
import { isLocale, locales } from "@/lib/i18n";
import {
  displayTracking,
  focusRing,
  labelStyle,
  linkQuiet,
  shell,
} from "@/lib/styles";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    work.map((item) => ({ locale, slug: item.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const item = getWork(slug);
  if (!item) return {};

  return {
    title: item.title[locale],
    description: item.tagline[locale],
    openGraph: {
      title: item.title[locale],
      description: item.tagline[locale],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const item = getWork(slug);
  if (!item) notFound();

  const c = copy[locale];
  const next = nextWork(item.slug);

  return (
    <article className={`${shell} pb-16 pt-8 lg:pt-12`}>
      <Link
        href={`/${locale}/work`}
        className={`inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-accent ${focusRing}`}
      >
        <ArrowLeftIcon className="rtl:rotate-180" />
        {c.caseBack}
      </Link>

      <header className="mt-8 grid gap-x-6 gap-y-4 lg:grid-cols-12">
        <p className="font-mono text-[11px] text-muted nums lg:col-span-1">
          {item.index}
        </p>
        <div className="lg:col-span-11">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h1
              className={`text-display font-medium leading-[1.1] ${displayTracking(
                locale,
              )}`}
            >
              {item.title[locale]}
            </h1>
            <span className="font-mono text-[11px] text-muted nums">
              {item.year}
            </span>
          </div>
          <p
            className={`mt-4 text-lede text-muted ${
              locale === "en" ? "max-w-[60ch]" : "max-w-[64ch]"
            }`}
          >
            {item.tagline[locale]}
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-10 border-t border-line pt-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <dt
                className={`font-mono text-[10px] text-muted ${labelStyle(
                  locale,
                )}`}
              >
                {c.caseRole}
              </dt>
              <dd className="mt-1 text-sm">{item.role[locale]}</dd>
            </div>

            <div>
              <dt
                className={`font-mono text-[10px] text-muted ${labelStyle(
                  locale,
                )}`}
              >
                {c.caseYear}
              </dt>
              <dd className="mt-1 font-mono text-sm nums">{item.year}</dd>
            </div>

            <div>
              <dt
                className={`font-mono text-[10px] text-muted ${labelStyle(
                  locale,
                )}`}
              >
                {c.caseStack}
              </dt>
              <dd className="mt-1 font-mono text-xs">
                <bdi dir="ltr">{item.stack.join(" · ")}</bdi>
              </dd>
            </div>

            <div>
              <dt
                className={`font-mono text-[10px] text-muted ${labelStyle(
                  locale,
                )}`}
              >
                {c.caseSource}
              </dt>
              <dd className="mt-1">
                <a
                  href={item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-sm ${linkQuiet}`}
                >
                  GitHub
                  <span className="sr-only"> ({c.externalLink})</span>
                  <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-8">
          <div className="grid grid-cols-3 gap-px border border-line bg-line">
            {item.figures.map((figure) => (
              <div key={figure.label.en} className="bg-canvas p-4 sm:p-5">
                <p className="font-mono text-xl nums sm:text-2xl">
                  <bdi dir="ltr">{figure.value}</bdi>
                </p>
                <p className="mt-1.5 text-[10px] leading-4 text-muted">
                  {figure.label[locale]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-10">
            {item.sections.map((section) => (
              <section key={section.heading.en}>
                <h2 className="border-b border-line pb-2 text-lg font-medium">
                  {section.heading[locale]}
                </h2>
                <p className="mt-3 max-w-[68ch] text-[15px] leading-8 text-ink/85">
                  {section.body[locale]}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-12">
            <h2
              className={`font-mono text-[10px] text-muted ${labelStyle(
                locale,
              )}`}
            >
              {c.caseNotes}
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {item.notes.map((note) => (
                <li
                  key={note.title.en}
                  className="rounded-xl border border-line bg-paper p-5 last:sm:col-span-2"
                >
                  <h3 className="text-sm font-medium">{note.title[locale]}</h3>
                  <p className="mt-2 text-xs leading-6 text-muted">
                    {note.body[locale]}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-ink pt-6">
        <p className={`font-mono text-[10px] text-muted ${labelStyle(locale)}`}>
          {c.caseNext}
        </p>
        <Link
          href={`/${locale}/work/${next.slug}`}
          className={`group mt-2 flex items-baseline justify-between gap-4 ${focusRing}`}
        >
          <span
            className={`text-2xl font-medium leading-snug transition-colors group-hover:text-accent sm:text-3xl ${displayTracking(
              locale,
            )}`}
          >
            {next.title[locale]}
          </span>
          <ArrowUpRightIcon className="h-5 w-5 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent rtl:-scale-x-100" />
        </Link>
      </div>
    </article>
  );
}
