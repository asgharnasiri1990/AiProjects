import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatsView, isRange } from "@/components/stats-view";
import { isLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stats",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

/**
 * Bookmarkable private stats screen: /[locale]/s/<STATS_PATH>.
 *
 * The slug lives in an env var — this repository is public, so a slug committed
 * to git would not be a secret. Nothing here is a page link: the route is not
 * in the nav, is not in the sitemap and is `noindex`.
 */
export default async function SecretStatsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/s/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const expected = process.env.STATS_PATH;
  if (!expected || slug !== expected) notFound();

  const query = await searchParams;
  const range = isRange(query.range) ? query.range : "all";

  return (
    <StatsView
      locale={locale}
      range={range}
      basePath={`/${locale}/s/${slug}`}
    />
  );
}
