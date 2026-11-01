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
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400"
        >
          <ChevronLeftIcon width={16} height={16} />
          Back to shop
        </Link>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800">
          <div className="relative aspect-square">
            <Image
              src={imageUrl(product.image)}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
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
            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            {formatToman(product.price)}
          </p>

          <div className="border-y border-zinc-200 py-5 dark:border-zinc-800">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Description
            </h2>
            <p dir="auto" className="leading-7 text-zinc-600 dark:text-zinc-300">
              {product.description}
            </p>
          </div>

          <AddToCartPanel product={product} maxQuantity={maxQuantity} />
        </div>
      </div>
    </div>
  );
}
