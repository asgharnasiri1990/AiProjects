"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/icons";
import { MasonryGrid } from "@/components/masonry-grid";
import { ProductCard } from "@/components/product-card";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { useFavorites } from "@/context/favorites-context";

export function FavoritesView() {
  const { items, clear } = useFavorites();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Saved
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {items.length === 0
              ? "Tap the heart on any product to keep it here."
              : `${items.length} item${items.length === 1 ? "" : "s"} saved on this device.`}
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="rounded-full px-3 py-2 text-sm font-medium text-accent-600 transition-colors hover:bg-accent-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-accent-500 dark:hover:bg-accent-500/10"
          >
            Clear all
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={<HeartIcon width={26} height={26} />}
          title="Nothing saved yet"
          description="Browse the feed and tap the heart on anything you like — it stays on this device."
          action={
            <Link href="/shop" className={buttonClasses("primary", "md")}>
              Browse the shop
            </Link>
          }
        />
      ) : (
        <MasonryGrid>
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </MasonryGrid>
      )}
    </div>
  );
}
