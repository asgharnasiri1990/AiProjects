import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { getProject, projects } from "@/content/projects";
import { isLocale, t } from "@/lib/i18n";
import { displayTracking, eyebrowStyle } from "@/lib/styles";
import { ArrowRightIcon } from "@/components/icons";
import { ProjectArt } from "@/components/project-art";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const project = getProject(slug);
  if (!project) return {};

  const title = t(project.title, locale);
  const description = t(project.tagline, locale);

  return {
    title,
    description,
    alternates: {
      languages: {
        fa: `/fa/work/${project.slug}`,
        en: `/en/work/${project.slug}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = getProject(slug);
  if (!project) notFound();

  const c = copy[locale];
  const position = projects.findIndex((item) => item.slug === project.slug);
  const next =
    projects.length > 1 ? projects[(position + 1) % projects.length] : undefined;

  return (
    <article className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10">
      <Link
        href={`/${locale}#work`}
        className="inline-flex items-center gap-2 rounded text-sm text-ink-soft transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <ArrowRightIcon className="rotate-180 rtl:rotate-0" />
        {c.backToWork}
      </Link>

      <header className="mt-8 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft"
            >
              {item}
            </span>
          ))}
        </div>
        <h1
          className={`mt-5 text-display font-semibold leading-tight text-balance ${displayTracking(locale)}`}
        >
          {t(project.title, locale)}
        </h1>
        <p className="mt-4 text-lg leading-9 text-ink-soft text-pretty">
          {t(project.tagline, locale)}
        </p>
      </header>

      <ProjectArt
        index={project.index}
        src={project.cover}
        showIndex={false}
        priority
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="mt-10 aspect-[16/9] sm:aspect-[21/9]"
      />

      <dl className="mt-10 grid gap-6 border-y border-line py-6 sm:grid-cols-3">
        <div>
          <dt
            className={`text-xs font-medium text-ink-soft ${eyebrowStyle(locale)}`}
          >
            {c.projectRole}
          </dt>
          <dd className="mt-1 text-sm">{t(project.role, locale)}</dd>
        </div>
        <div>
          <dt
            className={`text-xs font-medium text-ink-soft ${eyebrowStyle(locale)}`}
          >
            {c.projectYear}
          </dt>
          <dd className="mt-1 text-sm">{project.year}</dd>
        </div>
        <div>
          <dt
            className={`text-xs font-medium text-ink-soft ${eyebrowStyle(locale)}`}
          >
            {c.projectStack}
          </dt>
          <dd className="mt-1 text-sm">{project.stack.join(" · ")}</dd>
        </div>
      </dl>

      <div className="mt-14 grid gap-12 md:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)]">
        <aside className="md:sticky md:top-24 md:self-start">
          <h2
            className={`text-xs font-medium text-accent ${eyebrowStyle(locale)}`}
          >
            {c.projectHighlights}
          </h2>
          <ul className="mt-4 space-y-3">
            {project.highlights.map((highlight) => (
              <li
                key={highlight.en}
                className="flex gap-3 text-sm leading-7 text-ink-soft"
              >
                <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-accent" />
                {t(highlight, locale)}
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-12">
          {project.sections.map((section) => (
            <section key={section.heading.en}>
              <h2 className="text-sm font-semibold text-accent">
                {t(section.heading, locale)}
              </h2>
              <p className="mt-3 text-base leading-8 text-ink-soft text-pretty">
                {t(section.body, locale)}
              </p>
            </section>
          ))}

          <div className="rounded-2xl border border-line p-6">
            <h2
              className={`text-xs font-medium text-accent ${eyebrowStyle(locale)}`}
            >
              {c.projectTradeoff}
            </h2>
            <p className="mt-2 text-sm leading-7 text-ink-soft text-pretty">
              {t(project.tradeoff, locale)}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16 rounded-2xl border border-line bg-wash px-6 py-10 sm:px-10">
        <h2
          className={`text-xs font-medium text-accent ${eyebrowStyle(locale)}`}
        >
          {c.projectResults}
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label.en} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-ink-soft">
                {t(metric.label, locale)}
              </dt>
              <dd
                className={`text-3xl font-semibold ${displayTracking(locale)}`}
              >
                <span dir="ltr">{metric.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {next && next.slug !== project.slug ? (
        <nav aria-label={c.nextProject} className="mt-16">
          <Link
            href={`/${locale}/work/${next.slug}`}
            className="group flex items-center justify-between gap-6 rounded-2xl border-t border-line pt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <span>
              <span
                className={`block text-xs font-medium text-ink-soft ${eyebrowStyle(locale)}`}
              >
                {c.nextProject}
              </span>
              <span className="mt-2 block text-xl font-medium">
                {t(next.title, locale)}
              </span>
            </span>
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-canvas"
            >
              <ArrowRightIcon className="rtl:-scale-x-100" />
            </span>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
