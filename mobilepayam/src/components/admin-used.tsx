"use client";

import { useState } from "react";
import {
  addUsedListing,
  deleteUsedListing,
  updateUsedListing,
  useUsedListings,
} from "@/lib/store";
import { USED_CONDITION_LABEL, USED_STATUS_LABEL } from "@/data/used";
import { faNum } from "@/lib/format";
import type {
  Spec,
  UsedCondition,
  UsedListing,
  UsedStatus,
} from "@/lib/types";
import { ProductArt } from "@/components/product-art";
import { card, input, label, btnPrimary, btnGhost } from "@/lib/ui";

type Form = {
  id?: string;
  title: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  condition: UsedCondition;
  price: string;
  oldPrice: string;
  batteryHealth: string;
  warrantyMonths: string;
  city: string;
  status: UsedStatus;
  description: string;
  images: string;
  video: string;
  specs: string;
};

const EMPTY: Form = {
  title: "",
  brand: "",
  model: "",
  storage: "",
  color: "",
  condition: "excellent",
  price: "",
  oldPrice: "",
  batteryHealth: "",
  warrantyMonths: "6",
  city: "تهران",
  status: "available",
  description: "",
  images: "",
  video: "",
  specs: "",
};

function parseSpecs(raw: string): Spec[] {
  return raw
    .split("\n")
    .map((line) => {
      const [key, ...rest] = line.split(":");
      return { label: key.trim(), value: rest.join(":").trim() };
    })
    .filter((spec) => spec.label && spec.value);
}

