"use client";

import Link from "next/link";
import { useCatalog, useUsedListings } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { UsedCard } from "@/components/used-card";
import { HeroSlider } from "@/components/hero-slider";
import { ProductArt } from "@/components/product-art";
import { container, card, sectionTitle, btnOnBrand } from "@/lib/ui";

const TRUST = [
  { title: "ضمانت اصالت کالا", note: "با کد رهگیری رسمی", icon: "shield" },
  { title: "ارسال سریع", note: "تهران: همان روز", icon: "truck" },
  { title: "۷ روز بازگشت", note: "بدون پرسش", icon: "refresh" },
  { title: "پرداخت امن", note: "درگاه بانکی معتبر", icon: "lock" },
] as const;

function TrustIcon({ name }: { name: (typeof TRUST)[number]["icon"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-7 w-7 text-brand",
    "aria-hidden": true,
  };
  if (name === "shield")
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V6z" />
        <path d="m9 11.8 2.1 2.2L15.2 10" />
      </svg>
    );
  if (name === "truck")
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M2 6h11v10H2z" />
        <path d="M13 9h4l4 3.5V16h-8" />
        <circle cx="6" cy="18.5" r="1.6" />
        <circle cx="17" cy="18.5" r="1.6" />
      </svg>
    );
  if (name === "refresh")
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M20 12a8 8 0 1 1-2.6-5.9" />
        <path d="M20 4.5V9h-4.5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </svg>
  );
}

export function HomeView() {
  const { products, categories } = useCatalog();
  const used = useUsedListings();
  const featured = [...products]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 10);

  return (
    <main className="pb-4">
      {/* Hero — one full-bleed slider */}
      <HeroSlider />

      {/* Categories */}
      <section className={`${container} mt-2`}>
        <div className={`${card} grid grid-cols-3 gap-1 px-2 py-3 sm:grid-cols-6`}>
          {categories.map((category) => {
            const count = products.filter(
              (product) => product.categoryId === category.id,
            ).length;
            return (
              <Link
                key={category.id}
                href={`/shop?cat=${category.id}`}
                className="group flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-canvas text-[#5b5d7e] transition-colors group-hover:bg-brand-soft group-hover:text-brand">
                  <ProductArt icon={category.icon} className="h-8 w-auto" />
                </span>
                <b className="text-xs font-bold text-ink">{category.name}</b>
                <span className="text-[10px] text-muted">
                  {count.toLocaleString("fa-IR")} کالا
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className={`${container} mt-3`}>
        <div className={`${card} px-4 py-4`}>
          <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
            <h2 className={sectionTitle}>
              <span className="h-5 w-1 rounded bg-brand" />
              پرفروش‌های این هفته
            </h2>
            <Link href="/shop" className="text-xs font-bold text-brand">
              مشاهدهٔ همه ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Used phones */}
      <section className={`${container} mt-3`}>
        <div className={`${card} px-4 py-4`}>
          <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
            <h2 className={sectionTitle}>
              <span className="h-5 w-1 rounded bg-brand" />
              گوشی‌های کارکرده
            </h2>
            <Link href="/used" className="text-xs font-bold text-brand">
              مشاهدهٔ همه ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {used.slice(0, 4).map((listing) => (
              <UsedCard key={listing.id} listing={listing} />
            ))}
          </div>
          <p className="mt-3 text-[10.5px] text-muted">
            همهٔ دستگاه‌ها کارشناسی‌شده‌اند؛ سلامت باتری و وضعیت بدنه در هر آگهی
            مشخص است.
          </p>
        </div>
      </section>

      {/* Trust */}
      <section className={`${container} mt-3`}>
        <div className={`${card} grid grid-cols-2 gap-3 px-4 py-4 lg:grid-cols-4`}>
          {TRUST.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 border-line px-2 py-1 lg:border-l lg:first:border-l-0"
            >
              <TrustIcon name={item.icon} />
              <span>
                <b className="block text-xs font-bold text-ink-strong">
                  {item.title}
                </b>
                <span className="text-[10.5px] text-muted">{item.note}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Offer */}
      <section className={`${container} mt-3`}>
        <div className="relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-card bg-[linear-gradient(115deg,#0a1c3a_0%,#102a54_55%,#1d3f6e_100%)] px-5 py-6 text-white sm:flex-row sm:items-center sm:px-7">
          <span className="absolute left-4 top-4 rounded-md bg-black/20 px-2 py-1 text-[11px] font-bold tracking-widest">
            ۰۲ : ۱۴ : ۳۶
          </span>
          <div className="max-w-[46ch]">
            <span className="text-[11px] text-white/80">پیشنهاد محدود</span>
            <h2 className="mt-1 text-xl font-black sm:text-2xl">
              لوازم جانبی اصل، تا ۳۰٪ کمتر
            </h2>
            <p className="mt-1 text-[11.5px] text-white/85">
              شارژرهای GaN، کابل‌های فست‌شارژ و پاوربانک‌های سبک — تا پایان هفته.
            </p>
          </div>
          <Link href="/shop?cat=power" className={btnOnBrand}>
            دیدن پیشنهادها ←
          </Link>
        </div>
      </section>
    </main>
  );
}
