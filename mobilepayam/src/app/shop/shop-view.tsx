"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useCatalog } from "@/lib/store";
import { minPrice, totalStock } from "@/data/catalog";
import { faNum } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { PriceKnob } from "@/components/price-knob";
import { container, card } from "@/lib/ui";

type Bucket = { id: string; label: string; min: number; max: number };

const BUCKETS: Bucket[] = [
  { id: "all", label: "همه", min: 0, max: 0 },
  { id: "u1", label: "زیر ۱ میلیون", min: 0, max: 1_000_000 },
  { id: "1-5", label: "۱ تا ۵ میلیون", min: 1_000_000, max: 5_000_000 },
  { id: "5-20", label: "۵ تا ۲۰ میلیون", min: 5_000_000, max: 20_000_000 },
  { id: "20-50", label: "۲۰ تا ۵۰ میلیون", min: 20_000_000, max: 50_000_000 },
  { id: "50+", label: "بالای ۵۰ میلیون", min: 50_000_000, max: 0 },
];

const SORTS = [
  { id: "featured", label: "پرفروش‌ترین" },
  { id: "cheapest", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
  { id: "newest", label: "جدیدترین" },
  { id: "rating", label: "بیشترین امتیاز" },
];

export function ShopView() {
  const { products, categories } = useCatalog();
  const params = useSearchParams();
  const router = useRouter();

  const q = params.get("q") ?? "";
  const cat = params.get("cat") ?? "";
  const brand = params.get("brand") ?? "";
  const sort = params.get("sort") ?? "featured";
  const availableOnly = params.get("available") === "1";
  const minParam = params.get("min") ?? "";
  const maxParam = params.get("max") ?? "";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/shop?${next.toString()}`, { scroll: false });
  };

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))].sort(),
    [products],
  );

  const priceBounds = useMemo(() => {
    const values = products.map(minPrice);
    return {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 1,
    };
  }, [products]);

  const currentMin = Number(minParam) || 0;
  const currentMax = Number(maxParam) || 0;

  const bucketActive = (bucket: Bucket) =>
    bucket.min === 0 && bucket.max === 0
      ? currentMin === 0 && currentMax === 0
      : currentMin === bucket.min && currentMax === bucket.max;

  const applyBucket = (bucket: Bucket) => {
    const next = new URLSearchParams(params.toString());
    if (bucket.min) next.set("min", String(bucket.min));
    else next.delete("min");
    if (bucket.max) next.set("max", String(bucket.max));
    else next.delete("max");
    router.replace(`/shop?${next.toString()}`, { scroll: false });
  };

  const commitMax = (value: number) => {
    const next = new URLSearchParams(params.toString());
    if (value >= priceBounds.max) next.delete("max");
    else next.set("max", String(value));
    const minValue = Number(next.get("min") || 0);
    if (minValue && value <= minValue) next.delete("min");
    router.replace(`/shop?${next.toString()}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    const min = Number(minParam) || 0;
    const max = Number(maxParam) || 0;
    const needle = q.trim().toLowerCase();

    const list = products.filter((product) => {
      if (needle) {
        const haystack = `${product.name} ${product.brand}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (cat && product.categoryId !== cat) return false;
      if (brand && product.brand !== brand) return false;
      if (availableOnly && totalStock(product) === 0) return false;
      const price = minPrice(product);
      if (min && price < min) return false;
      if (max && price > max) return false;
      return true;
    });

    switch (sort) {
      case "cheapest":
        return list.sort((a, b) => minPrice(a) - minPrice(b));
      case "expensive":
        return list.sort((a, b) => minPrice(b) - minPrice(a));
      case "newest":
        return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list.sort((a, b) => b.reviews - a.reviews);
    }
  }, [products, q, cat, brand, availableOnly, minParam, maxParam, sort]);

  const hasFilters = Boolean(
    q || cat || brand || availableOnly || minParam || maxParam,
  );

  return (
    <main className={`${container} pb-10`}>
      <div className="flex flex-wrap items-center gap-2 py-4">
        <h1 className="text-lg font-extrabold text-ink-strong">همهٔ محصولات</h1>
        <span className="text-[11px] text-muted">
          {faNum(filtered.length)} کالا از {faNum(products.length)}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-[232px_minmax(0,1fr)]">
        <aside className={`${card} h-fit p-4 md:sticky md:top-[132px]`}>
          <div className="flex items-center justify-between border-b border-line pb-2">
            <b className="text-sm font-extrabold text-ink-strong">فیلترها</b>
            {hasFilters ? (
              <Link href="/shop" className="text-[11px] text-brand">
                پاک کردن
              </Link>
            ) : null}
          </div>

          <div className="border-b border-line py-3">
            <b className="mb-2 block text-xs font-bold text-ink-strong">دسته‌بندی</b>
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setParam("cat", "")}
                className={`rounded-md px-2 py-1.5 text-right text-xs ${
                  !cat ? "bg-brand-soft font-bold text-brand" : "text-ink hover:bg-canvas"
                }`}
              >
                همهٔ دسته‌ها
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setParam("cat", category.id)}
                  className={`rounded-md px-2 py-1.5 text-right text-xs ${
                    cat === category.id
                      ? "bg-brand-soft font-bold text-brand"
                      : "text-ink hover:bg-canvas"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-line py-3">
            <b className="mb-2 block text-xs font-bold text-ink-strong">برند</b>
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setParam("brand", "")}
                className={`rounded-md px-2 py-1.5 text-right text-xs ${
                  !brand ? "bg-brand-soft font-bold text-brand" : "text-ink hover:bg-canvas"
                }`}
              >
                همهٔ برندها
              </button>
              {brands.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setParam("brand", item)}
                  className={`rounded-md px-2 py-1.5 text-right text-xs ${
                    brand === item
                      ? "bg-brand-soft font-bold text-brand"
                      : "text-ink hover:bg-canvas"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-line py-3">
            <b className="mb-1 block text-xs font-bold text-ink-strong">محدودهٔ قیمت</b>
            <p className="mb-2 text-[10px] text-muted">
              بچرخانید یا یکی از بازه‌ها را انتخاب کنید
            </p>
            <PriceKnob
              min={priceBounds.min}
              max={priceBounds.max}
              value={currentMax || priceBounds.max}
              snaps={[1_000_000, 5_000_000, 20_000_000, 50_000_000, 100_000_000]}
              onCommit={commitMax}
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {BUCKETS.map((bucket) => (
                <button
                  key={bucket.id}
                  type="button"
                  onClick={() => applyBucket(bucket)}
                  className={`rounded-full border px-2.5 py-1.5 text-[10.5px] font-bold transition-colors ${
                    bucketActive(bucket)
                      ? "border-brand bg-brand text-white"
                      : "border-line text-ink hover:border-brand hover:text-brand"
                  }`}
                >
                  {bucket.label}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-center text-[10.5px] font-bold text-ink">
              {faNum(filtered.length)} محصول در این بازه
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-2 pt-3 text-xs text-ink">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setParam("available", event.target.checked ? "1" : "")}
              className="h-4 w-4 accent-brand"
            />
            فقط کالاهای موجود
          </label>
        </aside>

        <div className={`${card} p-3 sm:p-4`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <span className="text-[11px] text-muted">
              {faNum(filtered.length)} محصول
            </span>
            <label className="flex items-center gap-2 text-[11px] text-muted">
              مرتب‌سازی:
              <select
                value={sort}
                onChange={(event) => setParam("sort", event.target.value)}
                className="h-8 rounded-md border border-line-strong bg-surface px-2 text-[11px] text-ink outline-none focus:border-brand"
              >
                {SORTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted">
              محصولی با این فیلترها پیدا نشد.
              <Link href="/shop" className="mr-2 text-brand">
                پاک کردن فیلترها
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
