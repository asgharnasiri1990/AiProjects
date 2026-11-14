"use client";

import Link from "next/link";
import { useState } from "react";
import { useUsedListings } from "@/lib/store";
import { USED_CONDITION_LABEL, USED_STATUS_LABEL } from "@/data/used";
import { faNum } from "@/lib/format";
import { ProductArt } from "@/components/product-art";
import { UsedCard } from "@/components/used-card";
import { container, card, btnPrimary, btnGhost } from "@/lib/ui";

function embedUrl(url: string): string | null {
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const aparat = url.match(/aparat\.com\/v\/([\w-]+)/);
  if (aparat)
    return `https://www.aparat.com/video/video/embed/videohash/${aparat[1]}/vt/frame`;
  return null;
}

export function UsedDetailView({ slug }: { slug: string }) {
  const listings = useUsedListings();
  const listing = listings.find((item) => item.slug === slug);
  const [activeImage, setActiveImage] = useState(0);

  if (!listing) {
    return (
      <main className={`${container} py-20 text-center`}>
        <p className="text-sm text-muted">این آگهی پیدا نشد یا حذف شده است.</p>
        <Link href="/used" className={`${btnPrimary} mt-4`}>
          همهٔ گوشی‌های کارکرده
        </Link>
      </main>
    );
  }

  const cover = listing.images[activeImage] ?? listing.images[0];
  const embed = listing.video ? embedUrl(listing.video) : null;
  const related = listings
    .filter((item) => item.id !== listing.id)
    .slice(0, 4);

  return (
    <main className={`${container} pb-10`}>
      <nav className="flex flex-wrap items-center gap-1.5 py-3 text-[11px] text-muted">
        <Link href="/" className="hover:text-brand">
          خانه
        </Link>
        <span>/</span>
        <Link href="/used" className="hover:text-brand">
          گوشی‌های کارکرده
        </Link>
        <span>/</span>
        <b className="font-medium text-ink">{listing.title}</b>
      </nav>

      <div className={`${card} grid gap-6 p-4 lg:grid-cols-[440px_minmax(0,1fr)] lg:p-5`}>
        <div>
          <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg border border-line bg-canvas">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={listing.title}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <span className="flex flex-col items-center gap-2 text-[#4a4c6d]">
                <ProductArt icon="phone" className="h-36 w-auto" />
                <small className="text-[10.5px] text-muted">
                  تصویری برای این آگهی ثبت نشده است
                </small>
              </span>
            )}

            <span className="absolute right-3 top-3 rounded-full bg-[#e8f0ff] px-2.5 py-1 text-[10.5px] font-bold text-[#3355d6]">
              {USED_CONDITION_LABEL[listing.condition]}
            </span>
            {listing.status !== "available" ? (
              <span className="absolute inset-0 grid place-items-center bg-surface/70 text-sm font-extrabold text-ink">
                {USED_STATUS_LABEL[listing.status]}
              </span>
            ) : null}
          </div>

          {listing.images.length > 1 ? (
            <div className="mt-2 grid grid-cols-5 gap-2">
              {listing.images.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`grid aspect-square place-items-center overflow-hidden rounded-lg border bg-surface ${
                    index === activeImage ? "border-brand" : "border-line"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`${listing.title} — تصویر ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <span className="text-[11px] font-bold text-brand">{listing.brand}</span>
          <h1 className="mt-1 text-xl font-extrabold leading-8 text-ink-strong">
            {listing.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
            <span className="rounded-full bg-canvas px-2 py-0.5">
              {USED_CONDITION_LABEL[listing.condition]}
            </span>
            {listing.batteryHealth ? (
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-success">
                سلامت باتری {faNum(listing.batteryHealth)}٪
              </span>
            ) : null}
            <span>
              {listing.warrantyMonths
                ? `گارانتی ${faNum(listing.warrantyMonths)} ماههٔ فروشگاه`
                : "بدون گارانتی"}
            </span>
            <span>· {listing.city}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline gap-2 rounded-lg bg-[linear-gradient(115deg,#f3efff,#fff5fa)] px-4 py-3">
            {listing.oldPrice ? (
              <s className="text-xs text-muted">{faNum(listing.oldPrice)}</s>
            ) : null}
            <b className="text-2xl font-extrabold text-ink-strong">
              {faNum(listing.price)}
            </b>
            <span className="text-[11px] text-muted">تومان</span>
            {listing.oldPrice ? (
              <span className="mr-auto rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                ٪
                {faNum(
                  Math.round((1 - listing.price / listing.oldPrice) * 100),
                )}{" "}
                تخفیف
              </span>
            ) : null}
          </div>

          <p className="mt-3 max-w-[62ch] text-[12.5px] leading-7 text-[#5b5d7e]">
            {listing.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
            <a href="tel:+982188776655" className={`${btnPrimary} flex-1`}>
              تماس برای خرید
            </a>
            <a href="mailto:hello@mobilepayam.ir" className={btnGhost}>
              ارسال ایمیل
            </a>
          </div>

          <p className="mt-2 text-[10.5px] leading-5 text-muted">
            برای هماهنگی بازدید حضوری یا ارسال به شهرستان تماس بگیرید. دستگاه
            کارکرده است و موجودی آن تک‌نسخه‌ای است.
          </p>

          <ul className="mt-4 grid gap-1.5 text-[11px] text-[#5b5d7e]">
            <li>✓ کارشناسی فنی پیش از فروش</li>
            <li>✓ ۷ روز بازگشت در صورت ایراد فنی</li>
            <li>✓ امکان تحویل حضوری در تهران</li>
          </ul>
        </div>
      </div>

      <div className={`${card} mt-3 p-4`}>
        <h2 className="mb-3 text-sm font-extrabold text-ink-strong">مشخصات</h2>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {listing.specs.map((spec, index) => (
              <tr key={spec.label + index} className={index % 2 === 0 ? "bg-canvas/60" : ""}>
                <th className="w-40 px-3 py-2.5 text-right font-semibold text-muted">
                  {spec.label}
                </th>
                <td className="px-3 py-2.5 text-ink-strong">{spec.value}</td>
              </tr>
            ))}
            {listing.storage ? (
              <tr className="bg-canvas/60">
                <th className="w-40 px-3 py-2.5 text-right font-semibold text-muted">
                  حافظه
                </th>
                <td className="px-3 py-2.5 text-ink-strong">{listing.storage}</td>
              </tr>
            ) : null}
            {listing.color ? (
              <tr>
                <th className="w-40 px-3 py-2.5 text-right font-semibold text-muted">
                  رنگ
                </th>
                <td className="px-3 py-2.5 text-ink-strong">{listing.color}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {listing.video ? (
        <section className={`${card} mt-3 p-4`}>
          <h2 className="mb-3 text-sm font-extrabold text-ink-strong">
            ویدئوی دستگاه
          </h2>
          <div className="overflow-hidden rounded-lg bg-black">
            {embed ? (
              <iframe
                src={embed}
                title={`ویدئوی ${listing.title}`}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={listing.video}
                controls
                className="aspect-video w-full"
                poster={cover}
              >
                مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.
              </video>
            )}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className={`${card} mt-3 p-4`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-ink-strong">
              دستگاه‌های مشابه
            </h2>
            <Link href="/used" className="text-[11px] font-bold text-brand">
              همه ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((item) => (
              <UsedCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-4 text-[10.5px] text-muted">
        تصاویر و ویدئوی آگهی توسط کارشناس فروشگاه ثبت می‌شود
        {listing.images.length === 0
          ? " — برای این دستگاه هنوز تصویری بارگذاری نشده است."
          : "."}
      </p>
    </main>
  );
}
