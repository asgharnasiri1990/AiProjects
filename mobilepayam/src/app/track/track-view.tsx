"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useOrders } from "@/lib/store";
import { faNum, orderDate } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { container, card, input, btnPrimary } from "@/lib/ui";

const STEPS: { id: OrderStatus; label: string }[] = [
  { id: "pending", label: "ثبت سفارش" },
  { id: "processing", label: "در حال پردازش" },
  { id: "shipped", label: "ارسال شده" },
  { id: "delivered", label: "تحویل شده" },
];

const PAYMENT_LABEL: Record<string, string> = {
  paid: "پرداخت شده",
  "awaiting-receipt": "در انتظار تأیید فیش",
  failed: "پرداخت ناموفق",
};

export function TrackView() {
  const params = useSearchParams();
  const orders = useOrders();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [searched, setSearched] = useState(Boolean(params.get("code")));

  const order = orders.find(
    (item) => item.code.toLowerCase() === code.trim().toLowerCase(),
  );
  const activeIndex = order ? STEPS.findIndex((step) => step.id === order.status) : -1;

  return (
    <main className={`${container} pb-10`}>
      <h1 className="py-4 text-lg font-extrabold text-ink-strong">پیگیری سفارش</h1>

      <div className={`${card} p-4`}>
        <p className="mb-3 text-xs text-muted">
          کد سفارش را وارد کنید (نمونه: MP-10482).
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setSearched(false);
            }}
            placeholder="MP-00000"
            dir="ltr"
            className={`${input} max-w-64 text-left font-mono`}
          />
          <button type="button" onClick={() => setSearched(true)} className={btnPrimary}>
            پیگیری
          </button>
        </div>
      </div>

      {searched ? (
        order ? (
          <div className={`${card} mt-3 p-4`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
              <b className="text-sm font-extrabold text-ink-strong">
                سفارش {order.code}
              </b>
              <span className="text-[11px] text-muted">{orderDate(order.createdAt)}</span>
            </div>

            <div className="mt-5 flex items-center">
              {STEPS.map((step, index) => {
                const done = index <= activeIndex;
                return (
                  <div key={step.id} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${
                          done ? "bg-brand text-white" : "bg-canvas text-muted"
                        }`}
                      >
                        {done ? "✓" : index + 1}
                      </span>
                      <span
                        className={`text-[10px] ${done ? "font-bold text-ink-strong" : "text-muted"}`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < STEPS.length - 1 ? (
                      <span
                        className={`mx-1 mb-4 h-0.5 flex-1 ${
                          index < activeIndex ? "bg-brand" : "bg-line"
                        }`}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {order.status === "canceled" ? (
              <p className="mt-4 rounded-lg bg-brand-soft px-3 py-2 text-[11px] font-bold text-brand">
                این سفارش لغو شده است.
              </p>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-line p-3 text-[11px]">
                <b className="mb-1 block text-ink-strong">اطلاعات ارسال</b>
                <p className="text-muted">
                  {order.customer.name} — {order.customer.phone}
                </p>
                <p className="mt-1 text-muted">
                  {order.customer.province}، {order.customer.city}، {order.customer.address}
                </p>
                <p className="mt-1 text-muted">{order.shipping.method}</p>
              </div>
              <div className="rounded-lg border border-line p-3 text-[11px]">
                <b className="mb-1 block text-ink-strong">پرداخت</b>
                <p className="text-muted">
                  روش: {order.payment.method === "sheba" ? "واریز به شبا" : "درگاه بانکی"}
                </p>
                <p className="mt-1 text-muted">
                  وضعیت: {PAYMENT_LABEL[order.payment.status] ?? order.payment.status}
                </p>
                <p className="mt-1 text-muted">
                  مبلغ: {faNum(order.total)} تومان
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link href="/account" className="text-xs font-bold text-brand">
                مشاهدهٔ همهٔ سفارش‌ها ←
              </Link>
            </div>
          </div>
        ) : (
          <div className={`${card} mt-3 px-4 py-10 text-center text-sm text-muted`}>
            سفارشی با این کد پیدا نشد. کد نمونه: MP-10482
          </div>
        )
      ) : null}
    </main>
  );
}
