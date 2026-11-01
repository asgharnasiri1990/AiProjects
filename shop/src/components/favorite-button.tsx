"use client";

import { HeartIcon } from "@/components/icons";
import { useFavorites } from "@/context/favorites-context";
import type { Product } from "@/lib/types";

/**
 * Heart toggle. Rendered as a sibling of the card's link (never inside it) so
 * the markup stays valid and clicking the heart can't navigate.
 */
export function FavoriteButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const saved = has(product.id);

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
      title={saved ? "Remove from saved" : "Save"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition-[color,opacity,transform] duration-200 hover:scale-105 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:bg-zinc-900/90 ${
        saved
          ? "text-accent-600 dark:text-accent-500"
          : "text-zinc-600 dark:text-zinc-300"
      } ${className}`}
    >
      <HeartIcon width={17} height={17} className={saved ? "fill-accent-500" : ""} />
    </button>
  );
}
