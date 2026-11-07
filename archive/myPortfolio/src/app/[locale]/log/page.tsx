import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { posts } from "@/content/posts";
import { isLocale, t } from "@/lib/i18n";
import { displayTracking, eyebrowStyle, focusRing } from "@/lib/styles";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/log">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const c = copy[locale];

  return {
    title: c.logTitle,
    description: c.logLead,
    alternates: {
      languages: { fa: "/fa/log", en: "/en/log" },
    },
  };
}

export default async function LogPage({ params }: PageProps<"/[locale]/log">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = copy[locale];

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <p
        className={`flex items-center gap-3 text-xs font-medium text-accent ${eyebrowStyle(locale)}`}
      >
        <span aria-hidden className="h-px w-6 bg-accent/40" />
        {c.logEyebrow}
      </p>
      <h1
        className={`mt-4 text-display font-semibold leading-tight text-balance ${displayTracking(locale)}`}
      >
        {c.logTitle}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-8 text-ink-soft text-pretty">
        {c.logLead}
      </p>

      <ul className="mt-12 divide-y divide-line border-t border-line">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${locale}/log/${post.slug}`}
              className={`group block rounded py-8 ${focusRing}`}
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                <time dateTime={post.date}>{post.displayDate[locale]}</time>
                <span aria-hidden className="h-px w-3 bg-line" />
                <span>
                  {post.readingTime} {c.readingTime}
                </span>
              </div>
              <h2
                className={`mt-2 text-xl font-medium transition-colors group-hover:text-accent ${displayTracking(locale)}`}
              >
                {t(post.title, locale)}
              </h2>
              <p className="mt-2 text-sm leading-7 text-ink-soft text-pretty">
                {t(post.summary, locale)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-ink-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
