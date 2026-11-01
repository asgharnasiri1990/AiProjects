import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/api";
import { formatToman } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = !product.inStock;

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg hover:shadow-zinc-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-700 dark:hover:shadow-black/40"
    >
      <div className="relative aspect-square overflow-hidden bg-white p-6">
        <Image
          src={imageUrl(product.image)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-zinc-100 p-4 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            {product.category.name}
          </span>
          {product.inStock && product.stock <= 5 && (
            <Badge variant="warning">Only {product.stock} left</Badge>
          )}
        </div>
        <h3 dir="auto" className="line-clamp-1 font-semibold text-zinc-900 dark:text-zinc-100">
          {product.name}
        </h3>
        <p dir="auto" className="line-clamp-2-rtl text-sm text-zinc-500 dark:text-zinc-400">
          {product.description}
        </p>
        <p className="mt-auto pt-2 text-lg font-bold text-zinc-900 dark:text-white">
          {formatToman(product.price)}
        </p>
      </div>
    </Link>
  );
}
