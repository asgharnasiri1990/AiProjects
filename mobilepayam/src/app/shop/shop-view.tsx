"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useCatalog } from "@/lib/store";
import { minPrice, totalStock } from "@/data/catalog";
import { faNum } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { container, card, input } from "@/lib/ui";

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

  const [minInput, setMinInput] = useState(minParam);
  const [maxInput, setMaxInput] = useState(maxParam);

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
            <b className="mb-2 block text-xs font-bold text-ink-strong">محدودهٔ قیمت</b>
            <div className="flex gap-1.5">
              <input
                value={minInput}
                onChange={(event) => setMinInput(event.target.value)}
                inputMode="numeric"
                placeholder="از"
                aria-label="حداقل قیمت"
                className={`${input} h-9 px-2 text-xs`}
              />
              <input
                value={maxInput}
                onChange={(event) => setMaxInput(event.target.value)}
                inputMode="numeric"
                placeholder="تا"
                aria-label="حداکثر قیمت"
                className={`${input} h-9 px-2 text-xs`}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const next = new URLSearchParams(params.toString());
                if (minInput) next.set("min", minInput);
                else next.delete("min");
                if (maxInput) next.set("max", maxInput);
                else next.delete("max");
                router.replace(`/shop?${next.toString()}`, { scroll: false });
              }}
              className="mt-2 h-8 w-full rounded-md border border-line-strong text-[11px] font-bold text-ink hover:border-brand hover:text-brand"
            >
              اعمال قیمت
            </button>
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
