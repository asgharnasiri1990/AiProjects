import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { USED_LISTINGS } from "@/data/used";
import { UsedDetailView } from "./used-detail-view";

/**
 * Admin-created listings only exist in localStorage and get a `used-` slug, so
 * the server cannot know them. Every other slug must be in the seed; anything
 * else is a real 404 instead of an indexable soft 200.
 */
const isKnownSlug = (slug: string) =>
  slug.startsWith("used-") || USED_LISTINGS.some((item) => item.slug === slug);

export async function generateMetadata({
  params,
}: PageProps<"/used/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const listing = USED_LISTINGS.find((item) => item.slug === slug);

  if (!listing && !slug.startsWith("used-")) {
    return {
      title: "صفحه پیدا نشد",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: listing?.title ?? "گوشی کارکرده",
    description: listing?.description,
  };
}

export default async function UsedDetailPage({
  params,
}: PageProps<"/used/[slug]">) {
  const { slug } = await params;
  if (!isKnownSlug(slug)) notFound();

  return <UsedDetailView key={slug} slug={slug} />;
}
