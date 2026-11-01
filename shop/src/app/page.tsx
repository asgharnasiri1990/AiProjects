import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { loadCatalog } from "@/lib/catalog";
import { MasonryGrid } from "@/components/masonry-grid";
import { ProductCard } from "@/components/product-card";
import { CategoryNav } from "@/components/category-nav";
import { ErrorState } from "@/components/ui/states";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  // The root page sits in the same segment as the layout, so `template`
  // doesn't apply here — spell the brand out explicitly.
  title: { absolute: "Discover | DigitalShop" },
  description:
    "A visual feed of gadgets, books and gear. Save what you like and check out in a few taps.",
};

const FEED_SIZE = 12;

export default async function HomePage() {
  const result = await loadCatalog({ limit: FEED_SIZE, sort: "newest" });

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-6">
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Find something you&apos;ll love.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:text-base">
          Gadgets, books and gear — heart anything to save it, then check out in a few taps.
        </p>
      </section>

      {result.ok ? (
        <>
          <Suspense fallback={null}>
            <CategoryNav categories={result.categories.data} />
          </Suspense>

          <MasonryGrid className="mt-2">
            {result.products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </MasonryGrid>

          <div className="mt-10 flex justify-center">
            <Link href="/shop" className={buttonClasses("outline", "lg")}>
              Browse all products
            </Link>
          </div>
        </>
      ) : (
        <ErrorState message={result.message} />
      )}
    </div>
  );
}
