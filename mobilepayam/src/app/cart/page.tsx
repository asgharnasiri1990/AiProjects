"use client";

import Link from "next/link";
import { useState } from "react";
import { removeLine, setLineQty, useResolvedCart } from "@/lib/cart";
import { applyCoupon, clearCoupon, useCoupon } from "@/lib/store";
import { faNum } from "@/lib/format";
import { shippingFor } from "@/lib/shipping";
import { ProductArt } from "@/components/product-art";
import { QuantityStepper } from "@/components/quantity-stepper";
import { container, card, btnPrimary, btnGhost, input } from "@/lib/ui";

export default function CartPage() {
  const { lines, subtotal } = useResolvedCart();
  const coupon = useCoupon();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const shipping = shippingFor("courier", subtotal);
  const total = subtotal - discount + shipping;

  return (
    <main className={`${container} pb-10`}>
      <h1 className="py-4 text-lg font-extrabold text-ink-strong">سبد خرید</h1>

      {lines.length === 0 ? (
        <div className={`${card} px-6 py-16 text-center`}>
          <p className="text-sm text-muted">سبد خرید خالی است.</p>
          <Link href="/shop" className={`${btnPrimary} mt-4`}>
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className={`${card} p-4`}>
            <div className="hidden grid-cols-[1fr_auto_120px_28px] gap-3 border-b border-line pb-2 text-[10.5px] text-muted sm:grid">
              <span>محصول</span>
              <span>تعداد</span>
              <span className="text-left">قیمت</span>
              <span />
            </div>

            {lines.map(({ line, product, variant }) => (
              <div
                key={`${line.productId}-${line.variantId}`}
                className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line py-3 last:border-b-0 sm:grid-cols-[1fr_auto_120px_28px]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-line bg-surface">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <ProductArt
                        icon={product.icon}
                        className="h-9 w-auto text-[#4a4c6d]"
                      />
                    )}
                  </span>
                  <span className="min-w-0">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="block truncate text-xs font-bold text-ink-strong"
                    >
                      {product.name}
                    </Link>
                    <span className="mt-0.5 block text-[10.5px] text-muted">
                      {[variant.storage, variant.color].filter(Boolean).join(" · ")}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLine(line.productId, line.variantId)}
                      className="mt-1 text-[10.5px] text-brand"
                    >
                      حذف
                    </button>
                  </span>
                </div>

                <QuantityStepper
                  qty={line.qty}
                  max={variant.stock}
                  size="sm"
                  onChange={(next) =>
                    setLineQty(line.productId, line.variantId, next)
                  }
                />

                <b className="col-start-1 text-left text-xs font-extrabold text-ink-strong sm:col-start-auto">
                  {faNum(variant.price * line.qty)}{" "}
                  <span className="text-[10px] font-normal text-muted">تومان</span>
                </b>

                <button
                  type="button"
                  aria-label="حذف از سبد"
                  onClick={() => removeLine(line.productId, line.variantId)}
                  className="hidden h-7 w-7 place-items-center rounded-md text-muted hover:bg-brand-soft hover:text-brand sm:grid"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setCouponError("");
                }}
                placeholder="کد تخفیف دارید؟"
                className={`${input} max-w-56`}
              />
              <button
                type="button"
                onClick={() => {
                  if (!code.trim()) return;
                  if (applyCoupon(code)) {
                    setCode("");
                    setCouponError("");
                  } else {
                    setCouponError("این کد معتبر نیست. کد نمونه: PAYAM10");
                  }
                }}
                className={btnGhost}
              >
                اعمال
              </button>
              {coupon ? (
                <span className="flex items-center gap-2 text-[11px] text-success">
                  کد {coupon.code} ({faNum(coupon.percent)}٪)
                  <button
                    type="button"
                    onClick={clearCoupon}
                    className="text-brand"
                  >
                    حذف
                  </button>
                </span>
              ) : null}
            </div>
            {couponError ? (
              <p className="mt-2 text-[11px] text-brand">{couponError}</p>
            ) : null}

            <Link href="/shop" className="mt-4 inline-block text-xs font-bold text-brand">
              ← ادامهٔ خرید
            </Link>
          </div>

          <aside className={`${card} h-fit p-4 lg:sticky lg:top-[132px]`}>
            <b className="mb-3 block text-sm font-extrabold text-ink-strong">
              خلاصهٔ سفارش
            </b>
            <div className="flex justify-between py-1.5 text-xs text-muted">
              <span>جمع کالاها</span>
              <b className="font-semibold text-ink-strong">{faNum(subtotal)}</b>
            </div>
            <div className="flex justify-between py-1.5 text-xs text-muted">
              <span>تخفیف</span>
              <b className={discount ? "font-semibold text-success" : "font-semibold text-ink-strong"}>
                {discount ? `− ${faNum(discount)}` : "—"}
              </b>
            </div>
            <div className="flex justify-between py-1.5 text-xs text-muted">
              <span>هزینهٔ ارسال</span>
              <b className="font-semibold text-ink-strong">
                {shipping ? faNum(shipping) : "رایگان"}
              </b>
            </div>
            <div className="my-2 h-px bg-line" />
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-ink-strong">مبلغ قابل پرداخت</span>
              <b className="text-lg font-extrabold text-ink-strong">
                {faNum(total)}{" "}
                <span className="text-[10px] font-normal text-muted">تومان</span>
              </b>
            </div>
            <Link href="/checkout" className={`${btnPrimary} mt-4 w-full`}>
              ادامهٔ فرآیند خرید
            </Link>
            <p className="mt-2 text-center text-[10px] text-muted">
              ارسال رایگان برای سفارش‌های بالای ۵٬۰۰۰٬۰۰۰ تومان
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
