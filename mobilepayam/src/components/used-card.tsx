import Link from "next/link";
import type { UsedListing } from "@/lib/types";
import { USED_CONDITION_LABEL, USED_STATUS_LABEL } from "@/data/used";
import { faNum } from "@/lib/format";
import { ProductArt } from "@/components/product-art";

export function UsedCard({ listing }: { listing: UsedListing }) {
  const cover = listing.images[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-[0_10px_24px_-18px_rgba(35,36,63,0.45)]">
      <Link href={`/used/${listing.slug}`} className="flex flex-1 flex-col">
        <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-canvas">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={listing.title}
              className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="flex flex-col items-center gap-1 text-[#4a4c6d]">
              <ProductArt icon="phone" className="h-[52%] w-auto" />
              <small className="text-[10px] text-muted">بدون تصویر ثبت‌شده</small>
            </span>
          )}

          <span className="absolute right-2 top-2 rounded-full bg-[#e8f0ff] px-2 py-0.5 text-[10px] font-bold text-[#3355d6]">
            {USED_CONDITION_LABEL[listing.condition]}
          </span>

          {listing.batteryHealth ? (
            <span className="absolute right-2 top-8 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
              باتری {faNum(listing.batteryHealth)}٪
            </span>
          ) : null}

          {listing.status !== "available" ? (
            <span className="absolute inset-0 grid place-items-center bg-surface/75 text-xs font-extrabold text-ink">
              {USED_STATUS_LABEL[listing.status]}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <span className="text-[10px] text-muted">{listing.brand}</span>
          <h3 className="min-h-11 text-[13px] font-bold leading-7 text-ink-strong">
            {listing.title}
          </h3>
          <span className="text-[10.5px] text-muted">
            {[listing.storage, listing.color].filter(Boolean).join(" · ")}
          </span>

          <div className="mt-auto pt-1">
            {listing.oldPrice ? (
              <s className="block text-[10.5px] text-muted">
                {faNum(listing.oldPrice)}
              </s>
            ) : null}
            <p className="flex items-baseline gap-1">
              <b className="text-[15px] font-extrabold text-ink-strong">
                {faNum(listing.price)}
              </b>
              <span className="text-[10px] text-muted">تومان</span>
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-line pt-2 text-[10px] text-muted">
            <span>{listing.city}</span>
            <span>
              {listing.warrantyMonths
                ? `گارانتی ${faNum(listing.warrantyMonths)} ماهه`
                : "بدون گارانتی"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
