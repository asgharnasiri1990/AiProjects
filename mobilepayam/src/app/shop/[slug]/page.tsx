import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/catalog";
import { ProductView } from "./product-view";

/**
 * Admin-created products live only in the browser store and get a `custom-`
 * slug, so the server cannot know them. Every other slug must be a real seed
 * product; anything else is a genuine 404 instead of a soft 200.
 */
const isKnownSlug = (slug: string) =>
  slug.startsWith("custom-") || PRODUCTS.some((item) => item.slug === slug);

export async function generateMetadata({
  params,
}: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((item) => item.slug === slug);

  if (!product && !slug.startsWith("custom-")) {
    return {
      title: "صفحه پیدا نشد",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: product?.name ?? "محصول",
    description: product?.description,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  if (!isKnownSlug(slug)) notFound();

  return <ProductView key={slug} slug={slug} />;
}
