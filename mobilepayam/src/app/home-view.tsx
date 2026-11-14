"use client";

import Link from "next/link";
import { useCatalog } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
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
  const featured = [...products]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 10);

  return (
    <main className="pb-4">
      {/* Hero + side banners */}
      <section className={`${container} mt-4`}>
        <div className="grid gap-3 md:grid-cols-[1fr_296px]">
          <div className="relative overflow-hidden rounded-card bg-[linear-gradient(115deg,#0d2b5c_0%,#1c4fa0_55%,#2f80d8_100%)] px-5 py-7 text-white sm:px-7 sm:py-8">
            <span className="inline-block rounded-md bg-white/15 px-2 py-1 text-[10.5px] font-semibold">
              پیشنهاد ویژهٔ این هفته
            </span>
            <h1 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
              آیفون ۱۶ پرو مکس
            </h1>
            <p className="mt-2 max-w-[34ch] text-[11.5px] text-white/80 sm:text-xs">
              تیتانیوم طبیعی · گارانتی ۱۸ ماهه · ارسال رایگان
            </p>
            <b className="mt-4 block text-sm font-extrabold">
              از ۹۶٬۵۰۰٬۰۰۰ تومان
            </b>
            <Link
              href="/shop/iphone-16-pro-max"
              className="mt-4 inline-flex h-9 items-center rounded-md bg-white px-4 text-xs font-bold text-brand transition-colors hover:bg-brand-soft"
            >
              مشاهدهٔ محصول
            </Link>
            <ProductArt
              icon="phone"
              className="pointer-events-none absolute -left-2 top-1/2 hidden h-44 -translate-y-1/2 text-white/90 sm:block md:h-56"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            <Link
              href="/shop?cat=power"
              className="group flex items-center justify-between gap-2 overflow-hidden rounded-card bg-[linear-gradient(120deg,#ef4056,#ff7a59)] px-4 py-4 text-white"
            >
              <span>
                <b className="block text-sm font-extrabold">لوازم جانبی اصل</b>
                <span className="mt-1 block text-[10.5px] text-white/85">
                  شارژر، کابل و پاوربانک — تا ۳۰٪ تخفیف
                </span>
              </span>
              <ProductArt
                icon="charger"
                className="h-14 w-auto shrink-0 text-white/90 transition-transform group-hover:scale-105"
              />
            </Link>
            <Link
              href="/shop?cat=watch"
              className="group flex items-center justify-between gap-2 overflow-hidden rounded-card bg-[linear-gradient(120deg,#7a3ff2,#b06bff)] px-4 py-4 text-white"
            >
              <span>
                <b className="block text-sm font-extrabold">ساعت هوشمند</b>
                <span className="mt-1 block text-[10.5px] text-white/85">
                  سری جدید اپل واچ و گلکسی واچ
                </span>
              </span>
              <ProductArt
                icon="watch"
                className="h-14 w-auto shrink-0 text-white/90 transition-transform group-hover:scale-105"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={`${container} mt-3`}>
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
        <div className="relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-card bg-[linear-gradient(115deg,#d92c42_0%,#ef4056_55%,#ff6a4d_100%)] px-5 py-6 text-white sm:flex-row sm:items-center sm:px-7">
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
