import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/api";
import { feedAspectRatio } from "@/lib/aspect";
import { formatToman } from "@/lib/format";
import type { Product } from "@/lib/types";
import { FavoriteButton } from "@/components/favorite-button";

/**
 * Pinterest-style pin: image-first, variable height, name + price only.
 *
 * The favourite heart is a sibling of the link, not a child — interactive
 * elements can't legally nest inside an anchor, and this way clicking the heart
 * can never navigate to the product.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_36px_-18px_rgba(0,0,0,0.28)] motion-reduce:transform-none motion-reduce:transition-none dark:bg-zinc-900 dark:shadow-black/20">
      <Link
        href={`/shop/${product.id}`}
        className="block overflow-hidden rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <div
          className="relative overflow-hidden bg-white"
          style={{ aspectRatio: feedAspectRatio(product.slug) }}
        >
          <Image
            src={imageUrl(product.image)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none ${
              product.inStock ? "" : "opacity-60"
            }`}
          />
          {!product.inStock && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-900 shadow-sm backdrop-blur dark:bg-zinc-900/90 dark:text-zinc-100">
              Out of stock
            </span>
          )}
        </div>

        <div className="px-3 pb-3.5 pt-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {product.category.name}
          </p>
          <h3
            dir="auto"
            className="mt-0.5 line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            {product.name}
          </h3>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-zinc-900 dark:text-white">
            {formatToman(product.price)}
          </p>
        </div>
      </Link>

      <FavoriteButton product={product} className="absolute right-3 top-3" />
    </article>
  );
}
