import type { Metadata } from "next";
import { USED_LISTINGS } from "@/data/used";
import { UsedDetailView } from "./used-detail-view";

export async function generateMetadata({
  params,
}: PageProps<"/used/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const listing = USED_LISTINGS.find((item) => item.slug === slug);
  return {
    title: listing?.title ?? "گوشی کارکرده",
    description: listing?.description,
  };
}

export default async function UsedDetailPage({
  params,
}: PageProps<"/used/[slug]">) {
  const { slug } = await params;
  return <UsedDetailView slug={slug} />;
}
