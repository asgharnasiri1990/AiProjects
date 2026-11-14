import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatsView, isRange } from "@/components/stats-view";
import { isLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stats",
  // Public and linked from the footer, but kept out of search results: the
  // numbers are a live snapshot and a cached snippet would always be stale.
  robots: { index: false, follow: true },
};

export default async function StatsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/stats">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  const range = isRange(query.range) ? query.range : "all";

  return (
    <StatsView locale={locale} range={range} basePath={`/${locale}/stats`} />
  );
}
