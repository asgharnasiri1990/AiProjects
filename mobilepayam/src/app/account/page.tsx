"use client";

import Link from "next/link";
import { signOut, useOrders, useUser } from "@/lib/store";
import { faNum, orderDate } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { container, card, btnPrimary, btnGhost } from "@/lib/ui";

const STATUS: Record<OrderStatus, string> = {
  pending: "در انتظار پردازش",
  paid: "پرداخت شده",
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  canceled: "لغو شده",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-canvas text-ink",
  paid: "bg-success/10 text-success",
  processing: "bg-warning/10 text-warning",
  shipped: "bg-[#e8f0ff] text-[#3355d6]",
  delivered: "bg-success/10 text-success",
  canceled: "bg-brand-soft text-brand",
};

export default function AccountPage() {
  const user = useUser();
  const orders = useOrders();

  if (!user) {
    return (
      <main className={`${container} py-16`}>
        <div className={`${card} mx-auto max-w-md p-8 text-center`}>
          <h1 className="text-lg font-extrabold text-ink-strong">حساب کاربری</h1>
          <p className="mt-2 text-xs leading-6 text-muted">
            برای دیدن سفارش‌ها و اطلاعات حساب وارد شوید. ورود نمایشی است و اطلاعات
            فقط در همین مرورگر می‌ماند.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Link href="/login?next=%2Faccount" className={btnPrimary}>
              ورود / ثبت‌نام
            </Link>
            <Link href="/shop" className={btnGhost}>
              فروشگاه
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`${container} pb-10`}>
      <div className="flex flex-wrap items-center justify-between gap-2 py-4">
        <h1 className="text-lg font-extrabold text-ink-strong">
          سلام، {user.name.split(" ")[0]} 👋
        </h1>
        <button
          type="button"
          onClick={signOut}
          className="text-[11px] text-muted hover:text-brand"
        >
          خروج از حساب
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className={`${card} h-fit p-4`}>
          <div className="flex items-center gap-3 border-b border-line pb-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-sm font-extrabold text-brand">
              {user.name.trim().charAt(0)}
            </span>
            <span>
              <b className="block text-xs font-extrabold text-ink-strong">{user.name}</b>
              <span dir="ltr" className="block text-[10.5px] text-muted">
                {user.phone}
              </span>
            </span>
          </div>

          <div className="mt-3 grid gap-1">
            <Link href="/account" className="rounded-md bg-brand-soft px-3 py-2 text-xs font-bold text-brand">
              پیشخوان
            </Link>
            <Link href="/account" className="rounded-md px-3 py-2 text-xs text-ink hover:bg-canvas">
              سفارش‌های من
            </Link>
            <Link href="/track" className="rounded-md px-3 py-2 text-xs text-ink hover:bg-canvas">
              پیگیری سفارش
            </Link>
            <Link href="/cart" className="rounded-md px-3 py-2 text-xs text-ink hover:bg-canvas">
              سبد خرید
            </Link>
            <Link href="/admin" className="rounded-md px-3 py-2 text-xs text-ink hover:bg-canvas">
              پنل مدیریت
            </Link>
          </div>
        </aside>

        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className={`${card} px-4 py-3`}>
              <span className="text-[10.5px] text-muted">سفارش‌ها</span>
              <b className="block text-lg font-extrabold text-ink-strong">
                {faNum(orders.length)}
              </b>
            </div>
            <div className={`${card} px-4 py-3`}>
              <span className="text-[10.5px] text-muted">در حال ارسال</span>
              <b className="block text-lg font-extrabold text-ink-strong">
                {faNum(
                  orders.filter((order) =>
                    ["pending", "processing", "shipped"].includes(order.status),
                  ).length,
                )}
              </b>
            </div>
            <div className={`${card} px-4 py-3`}>
              <span className="text-[10.5px] text-muted">مجموع خرید</span>
              <b className="block text-base font-extrabold text-ink-strong">
                {faNum(orders.reduce((sum, order) => sum + order.total, 0))}
                <span className="text-[9.5px] font-normal text-muted"> تومان</span>
              </b>
            </div>
          </div>

          <div className={`${card} p-4`}>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <b className="text-sm font-extrabold text-ink-strong">آخرین سفارش‌ها</b>
              <Link href="/track" className="text-[11px] font-bold text-brand">
                پیگیری
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted">
                هنوز سفارشی ثبت نشده است.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[11.5px]">
                  <thead>
                    <tr className="text-muted">
                      <th className="px-2 py-2 text-right font-medium">شماره</th>
                      <th className="px-2 py-2 text-right font-medium">تاریخ</th>
                      <th className="px-2 py-2 text-right font-medium">مبلغ</th>
                      <th className="px-2 py-2 text-right font-medium">وضعیت</th>
                      <th className="px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-line">
                        <td dir="ltr" className="px-2 py-2 text-right font-mono text-ink-strong">
                          {order.code}
                        </td>
                        <td className="px-2 py-2 text-muted">{orderDate(order.createdAt)}</td>
                        <td className="px-2 py-2 text-ink-strong">{faNum(order.total)}</td>
                        <td className="px-2 py-2">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_CLASS[order.status]}`}
                          >
                            {STATUS[order.status]}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <Link
                            href={`/track?code=${order.code}`}
                            className="text-[10.5px] font-bold text-brand"
                          >
                            جزئیات
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
