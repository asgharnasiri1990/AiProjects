import Link from "next/link";
import { container, card, btnPrimary } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className={`${container} py-16`}>
      <div className={`${card} mx-auto max-w-md p-8 text-center`}>
        <b className="text-3xl font-black text-brand">۴۰۴</b>
        <h1 className="mt-2 text-lg font-extrabold text-ink-strong">
          صفحه پیدا نشد
        </h1>
        <p className="mt-2 text-xs leading-6 text-muted">
          آدرسی که وارد کرده‌اید وجود ندارد یا محصول حذف شده است.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/" className={btnPrimary}>
            صفحهٔ اصلی
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-11 items-center rounded-lg border border-line-strong px-5 text-sm font-bold text-ink hover:border-brand hover:text-brand"
          >
            فروشگاه
          </Link>
        </div>
      </div>
    </main>
  );
}
