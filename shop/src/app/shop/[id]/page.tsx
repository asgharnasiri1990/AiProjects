import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ApiError, getProduct, imageUrl, MAX_ITEM_QUANTITY } from "@/lib/api";
import { formatToman } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { FavoriteButton } from "@/components/favorite-button";
import { ChevronLeftIcon } from "@/components/icons";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * generateMetadata() and the page body both need the product; memoizing
 * per request keeps that to one API call.
 */
const getProductOnce = cache((id: number) => getProduct(id));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();
  try {
    const product = await getProductOnce(numericId);
    return { title: product.name, description: product.description };
  } catch (error) {
    // Missing product -> the not-found UI. Because this route ships a
    // loading.tsx, streaming has already started by the time this resolves,
    // so the response keeps its 200 status (Next adds a noindex tag). A real
    // 404 would mean dropping the loading skeleton — not worth it here.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  let product: Product;
  try {
    product = await getProductOnce(numericId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const maxQuantity = Math.min(product.stock, MAX_ITEM_QUANTITY);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 rounded-full py-1 text-sm font-medium text-zinc-500 transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-zinc-400 dark:hover:text-primary-300"
        >
          <ChevronLeftIcon width={16} height={16} />
          Back to shop
        </Link>
      </nav>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        {/* Image */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-zinc-900">
          <div className="relative aspect-square">
            <Image
              src={imageUrl(product.image)}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain p-6 sm:p-10"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{product.category.name}</Badge>
            {product.inStock ? (
              product.stock <= 5 ? (
                <Badge variant="warning">Low stock · {product.stock} left</Badge>
              ) : (
                <Badge variant="success">In stock · {product.stock} available</Badge>
              )
            ) : (
              <Badge variant="danger">Out of stock</Badge>
            )}
          </div>

          <h1
            dir="auto"
            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl"
          >
            {product.name}
          </h1>

          <p className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
            {formatToman(product.price)}
          </p>

          <div className="rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-zinc-900 sm:p-6">
            <AddToCartPanel product={product} maxQuantity={maxQuantity} />
            <FavoriteButton
              product={product}
              showLabel
              className="mt-3 w-full hover:text-accent-600"
            />
          </div>

          <section className="border-t border-primary-200/70 pt-6 dark:border-zinc-800">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Description
            </h2>
            <p dir="auto" className="mt-2 leading-7 text-zinc-600 dark:text-zinc-300">
              {product.description}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
