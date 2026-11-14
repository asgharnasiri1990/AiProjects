"use client";

import Link from "next/link";
import { useState } from "react";
import { cheapestAvailableVariant, totalStock } from "@/data/catalog";
import { discountPercent, faNum } from "@/lib/format";
import { addToCart } from "@/lib/cart";
import { productImage } from "@/data/images";
import type { Product } from "@/lib/types";
import { ProductArt } from "@/components/product-art";

export function ProductCard({ product }: { product: Product }) {
  const variant = cheapestAvailableVariant(product);
  const price = variant.price;
  const off = discountPercent(price, product.oldPrice);
  const stock = totalStock(product);
  const image = productImage(product.slug, product.image);
  const [added, setAdded] = useState(false);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-[0_10px_24px_-18px_rgba(35,36,63,0.45)]">
      <Link href={`/shop/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative grid aspect-square place-items-center overflow-hidden bg-surface p-3">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <ProductArt
              icon={product.icon}
              className="h-[62%] w-auto text-[#4a4c6d] transition-transform duration-300 group-hover:scale-[1.04]"
            />
          )}
          {off > 0 ? (
            <span className="absolute right-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
              ٪{faNum(off)}
            </span>
          ) : product.badge ? (
            <span className="absolute right-2 top-2 rounded-full bg-canvas px-2 py-0.5 text-[10px] font-bold text-ink">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1 px-3 pb-2 pt-1.5">
          <span className="text-[10px] text-muted">
            {product.brand} · {product.name.includes("ایرپاد") ? "هدفون" : ""}
          </span>
          <h3 className="min-h-11 text-[13px] font-medium leading-7 text-ink-strong">
            {product.name}
          </h3>
          <div className="mt-auto flex flex-col gap-0.5">
            {product.oldPrice ? (
              <s className="text-[11px] text-muted">
                {faNum(product.oldPrice)}
              </s>
            ) : null}
            <p className="flex items-baseline gap-1">
              <b className="text-[15px] font-extrabold text-ink-strong">
                {faNum(price)}
              </b>
              <span className="text-[10px] text-muted">تومان</span>
            </p>
          </div>
          <div className="flex items-center gap-1 pb-1 text-[10.5px] text-muted">
            <span className="text-star">★</span>
            <b className="font-bold text-ink">{faNum(product.rating)}</b>
            <span>({faNum(product.reviews)})</span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        disabled={stock === 0}
        onClick={() => {
          addToCart(product.id, variant.id, 1);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1400);
        }}
        className="h-10 border-t border-line text-xs font-bold text-brand transition-colors hover:bg-brand-soft disabled:text-muted"
      >
        {stock === 0 ? "ناموجود" : added ? "✓ به سبد اضافه شد" : "افزودن به سبد"}
      </button>
    </article>
  );
}
