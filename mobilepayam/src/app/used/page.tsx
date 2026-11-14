import type { Metadata } from "next";
import { Suspense } from "react";
import { UsedView } from "./used-view";

export const metadata: Metadata = {
  title: "گوشی‌های کارکرده",
  description:
    "خرید گوشی کارکرده با کارشناسی فنی، سلامت باتری مشخص و گارانتی فروشگاه.",
};

export default function UsedPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-[1180px] px-4 py-16 text-sm text-muted">
          در حال بارگذاری…
        </main>
      }
    >
      <UsedView />
    </Suspense>
  );
}
