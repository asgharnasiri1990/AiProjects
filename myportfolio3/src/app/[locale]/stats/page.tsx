import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { StatsView, isRange } from "@/components/stats-view";
import { isLocale } from "@/lib/i18n";
import { STATS_COOKIE } from "@/lib/stats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stats",
  robots: { index: false, follow: false },
};

/** The cookie is written by /[locale]/stats/unlock, never by this page. */
export default async function StatsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/stats">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const token = process.env.STATS_TOKEN;
  const auth = (await cookies()).get(STATS_COOKIE)?.value;
  if (!token || auth !== token) notFound();

  const query = await searchParams;
  const range = isRange(query.range) ? query.range : "all";

  return (
    <StatsView locale={locale} range={range} basePath={`/${locale}/stats`} />
  );
}
