"use client";

import Link from "next/link";
import { useState } from "react";
import { useCatalog } from "@/lib/store";
import { addToCart } from "@/lib/cart";
import {
  defaultVariant,
  minPrice,
  totalStock,
  categoryById,
} from "@/data/catalog";
import { discountPercent, faNum } from "@/lib/format";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { QuantityStepper } from "@/components/quantity-stepper";
import { container, card, btnPrimary, btnGhost } from "@/lib/ui";

export function ProductView({ slug }: { slug: string }) {
  const { products } = useCatalog();
  const product = products.find((item) => item.slug === slug);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className={`${container} py-20 text-center`}>
        <p className="text-sm text-muted">
          این محصول پیدا نشد یا حذف شده است.
        </p>
        <Link href="/shop" className={`${btnPrimary} mt-4`}>
          بازگشت به فروشگاه
        </Link>
      </main>
    );
  }

  const storages = [
    ...new Set(
      product.variants.map((variant) => variant.storage).filter(Boolean),
    ),
  ] as string[];
  const colors = [
    ...new Set(product.variants.map((variant) => variant.color).filter(Boolean)),
  ] as string[];

  const fallback = defaultVariant(product);
  const variant =
    product.variants.find((item) => item.id === selectedVariantId) ?? fallback;

  // Pick a variant that actually exists (and is in stock) instead of leaving a
  // highlighted chip that does not match the variant being priced/added.
  const pickStorage = (storage: string) => {
    const next =
      product.variants.find(
        (item) =>
          item.storage === storage &&
          item.color === variant.color &&
          item.stock > 0,
      ) ??
      product.variants.find(
        (item) => item.storage === storage && item.stock > 0,
      ) ??
      product.variants.find((item) => item.storage === storage);

    if (next) {
      setSelectedVariantId(next.id);
      setQty(1);
    }
  };

  const pickColor = (color: string) => {
    const next =
      product.variants.find(
        (item) =>
          item.color === color &&
          item.storage === variant.storage &&
          item.stock > 0,
      ) ??
      product.variants.find((item) => item.color === color && item.stock > 0) ??
      product.variants.find((item) => item.color === color);

    if (next) {
      setSelectedVariantId(next.id);
      setQty(1);
    }
  };

  const price = variant.price;
  const stock = variant.stock;
  const oldPrice = product.oldPrice;
  const off = discountPercent(price, oldPrice);
  const qtyValue = Math.min(qty, Math.max(1, stock));
  const category = categoryById(product.categoryId);
  const related = products
    .filter(
      (item) =>
        item.categoryId === product.categoryId && item.id !== product.id,
    )
    .slice(0, 5);

  return (
    <main className={`${container} pb-10`}>
      <nav className="flex flex-wrap items-center gap-1.5 py-3 text-[11px] text-muted">
        <Link href="/" className="hover:text-brand">
          خانه
        </Link>
        <span>/</span>
        <Link href={`/shop?cat=${product.categoryId}`} className="hover:text-brand">
          {category?.name ?? "فروشگاه"}
        </Link>
        <span>/</span>
        <b className="font-medium text-ink">{product.name}</b>
      </nav>

      <div className={`${card} grid gap-6 p-4 lg:grid-cols-[380px_minmax(0,1fr)] lg:p-5`}>
        <div>
          <div className="relative grid aspect-square place-items-center overflow-hidden rounded-lg border border-line bg-surface p-4">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <ProductArt
                icon={product.icon}
                className="h-[62%] w-auto text-[#3f4064]"
              />
            )}
            {off > 0 ? (
              <span className="absolute right-3 top-3 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                ٪{faNum(off)} تخفیف
              </span>
            ) : null}
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className={`grid aspect-square place-items-center rounded-lg border bg-surface ${
                  index === 0 ? "border-brand" : "border-line"
                }`}
              >
                <ProductArt
                  icon={product.icon}
                  className="h-1/2 w-auto text-[#6b6d8f]"
                />
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold text-brand">
            {product.brand} · {category?.name}
          </span>
          <h1 className="mt-1 text-xl font-extrabold leading-8 text-ink-strong md:text-2xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <span className="text-star">★★★★★</span>
            <b className="text-ink">{faNum(product.rating)}</b>
            <span className="text-muted">({faNum(product.reviews)} نظر)</span>
            <span className="text-line-strong">·</span>
            <span className={stock > 0 ? "text-success" : "text-brand"}>
              {stock > 0 ? "موجود در انبار" : "ناموجود"}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline gap-2 rounded-lg bg-[linear-gradient(115deg,#f3efff,#fff5fa)] px-4 py-3">
            {oldPrice ? (
              <s className="text-xs text-muted">{faNum(oldPrice)}</s>
            ) : null}
            <b className="text-2xl font-extrabold text-ink-strong">
              {faNum(price)}
            </b>
            <span className="text-[11px] text-muted">تومان</span>
            {off > 0 ? (
              <span className="mr-auto rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                ٪{faNum(off)}
              </span>
            ) : null}
          </div>

          <p className="mt-3 max-w-[60ch] text-[12.5px] leading-6 text-[#5b5d7e]">
            {product.description}
          </p>

          {storages.length > 0 ? (
            <div className="mt-4 border-t border-line pt-3">
              <b className="mb-2 block text-xs font-bold text-ink-strong">حافظه</b>
              <div className="flex flex-wrap gap-2">
                {storages.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => pickStorage(item)}
                    aria-pressed={variant.storage === item}
                    className={`h-8 rounded-lg border px-3 text-[11px] ${
                      variant.storage === item
                        ? "border-brand bg-brand-soft font-bold text-brand"
                        : "border-line-strong text-ink"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {colors.length > 0 ? (
            <div className="mt-3 border-t border-line pt-3">
              <b className="mb-2 block text-xs font-bold text-ink-strong">رنگ</b>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const swatch = product.variants.find(
                    (item) => item.color === color,
                  );
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => pickColor(color)}
                      aria-pressed={variant.color === color}
                      className={`flex h-8 items-center gap-1.5 rounded-full border px-2 text-[11px] ${
                        variant.color === color
                          ? "border-brand text-brand"
                          : "border-line-strong text-ink"
                      }`}
                    >
                      <i
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ background: swatch?.colorHex ?? "#ddd" }}
                      />
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
            <QuantityStepper
              qty={qtyValue}
              max={stock}
              onChange={(next) => setQty(Math.max(1, next))}
            />
            <button
              type="button"
              disabled={stock === 0}
              onClick={() => {
                addToCart(product.id, variant.id, qtyValue);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1600);
              }}
              className={`${btnPrimary} flex-1`}
            >
              {stock === 0
                ? "ناموجود"
                : added
                  ? "✓ به سبد اضافه شد"
                  : "افزودن به سبد خرید"}
            </button>
            <Link href="/cart" className={`${btnGhost} px-4`}>
              سبد
            </Link>
          </div>

          <ul className="mt-4 grid gap-1.5 text-[11px] text-[#5b5d7e]">
            <li>✓ گارانتی ۱۸ ماههٔ رسمی</li>
            <li>✓ ارسال رایگان بالای ۵ میلیون تومان</li>
            <li>✓ بازگشت ۷ روزه</li>
          </ul>
        </div>
      </div>

      <div className={`${card} mt-3 px-4 py-4`}>
        <h2 className="mb-3 text-sm font-extrabold text-ink-strong">مشخصات فنی</h2>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {product.specs.map((spec, index) => (
              <tr key={spec.label} className={index % 2 === 0 ? "bg-canvas/60" : ""}>
                <th className="w-40 px-3 py-2.5 text-right font-semibold text-muted">
                  {spec.label}
                </th>
                <td className="px-3 py-2.5 text-ink-strong">{spec.value}</td>
              </tr>
            ))}
            <tr className="bg-canvas/60">
              <th className="w-40 px-3 py-2.5 text-right font-semibold text-muted">
                موجودی کل
              </th>
              <td className="px-3 py-2.5 text-ink-strong">
                {faNum(totalStock(product))} عدد
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {related.length > 0 ? (
        <section className={`${card} mt-3 px-4 py-4`}>
          <h2 className="mb-3 text-sm font-extrabold text-ink-strong">
            محصولات مرتبط
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-4 text-[10.5px] text-muted">
        قیمت پایهٔ این محصول {faNum(minPrice(product))} تومان است.
      </p>
    </main>
  );
}
