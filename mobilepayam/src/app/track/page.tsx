import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackView } from "./track-view";

export const metadata: Metadata = { title: "پیگیری سفارش" };

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-[1180px] px-4 py-16 text-sm text-muted">
          در حال بارگذاری…
        </main>
      }
    >
      <TrackView />
    </Suspense>
  );
}
