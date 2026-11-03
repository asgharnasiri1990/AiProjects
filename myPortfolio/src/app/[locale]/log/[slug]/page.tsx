import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { getPost, posts } from "@/content/posts";
import { isLocale, t } from "@/lib/i18n";
import { displayTracking, eyebrowStyle, focusRing } from "@/lib/styles";
import { ArrowRightIcon } from "@/components/icons";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/log/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const post = getPost(slug);
  if (!post) return {};

  const title = t(post.title, locale);
  const description = t(post.summary, locale);

  return {
    title,
    description,
    alternates: {
      languages: {
        fa: `/fa/log/${post.slug}`,
        en: `/en/log/${post.slug}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.date,
      tags: post.tags,
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
  };
}

export default async function PostPage({
  params,
}: PageProps<"/[locale]/log/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = getPost(slug);
  if (!post) notFound();

  const c = copy[locale];
  const position = posts.findIndex((item) => item.slug === post.slug);
  const next = posts.length > 1 ? posts[(position + 1) % posts.length] : undefined;

  return (
    <article className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10">
      <Link
        href={`/${locale}/log`}
        className={`inline-flex items-center gap-2 rounded text-sm text-ink-soft transition-colors hover:text-ink ${focusRing}`}
      >
        <ArrowRightIcon className="rotate-180 rtl:rotate-0" />
        {c.logBack}
      </Link>

      <header className="mt-8 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
          <time dateTime={post.date}>{post.displayDate[locale]}</time>
          <span aria-hidden className="h-px w-3 bg-line" />
          <span>
            {post.readingTime} {c.readingTime}
          </span>
        </div>
        <h1
          className={`mt-4 text-display font-semibold leading-tight text-balance ${displayTracking(locale)}`}
        >
          {t(post.title, locale)}
        </h1>
        <p className="mt-4 text-lg leading-9 text-ink-soft text-pretty">
          {t(post.summary, locale)}
        </p>
      </header>

      <div className="mt-10 max-w-2xl">
        {post.blocks.map((block, index) => {
          if (block.kind === "h2") {
            return (
              <h2
                key={index}
                className={`mt-10 text-lg font-medium ${displayTracking(locale)}`}
              >
                {t(block.text, locale)}
              </h2>
            );
          }

          if (block.kind === "quote") {
            return (
              <blockquote
                key={index}
                className="my-9 border-s-2 border-accent ps-5 text-lg leading-9 text-ink"
              >
                {t(block.text, locale)}
              </blockquote>
            );
          }

          return (
            <p
              key={index}
              className="mt-5 text-base leading-9 text-ink-soft text-pretty"
            >
              {t(block.text, locale)}
            </p>
          );
        })}

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {next && next.slug !== post.slug ? (
        <nav aria-label={c.nextEntry} className="mt-16">
          <Link
            href={`/${locale}/log/${next.slug}`}
            className={`group flex items-center justify-between gap-6 rounded-2xl border-t border-line pt-8 ${focusRing}`}
          >
            <span>
              <span
                className={`block text-xs font-medium text-ink-soft ${eyebrowStyle(locale)}`}
              >
                {c.nextEntry}
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
