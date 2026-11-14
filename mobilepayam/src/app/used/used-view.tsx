"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useUsedListings } from "@/lib/store";
import { USED_CONDITION_LABEL } from "@/data/used";
import { faNum } from "@/lib/format";
import type { UsedCondition } from "@/lib/types";
import { UsedCard } from "@/components/used-card";
import { container, card } from "@/lib/ui";

const SORTS = [
  { id: "newest", label: "جدیدترین" },
  { id: "cheapest", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
  { id: "battery", label: "سلامت باتری" },
];

export function UsedView() {
  const listings = useUsedListings();
  const params = useSearchParams();
  const router = useRouter();

  const brand = params.get("brand") ?? "";
  const condition = params.get("cond") ?? "";
  const sort = params.get("sort") ?? "newest";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/used?${next.toString()}`, { scroll: false });
  };

  const brands = useMemo(
    () => [...new Set(listings.map((item) => item.brand))].sort(),
    [listings],
  );

  const filtered = useMemo(() => {
    const list = listings.filter((item) => {
      if (brand && item.brand !== brand) return false;
      if (condition && item.condition !== condition) return false;
      return true;
    });

    switch (sort) {
      case "cheapest":
        return [...list].sort((a, b) => a.price - b.price);
      case "expensive":
        return [...list].sort((a, b) => b.price - a.price);
      case "battery":
        return [...list].sort(
          (a, b) => (b.batteryHealth ?? 0) - (a.batteryHealth ?? 0),
        );
      default:
        return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }, [listings, brand, condition, sort]);

  return (
    <main className={`${container} pb-10`}>
      <section className={`${card} mt-4 px-5 py-6`}>
        <span className="text-[11px] font-bold text-brand">کارکرده، اما کارشناسی‌شده</span>
        <h1 className="mt-1 text-xl font-black text-ink-strong sm:text-2xl">
          گوشی‌های کارکرده
        </h1>
        <p className="mt-2 max-w-[62ch] text-[12px] leading-6 text-[#5b5d7e]">
          هر دستگاه پیش از فروش از نظر باتری، صفحه‌نمایش و سلامت سخت‌افزار بررسی
          می‌شود. سلامت باتری و وضعیت بدنه در هر آگهی مشخص است و امکان بازگشت
          ۷ روزه وجود دارد.
        </p>
      </section>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setParam("brand", "")}
          className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${
            !brand ? "border-brand bg-brand-soft text-brand" : "border-line-strong text-ink"
          }`}
        >
          همهٔ برندها
        </button>
        {brands.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setParam("brand", item)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${
              brand === item
                ? "border-brand bg-brand-soft text-brand"
                : "border-line-strong text-ink"
            }`}
          >
            {item}
          </button>
        ))}

        <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

        <select
          value={condition}
          onChange={(event) => setParam("cond", event.target.value)}
          className="h-8 rounded-lg border border-line-strong bg-surface px-2 text-[11px] text-ink outline-none focus:border-brand"
        >
          <option value="">همهٔ وضعیت‌ها</option>
          {(Object.keys(USED_CONDITION_LABEL) as UsedCondition[]).map((key) => (
            <option key={key} value={key}>
              {USED_CONDITION_LABEL[key]}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setParam("sort", event.target.value)}
          className="mr-auto h-8 rounded-lg border border-line-strong bg-surface px-2 text-[11px] text-ink outline-none focus:border-brand"
        >
          {SORTS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-1 flex items-center justify-between border-b border-line pb-2 text-[11px] text-muted">
        <span>{faNum(filtered.length)} دستگاه</span>
        <Link href="/track" className="text-brand">
          پیگیری سفارش
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className={`${card} mt-3 px-6 py-16 text-center text-sm text-muted`}>
          دستگاهی با این فیلترها موجود نیست.
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {filtered.map((listing) => (
            <UsedCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
