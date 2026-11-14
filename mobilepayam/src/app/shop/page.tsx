import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "./shop-view";

export const metadata: Metadata = {
  title: "فروشگاه",
  description:
    "همهٔ موبایل‌ها، ساعت‌های هوشمند، هدفون‌ها و لوازم جانبی با فیلتر دسته، برند و قیمت.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-[1180px] px-4 py-16 text-sm text-muted">
          در حال بارگذاری فروشگاه…
        </main>
      }
    >
      <ShopView />
    </Suspense>
  );
}
