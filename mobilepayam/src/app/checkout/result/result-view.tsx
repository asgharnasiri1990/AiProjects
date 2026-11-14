"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useOrders } from "@/lib/store";
import { faNum, orderDate } from "@/lib/format";
import { container, card, btnPrimary, btnGhost } from "@/lib/ui";

export function ResultView() {
  const params = useSearchParams();
  const code = params.get("code") ?? "";
  const orders = useOrders();
  const order = orders.find((item) => item.code === code);
  const awaitingReceipt = order?.payment.status === "awaiting-receipt";

  if (!order) {
    return (
      <main className={`${container} py-16 text-center`}>
        <p className="text-sm text-muted">
          سفارشی با این کد پیدا نشد.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/track" className={btnPrimary}>
            پیگیری سفارش
          </Link>
          <Link href="/shop" className={btnGhost}>
            فروشگاه
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`${container} pb-10`}>
      <div className={`${card} mx-auto mt-6 max-w-xl p-8 text-center`}>
        <span
          className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-2xl ${
            awaitingReceipt
              ? "bg-warning/10 text-warning"
              : "bg-success/10 text-success"
          }`}
        >
          {awaitingReceipt ? "⏳" : "✓"}
        </span>
        <h1 className="mt-4 text-lg font-extrabold text-ink-strong">
          {awaitingReceipt
            ? "سفارش ثبت شد؛ در انتظار تأیید فیش"
            : "سفارش با موفقیت ثبت شد"}
        </h1>
        <p className="mt-2 text-xs text-muted">
          کد سفارش شما:{" "}
          <b dir="ltr" className="font-mono text-sm text-ink-strong">
            {order.code}
          </b>
        </p>
        <p className="mt-1 text-[11px] text-muted">{orderDate(order.createdAt)}</p>

        <p className="mx-auto mt-4 max-w-[46ch] text-[11.5px] leading-6 text-[#5b5d7e]">
          {awaitingReceipt
            ? "پس از بررسی تصویر فیش، سفارش شما تأیید و برای ارسال آماده می‌شود. وضعیت را از صفحهٔ پیگیری دنبال کنید."
            : "این پرداخت شبیه‌سازی‌شده است. سفارش برای آماده‌سازی به انبار ارسال شد."}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href={`/track?code=${order.code}`} className={btnPrimary}>
            پیگیری سفارش
          </Link>
          <Link href="/account" className={btnGhost}>
            حساب کاربری
          </Link>
        </div>
      </div>

      <div className={`${card} mx-auto mt-3 max-w-xl p-4`}>
        <b className="mb-3 block text-sm font-extrabold text-ink-strong">خلاصهٔ سفارش</b>
        <div className="grid gap-2 border-b border-line pb-3">
          {order.items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex items-center justify-between gap-2 text-[11.5px]"
            >
              <span className="min-w-0 truncate text-[#5b5d7e]">
                {item.name} × {faNum(item.qty)}
              </span>
              <b className="whitespace-nowrap font-semibold text-ink-strong">
                {faNum(item.price * item.qty)}
              </b>
            </div>
          ))}
        </div>
        <div className="flex justify-between py-1.5 text-xs text-muted">
          <span>روش ارسال</span>
          <b className="font-semibold text-ink-strong">{order.shipping.method}</b>
        </div>
        <div className="flex justify-between py-1.5 text-xs text-muted">
          <span>هزینهٔ ارسال</span>
          <b className="font-semibold text-ink-strong">
            {order.shipping.price ? faNum(order.shipping.price) : "رایگان"}
          </b>
        </div>
        <div className="my-2 h-px bg-line" />
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-ink-strong">مبلغ کل</span>
          <b className="text-lg font-extrabold text-ink-strong">
            {faNum(order.total)}{" "}
            <span className="text-[10px] font-normal text-muted">تومان</span>
          </b>
        </div>
      </div>
    </main>
  );
}