export function AdminUsed() {
  const listings = useUsedListings();
  const [form, setForm] = useState<Form | null>(null);
  const [notice, setNotice] = useState("");

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const openEdit = (listing: UsedListing) =>
    setForm({
      id: listing.id,
      title: listing.title,
      brand: listing.brand,
      model: listing.model,
      storage: listing.storage ?? "",
      color: listing.color ?? "",
      condition: listing.condition,
      price: String(listing.price),
      oldPrice: listing.oldPrice ? String(listing.oldPrice) : "",
      batteryHealth: listing.batteryHealth ? String(listing.batteryHealth) : "",
      warrantyMonths: String(listing.warrantyMonths),
      city: listing.city,
      status: listing.status,
      description: listing.description,
      images: listing.images.join("\n"),
      video: listing.video ?? "",
      specs: listing.specs.map((spec) => `${spec.label}: ${spec.value}`).join("\n"),
    });

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;

    const price = Number(form.price);
    if (form.title.trim().length < 3) return flash("عنوان آگهی را کامل وارد کنید.");
    if (form.brand.trim().length < 2) return flash("برند را وارد کنید.");
    if (!Number.isFinite(price) || price <= 0) return flash("قیمت معتبر نیست.");

    const images = form.images
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const base = {
      title: form.title.trim(),
      brand: form.brand.trim(),
      model: form.model.trim() || form.title.trim(),
      storage: form.storage.trim() || undefined,
      color: form.color.trim() || undefined,
      condition: form.condition,
      price,
      oldPrice: Number(form.oldPrice) > price ? Number(form.oldPrice) : undefined,
      batteryHealth: Number(form.batteryHealth) || undefined,
      warrantyMonths: Number(form.warrantyMonths) || 0,
      city: form.city.trim() || "تهران",
      status: form.status,
      description: form.description.trim(),
      images,
      video: form.video.trim() || undefined,
      specs: parseSpecs(form.specs),
    };

    if (form.id) {
      const existing = listings.find((item) => item.id === form.id);
      if (!existing) return;
      updateUsedListing({ ...existing, ...base });
      flash("آگهی ویرایش شد.");
    } else {
      const stamp = Date.now().toString(36);
      addUsedListing({
        ...base,
        id: `u-${stamp}`,
        slug: `used-${stamp}`,
        createdAt: new Date().toISOString(),
      });
      flash("آگهی کارکرده اضافه شد.");
    }
    setForm(null);
  };

  return (
    <div className={`${card} mt-3 p-3`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <b className="text-sm font-extrabold text-ink-strong">
          آگهی‌های کارکرده ({faNum(listings.length)})
        </b>
        <button
          type="button"
          onClick={() => setForm({ ...EMPTY })}
          className={`${btnPrimary} h-9 px-3 text-[11px]`}
        >
          + افزودن آگهی
        </button>
      </div>

      {notice ? (
        <p className="mb-3 rounded-lg bg-success/10 px-3 py-2 text-[11px] font-bold text-success">
          {notice}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-[11.5px]">
          <thead>
            <tr className="text-muted">
              <th className="px-2 py-2 text-right font-medium">دستگاه</th>
              <th className="px-2 py-2 text-right font-medium">وضعیت</th>
              <th className="px-2 py-2 text-right font-medium">باتری</th>
              <th className="px-2 py-2 text-right font-medium">قیمت</th>
              <th className="px-2 py-2 text-right font-medium">آگهی</th>
              <th className="px-2 py-2 text-right font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-t border-line">
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-11 place-items-center overflow-hidden rounded-md border border-line bg-canvas">
                      {listing.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ProductArt icon="phone" className="h-6 w-auto text-[#4a4c6d]" />
                      )}
                    </span>
                    <span>
                      <b className="block font-semibold text-ink-strong">
                        {listing.title}
                      </b>
                      <span className="text-[10px] text-muted">
                        {listing.images.length} عکس
                        {listing.video ? " · ویدئو دارد" : ""}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2 text-muted">
                  {USED_CONDITION_LABEL[listing.condition]}
                </td>
                <td className="px-2 py-2 text-muted">
                  {listing.batteryHealth ? `${faNum(listing.batteryHealth)}٪` : "—"}
                </td>
                <td className="px-2 py-2 text-ink-strong">{faNum(listing.price)}</td>
                <td className="px-2 py-2">
                  <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] font-bold text-ink">
                    {USED_STATUS_LABEL[listing.status]}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(listing)}
                      className="rounded-md border border-line px-2 py-1 text-[10.5px] font-bold text-ink hover:border-brand hover:text-brand"
                    >
                      ویرایش
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(`آگهی «${listing.title}» حذف شود؟`)) return;
                        deleteUsedListing(listing.id);
                        flash("آگهی حذف شد.");
                      }}
                      className="rounded-md border border-line px-2 py-1 text-[10.5px] font-bold text-brand hover:border-brand"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {listings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  آگهی‌ای ثبت نشده است.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {form ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-strong/40 p-4">
          <form
            onSubmit={save}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card border border-line bg-surface p-5"
          >
            <div className="flex items-center justify-between border-b border-line pb-2">
              <b className="text-sm font-extrabold text-ink-strong">
                {form.id ? "ویرایش آگهی کارکرده" : "آگهی کارکرده جدید"}
              </b>
              <button
                type="button"
                onClick={() => setForm(null)}
                className="text-muted hover:text-brand"
                aria-label="بستن"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={`${label} sm:col-span-2`}>
                عنوان آگهی
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, title: event.target.value })
                  }
                  className={input}
                  placeholder="آیفون ۱۳ پرو مکس — ۲۵۶ گیگابایت"
                />
              </label>
              <label className={label}>
                برند
                <input
                  value={form.brand}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, brand: event.target.value })
                  }
                  className={input}
                  placeholder="Apple"
                />
              </label>
              <label className={label}>
                مدل
                <input
                  value={form.model}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, model: event.target.value })
                  }
                  className={input}
                  placeholder="iPhone 13 Pro Max"
                />
              </label>
              <label className={label}>
                حافظه
                <input
                  value={form.storage}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, storage: event.target.value })
                  }
                  className={input}
                  placeholder="۲۵۶ گیگابایت"
                />
              </label>
              <label className={label}>
                رنگ
                <input
                  value={form.color}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, color: event.target.value })
                  }
                  className={input}
                  placeholder="مشکی"
                />
              </label>
              <label className={label}>
                وضعیت دستگاه
                <select
                  value={form.condition}
                  onChange={(event) =>
                    setForm(
                      (current) =>
                        current && {
                          ...current,
                          condition: event.target.value as UsedCondition,
                        },
                    )
                  }
                  className={input}
                >
                  {Object.entries(USED_CONDITION_LABEL).map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              </label>
              <label className={label}>
                وضعیت آگهی
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm(
                      (current) =>
                        current && { ...current, status: event.target.value as UsedStatus },
                    )
                  }
                  className={input}
                >
                  {Object.entries(USED_STATUS_LABEL).map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              </label>
              <label className={label}>
                قیمت (تومان)
                <input
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, price: event.target.value })
                  }
                  inputMode="numeric"
                  dir="ltr"
                  className={`${input} text-left`}
                />
              </label>
              <label className={label}>
                قیمت قبل (اختیاری)
                <input
                  value={form.oldPrice}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, oldPrice: event.target.value })
                  }
                  inputMode="numeric"
                  dir="ltr"
                  className={`${input} text-left`}
                />
              </label>
              <label className={label}>
                سلامت باتری (٪)
                <input
                  value={form.batteryHealth}
                  onChange={(event) =>
                    setForm(
                      (current) => current && { ...current, batteryHealth: event.target.value },
                    )
                  }
                  inputMode="numeric"
                  dir="ltr"
                  className={`${input} text-left`}
                />
              </label>
              <label className={label}>
                گارانتی (ماه)
                <input
                  value={form.warrantyMonths}
                  onChange={(event) =>
                    setForm(
                      (current) => current && { ...current, warrantyMonths: event.target.value },
                    )
                  }
                  inputMode="numeric"
                  dir="ltr"
                  className={`${input} text-left`}
                />
              </label>
              <label className={label}>
                شهر
                <input
                  value={form.city}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, city: event.target.value })
                  }
                  className={input}
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                توضیحات
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm(
                      (current) => current && { ...current, description: event.target.value },
                    )
                  }
                  rows={3}
                  className="min-h-24 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink-strong outline-none focus:border-brand"
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                تصاویر — هر خط یک آدرس
                <textarea
                  value={form.images}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, images: event.target.value })
                  }
                  rows={3}
                  dir="ltr"
                  className="min-h-20 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-left text-xs text-ink-strong outline-none focus:border-brand"
                  placeholder={"https://…/photo-1.jpg\nhttps://…/photo-2.jpg"}
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                ویدئو — آدرس mp4 یا لینک یوتیوب/آپارات (اختیاری)
                <input
                  value={form.video}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, video: event.target.value })
                  }
                  dir="ltr"
                  className={`${input} text-left`}
                  placeholder="https://www.aparat.com/v/…"
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                مشخصات — هر خط «عنوان: مقدار»
                <textarea
                  value={form.specs}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, specs: event.target.value })
                  }
                  rows={4}
                  className="min-h-24 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink-strong outline-none focus:border-brand"
                  placeholder={"وضعیت بدنه: عالی\nسلامت باتری: ۸۸٪"}
                />
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="submit" className={`${btnPrimary} flex-1`}>
                ذخیره
              </button>
              <button type="button" onClick={() => setForm(null)} className={btnGhost}>
                انصراف
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
