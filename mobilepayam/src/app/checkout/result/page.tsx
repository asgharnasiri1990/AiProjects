import { Suspense } from "react";
import { ResultView } from "./result-view";

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-[1180px] px-4 py-16 text-sm text-muted">
          در حال خواندن سفارش…
        </main>
      }
    >
      <ResultView />
    </Suspense>
  );
}
