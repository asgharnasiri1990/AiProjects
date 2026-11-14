"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearCart, useResolvedCart } from "@/lib/cart";
import { clearCoupon, placeOrder, useCoupon } from "@/lib/store";
import { faNum, orderCode, toEnglishDigits } from "@/lib/format";
import {
  SHIPPING_METHODS,
  shippingFor,
  shippingMethodName,
  type ShippingMethod,
} from "@/lib/shipping";
import type { Customer, Order, PaymentMethod } from "@/lib/types";
import { container, card, btnPrimary, input, label } from "@/lib/ui";

const IBAN = "IR000000000000000000000000";
const IBAN_OWNER = "mobilepayam";
const IBAN_BANK = "بانک ملت — حساب فروشگاه";

export default function CheckoutPage() {
  const { lines, subtotal } = useResolvedCart();
  const coupon = useCoupon();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    province: "تهران",
    city: "تهران",
    address: "",
    postalCode: "",
  });
  const [method, setMethod] = useState<ShippingMethod["id"]>("courier");
  const [payment, setPayment] = useState<PaymentMethod>("gateway");
  const [receipt, setReceipt] = useState<{ name: string; preview?: string } | null>(
    null,
  );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const shipping = shippingFor(method, subtotal);
  const total = subtotal - discount + shipping;

  const setField = (field: keyof Customer, value: string) =>
    setCustomer((current) => ({ ...current, [field]: value }));

  const submit = () => {
    if (lines.length === 0) return;

    const phone = toEnglishDigits(customer.phone).replace(/\D/g, "");
    const postal = toEnglishDigits(customer.postalCode).replace(/\D/g, "");

    if (customer.name.trim().length < 3) return setError("نام و نام خانوادگی را کامل وارد کنید.");
    if (!/^09\d{9}$/.test(phone)) return setError("شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.");
    if (customer.address.trim().length < 10) return setError("آدرس را کامل وارد کنید.");
    if (postal && postal.length !== 10) return setError("کد پستی باید ۱۰ رقم باشد.");
    if (payment === "sheba" && !receipt) return setError("برای واریز به شبا، تصویر فیش را بارگذاری کنید.");

    setError("");

    const order: Order = {
      id: crypto.randomUUID(),
      code: orderCode(),
      createdAt: new Date().toISOString(),
      customer: { ...customer, phone },
      items: lines.map(({ product, variant, line }) => ({
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        variantLabel: [variant.storage, variant.color].filter(Boolean).join(" · "),
        price: variant.price,
        qty: line.qty,
      })),
      shipping: { method: shippingMethodName(method), price: shipping },
      payment: {
        method: payment,
        status: payment === "gateway" ? "paid" : "awaiting-receipt",
        receiptName: receipt?.name,
      },
      subtotal,
      total,
      status: "pending",
    };

    placeOrder(order);
    clearCart();
    clearCoupon();
    router.push(`/checkout/result?code=${order.code}`);
  };

  if (lines.length === 0) {
    return (
      <main className={`${container} py-16 text-center`}>
        <p className="text-sm text-muted">سبد خرید خالی است؛ ابتدا محصولی انتخاب کنید.</p>
        <Link href="/shop" className={`${btnPrimary} mt-4`}>
          رفتن به فروشگاه
        </Link>
      </main>
    );
  }

  return (
    <main className={`${container} pb-10`}>
      <h1 className="py-4 text-lg font-extrabold text-ink-strong">تکمیل سفارش</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <i className="grid h-6 w-6 place-items-center rounded-full bg-success/10 text-success">✓</i>
          سبد خرید
        </span>
        <span className="text-line-strong">—</span>
        <span className="flex items-center gap-1.5">
          <i className="grid h-6 w-6 place-items-center rounded-full bg-success/10 text-success">✓</i>
          اطلاعات ارسال
        </span>
        <span className="text-line-strong">—</span>
        <span className="flex items-center gap-1.5 font-bold text-ink-strong">
          <i className="grid h-6 w-6 place-items-center rounded-full bg-brand text-white">۳</i>
          پرداخت
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className={`${card} p-4`}>
          <b className="mb-3 block text-sm font-extrabold text-ink-strong">اطلاعات گیرنده</b>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className={label}>
              نام و نام خانوادگی
              <input
                value={customer.name}
                onChange={(event) => setField("name", event.target.value)}
                className={input}
              />
            </label>
            <label className={label}>
              شمارهٔ موبایل
              <input
                value={customer.phone}
                onChange={(event) => setField("phone", event.target.value)}
                inputMode="tel"
                dir="ltr"
                placeholder="09xxxxxxxxx"
                className={`${input} text-left`}
              />
            </label>
            <label className={label}>
              استان
              <input
                value={customer.province}
                onChange={(event) => setField("province", event.target.value)}
                className={input}
              />
            </label>
            <label className={label}>
              شهر
              <input
                value={customer.city}
                onChange={(event) => setField("city", event.target.value)}
                className={input}
              />
            </label>
            <label className={`${label} sm:col-span-2`}>
              آدرس کامل
              <textarea
                value={customer.address}
                onChange={(event) => setField("address", event.target.value)}
                rows={2}
                className="min-h-20 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink-strong outline-none focus:border-brand"
              />
            </label>
            <label className={label}>
              کد پستی
              <input
                value={customer.postalCode}
                onChange={(event) => setField("postalCode", event.target.value)}
                inputMode="numeric"
                dir="ltr"
                className={`${input} text-left`}
              />
            </label>
          </div>

          <b className="mb-2 mt-5 block text-sm font-extrabold text-ink-strong">روش ارسال</b>
          <div className="grid gap-2">
            {SHIPPING_METHODS.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                  method === option.id
                    ? "border-brand bg-brand-soft/40"
                    : "border-line-strong"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={method === option.id}
                  onChange={() => setMethod(option.id)}
                  className="accent-brand"
                />
                <span className="flex flex-col">
                  <b className="text-xs font-bold text-ink-strong">{option.name}</b>
                  <span className="text-[10.5px] text-muted">{option.note}</span>
                </span>
                <b className="mr-auto whitespace-nowrap text-[11px] font-bold text-ink-strong">
                  {option.price === 0
                    ? "رایگان"
                    : shippingFor(option.id, subtotal) === 0
                      ? "رایگان"
                      : `${faNum(option.price)} تومان`}
                </b>
              </label>
            ))}
          </div>

          <b className="mb-2 mt-5 block text-sm font-extrabold text-ink-strong">روش پرداخت</b>
          <div className="grid gap-2">
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                payment === "gateway" ? "border-brand bg-brand-soft/40" : "border-line-strong"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={payment === "gateway"}
                onChange={() => setPayment("gateway")}
                className="accent-brand"
              />
              <span className="flex flex-col">
                <b className="text-xs font-bold text-ink-strong">درگاه پرداخت (شبیه‌سازی)</b>
                <span className="text-[10.5px] text-muted">
                  پرداخت امن با کارت‌های شتاب — در این نسخه پرداخت واقعی انجام نمی‌شود
                </span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                payment === "sheba" ? "border-brand bg-brand-soft/40" : "border-line-strong"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={payment === "sheba"}
                onChange={() => setPayment("sheba")}
                className="accent-brand"
              />
              <span className="flex flex-col">
                <b className="text-xs font-bold text-ink-strong">واریز به شمارهٔ شبا</b>
                <span className="text-[10.5px] text-muted">
                  پس از واریز، تصویر فیش را بارگذاری کنید
                </span>
              </span>
            </label>
          </div>

          {payment === "sheba" ? (
            <div className="mt-3 rounded-lg border border-dashed border-line-strong p-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted">شمارهٔ شبا:</span>
                <b dir="ltr" className="font-mono text-[12px] text-ink-strong">
                  {IBAN}
                </b>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(IBAN);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1500);
                    } catch {
                      setCopied(false);
                    }
                  }}
                  className="rounded-md bg-canvas px-2 py-1 text-[10.5px] font-bold text-ink"
                >
                  {copied ? "کپی شد" : "کپی"}
                </button>
              </div>
              <p className="mt-2 text-[10.5px] text-muted">
                {IBAN_BANK} — به نام {IBAN_OWNER}
              </p>

              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-3 py-2 text-[11px] font-bold text-ink hover:border-brand hover:text-brand">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setReceipt({
                      name: file.name,
                      preview: file.type.startsWith("image/")
                        ? URL.createObjectURL(file)
                        : undefined,
                    });
                    setError("");
                  }}
                />
                {receipt ? "تغییر تصویر فیش" : "بارگذاری تصویر فیش"}
              </label>
              {receipt ? (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-success">
                  ✓ {receipt.name}
                  {receipt.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={receipt.preview}
                      alt="پیش‌نمایش فیش"
                      className="h-10 w-10 rounded border border-line object-cover"
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <p className="mt-3 rounded-lg bg-brand-soft px-3 py-2 text-[11px] font-semibold text-brand">
              {error}
            </p>
          ) : null}
        </div>

        <aside className={`${card} h-fit p-4 lg:sticky lg:top-[132px]`}>
          <b className="mb-3 block text-sm font-extrabold text-ink-strong">سفارش شما</b>

          <div className="grid gap-2 border-b border-line pb-3">
            {lines.map(({ product, variant, line }) => (
              <div
                key={`${product.id}-${variant.id}`}
                className="flex items-center justify-between gap-2 text-[11px]"
              >
                <span className="min-w-0 truncate text-[#5b5d7e]">
                  {product.name} × {faNum(line.qty)}
                </span>
                <b className="whitespace-nowrap font-semibold text-ink-strong">
                  {faNum(variant.price * line.qty)}
                </b>
              </div>
            ))}
          </div>

          <div className="flex justify-between py-1.5 text-xs text-muted">
            <span>جمع کالاها</span>
            <b className="font-semibold text-ink-strong">{faNum(subtotal)}</b>
          </div>
          {coupon ? (
            <div className="flex justify-between py-1.5 text-xs text-muted">
              <span>تخفیف ({coupon.code})</span>
              <b className="font-semibold text-success">− {faNum(discount)}</b>
            </div>
          ) : null}
          <div className="flex justify-between py-1.5 text-xs text-muted">
            <span>هزینهٔ ارسال</span>
            <b className="font-semibold text-ink-strong">
              {shipping ? faNum(shipping) : "رایگان"}
            </b>
          </div>
          <div className="my-2 h-px bg-line" />
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-ink-strong">قابل پرداخت</span>
            <b className="text-lg font-extrabold text-ink-strong">
              {faNum(total)}{" "}
              <span className="text-[10px] font-normal text-muted">تومان</span>
            </b>
          </div>

          <button type="button" onClick={submit} className={`${btnPrimary} mt-4 w-full`}>
            {payment === "gateway" ? "پرداخت و ثبت سفارش" : "ثبت سفارش با فیش"}
          </button>

          <p className="mt-3 text-center text-[10px] text-muted">
            {lines.length} قلم ·{" "}
            {lines
              .reduce((sum, item) => sum + item.line.qty, 0)
              .toLocaleString("fa-IR")}{" "}
            عدد
          </p>
        </aside>
      </div>
    </main>
  );
}
