"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  BRANDS,
  COLOR_SUGGESTIONS,
  STORAGE_OPTIONS,
  findBrand,
} from "@/lib/brands";
import { faNumber, formatTime } from "@/lib/format";
import { SHOPS } from "@/lib/shops";
import type { Offer, PricesResponse } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertIcon,
  CloseIcon,
  ExternalIcon,
  PlusIcon,
  SearchIcon,
  StoreIcon,
} from "@/components/icons";

const CONTROL =
  "w-full rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/20";

const MAX_CUSTOM_SLOTS = 4;

interface CustomSlot {
  name: string;
  url: string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-line bg-surface p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-line" />
              <div className="h-3 w-3/4 rounded bg-line" />
            </div>
            <div className="h-6 w-28 rounded bg-line" />
          </div>
        </div>
      ))}
    </div>
  );
}

function IdleState() {
  const steps = [
    {
      title: "مدل را انتخاب کن",
      body: "برند، مدل، حافظه و رنگ. «همه» یعنی این فیلتر را اعمال نکن.",
    },
    {
      title: "فروشگاه‌ها را تیک بزن",
      body: "قیمت‌ها زنده از صفحهٔ همان فروشگاه خوانده می‌شوند.",
    },
    {
      title: "کف بازار را ببین",
      body: "ارزان‌ترین قیمت و ردیف همهٔ فروشگاه‌ها، مرتب‌شده.",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className="rounded-2xl border border-line bg-surface p-4"
        >
          <span className="grid size-7 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent nums">
            {faNumber(index + 1)}
          </span>
          <p className="mt-3 text-sm font-bold">{step.title}</p>
          <p className="mt-1 text-xs text-muted">{step.body}</p>
        </div>
      ))}
    </div>
  );
}

function sameOffer(a: Offer, b: Offer | null): boolean {
  return (
    b !== null &&
    a.shopId === b.shopId &&
    a.url === b.url &&
    a.price === b.price
  );
}

function OfferRow({
  offer,
  rank,
  cheapest,
}: {
  offer: Offer;
  rank: number;
  cheapest: boolean;
}) {
  return (
    <a
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-start gap-3 rounded-2xl border p-4 transition ${
        cheapest
          ? "border-accent/40 bg-surface"
          : "border-line bg-surface hover:border-accent/30"
      }`}
    >
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-line text-[11px] font-bold text-muted nums">
        {faNumber(rank)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold">{offer.shopLabel}</span>
          {cheapest && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-ink">
              ارزان‌ترین
            </span>
          )}
          {offer.inStock === false && (
            <span className="rounded-full bg-danger-soft px-2 py-0.5 text-[10px] font-medium text-danger">
              ناموجود
            </span>
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted">
          {offer.title}
        </p>

        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted">
          {offer.storageGb ? (
            <span>حافظه {faNumber(offer.storageGb)} گیگ</span>
          ) : null}
          {offer.ramGb ? <span>رم {faNumber(offer.ramGb)} گیگ</span> : null}
          {offer.origin ? <span>{offer.origin}</span> : null}
          {offer.color ? <span>{offer.color}</span> : null}
        </div>
      </div>

      <div className="shrink-0 text-end">
        <p className="text-lg font-bold nums">{faNumber(offer.price)}</p>
        <p className="text-[10px] text-muted">تومان</p>
      </div>

      <ExternalIcon className="mt-1 size-4 shrink-0 text-muted transition group-hover:text-accent" />
    </a>
  );
}

export default function Home() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [storage, setStorage] = useState("");
  const [colorInput, setColorInput] = useState("");

  const [selectedShops, setSelectedShops] = useState<string[]>(
    SHOPS.map((shop) => shop.id),
  );
  const [slots, setSlots] = useState<CustomSlot[]>([
    { name: "", url: "" },
    { name: "", url: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PricesResponse | null>(null);
  const [colorFilter, setColorFilter] = useState("");

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    for (const offer of data?.offers ?? []) {
      const list = offer.colors ?? (offer.color ? [offer.color] : []);
      for (const color of list) colors.add(color);
    }
    return [...colors];
  }, [data]);

  const visibleOffers = useMemo(() => {
    const offers = data?.offers ?? [];
    if (!colorFilter) return offers;

    return offers.filter((offer) => {
      const list = offer.colors ?? (offer.color ? [offer.color] : []);
      if (!list.length) return true;
      return list.some((color) => color.includes(colorFilter));
    });
  }, [data, colorFilter]);

  const unknownColorCount = useMemo(() => {
    if (!colorFilter) return 0;
    return (data?.offers ?? []).filter((offer) => {
      const list = offer.colors ?? (offer.color ? [offer.color] : []);
      return list.length === 0;
    }).length;
  }, [data, colorFilter]);

  function toggleShop(id: string) {
    setSelectedShops((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function updateSlot(index: number, patch: Partial<CustomSlot>) {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, ...patch } : slot,
      ),
    );
  }

  function addSlot() {
    setSlots((current) =>
      current.length >= MAX_CUSTOM_SLOTS
        ? current
        : [...current, { name: "", url: "" }],
    );
  }

  function removeSlot(index: number) {
    setSlots((current) =>
      current.length === 1
        ? [{ name: "", url: "" }]
        : current.filter((_, slotIndex) => slotIndex !== index),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!model.trim()) {
      setError("مدل گوشی را وارد کنید.");
      return;
    }

    const customs = slots
      .map((slot) => ({ name: slot.name.trim(), url: slot.url.trim() }))
      .filter((slot) => slot.url.length > 0);

    if (!selectedShops.length && !customs.length) {
      setError("حداقل یک فروشگاه انتخاب کنید یا آدرس یک سایت را وارد کنید.");
      return;
    }

    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    params.set("model", model.trim());
    if (storage) params.set("storage", storage);
    if (colorInput.trim()) params.set("color", colorInput.trim());
    params.set("sites", selectedShops.join(","));
    for (const slot of customs) {
      params.append("custom", `${slot.name}|${slot.url}`);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/prices?${params.toString()}`);
      const body = await response.json();

      if (!response.ok) {
        setError(body?.error ?? "خطا در دریافت قیمت‌ها.");
        setData(null);
        return;
      }

      setData(body as PricesResponse);
      setColorFilter("");
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const brandLabel = findBrand(brand)?.label ?? "";
  const storageLabel = STORAGE_OPTIONS.find(
    (option) => option.value === String(data?.query.storageGb ?? ""),
  )?.label;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-ink">
              <StoreIcon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold leading-tight">
                مقایسه قیمت موبایل
              </p>
              <p className="text-[11px] text-muted">
                قیمت چند فروشگاه، یک صفحه
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-12">
        <section className="mb-6">
          <h1 className="text-2xl font-bold leading-relaxed md:text-3xl">
            ارزان‌ترین قیمت گوشی را پیدا کن
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            مدل را انتخاب کن؛ قیمت را زنده از فروشگاه‌های انتخابی می‌گیریم و
            کنار هم می‌چینیم.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-surface p-4 shadow-sm md:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="برند">
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className={CONTROL}
              >
                {BRANDS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="مدل">
                <input
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  placeholder="مثلاً iPhone 15 Pro یا Galaxy S24"
                  className={CONTROL}
                  autoComplete="off"
                  spellCheck={false}
                />
              </Field>
            </div>

            <Field label="حافظه داخلی">
              <select
                value={storage}
                onChange={(event) => setStorage(event.target.value)}
                className={CONTROL}
              >
                {STORAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="رنگ (اختیاری)">
              <input
                value={colorInput}
                onChange={(event) => setColorInput(event.target.value)}
                placeholder="مثلاً آبی"
                list="color-suggestions"
                className={CONTROL}
                autoComplete="off"
              />
              <datalist id="color-suggestions">
                {COLOR_SUGGESTIONS.map((color) => (
                  <option key={color} value={color} />
                ))}
              </datalist>
            </Field>
          </div>

          <fieldset className="mt-5 border-t border-line pt-4">
            <legend className="text-xs font-medium text-muted">
              فروشگاه‌ها
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SHOPS.map((shop) => {
                const active = selectedShops.includes(shop.id);
                return (
                  <label
                    key={shop.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                      active
                        ? "border-accent/40 bg-accent-soft"
                        : "border-line bg-surface-2 text-muted"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleShop(shop.id)}
                      className="size-4 accent-[var(--color-accent)]"
                    />
                    <span className="font-medium">{shop.label}</span>
                    <span className="text-[10px] text-muted" dir="ltr">
                      {shop.domain}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5 border-t border-line pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted">
                سایت دلخواه{" "}
                <span className="font-normal">
                  (آدرس می‌تواند شامل <code className="nums">{"{q}"}</code>{" "}
                  باشد)
                </span>
              </p>
              <button
                type="button"
                onClick={addSlot}
                disabled={slots.length >= MAX_CUSTOM_SLOTS}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-line px-2 py-1 text-[11px] text-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PlusIcon className="size-3.5" />
                افزودن
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {slots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={slot.name}
                    onChange={(event) =>
                      updateSlot(index, { name: event.target.value })
                    }
                    placeholder="نام سایت"
                    className={`${CONTROL} w-28 shrink-0 sm:w-36`}
                    autoComplete="off"
                  />
                  <input
                    value={slot.url}
                    onChange={(event) =>
                      updateSlot(index, { url: event.target.value })
                    }
                    placeholder="https://example.com/search?q={q}"
                    dir="ltr"
                    className={`${CONTROL} flex-1 text-left`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    aria-label="حذف سایت"
                    className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-line text-muted transition hover:text-danger"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition hover:opacity-90 disabled:cursor-wait disabled:opacity-50 sm:w-auto"
          >
            <SearchIcon className="size-4" />
            {loading ? "در حال گرفتن قیمت…" : "مقایسه قیمت"}
          </button>
        </form>

        <div className="mt-6" aria-live="polite">
          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {loading && <Skeleton />}

          {!loading && !data && !error && <IdleState />}

          {!loading && data && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                {brandLabel && (
                  <span className="rounded-full border border-line bg-surface px-2.5 py-1">
                    {brandLabel}
                  </span>
                )}
                <span className="rounded-full border border-line bg-surface px-2.5 py-1">
                  {data.query.model}
                </span>
                {data.query.storageGb && storageLabel && (
                  <span className="rounded-full border border-line bg-surface px-2.5 py-1">
                    {storageLabel}
                  </span>
                )}
                {data.query.color && (
                  <span className="rounded-full border border-line bg-surface px-2.5 py-1">
                    رنگ {data.query.color}
                  </span>
                )}
                <span className="ms-auto nums">
                  {formatTime(data.fetchedAt)} · آخرین به‌روزرسانی
                </span>
              </div>

              {data.floor ? (
                <section className="rounded-2xl border border-accent/30 bg-accent-soft p-5">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-accent">
                        کف بازار
                      </p>
                      <p className="mt-1 text-3xl font-bold nums">
                        {faNumber(data.floor.price)}{" "}
                        <span className="text-sm font-medium">تومان</span>
                      </p>
                      <p className="mt-1 truncate text-xs text-muted">
                        {data.floor.shopLabel} · {data.floor.title}
                      </p>
                    </div>
                    <a
                      href={data.floor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-accent px-3 py-2 text-xs font-bold text-accent-ink transition hover:opacity-90"
                    >
                      مشاهده
                      <ExternalIcon className="size-3.5" />
                    </a>
                  </div>
                </section>
              ) : (
                <div className="flex items-start gap-2 rounded-2xl border border-warn/30 bg-warn-soft p-4 text-sm text-warn">
                  <AlertIcon className="mt-0.5 size-4 shrink-0" />
                  <p>قیمتی برای این مشخصات در فروشگاه‌های انتخابی پیدا نشد.</p>
                </div>
              )}

              {allColors.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">رنگ:</span>
                  <button
                    type="button"
                    onClick={() => setColorFilter("")}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-[11px] transition ${
                      colorFilter === ""
                        ? "border-accent bg-accent-soft text-ink"
                        : "border-line bg-surface text-muted hover:text-ink"
                    }`}
                  >
                    همه
                  </button>
                  {allColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setColorFilter(color)}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-[11px] transition ${
                        colorFilter === color
                          ? "border-accent bg-accent-soft text-ink"
                          : "border-line bg-surface text-muted hover:text-ink"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              )}

              {visibleOffers.length ? (
                <div className="space-y-2">
                  {visibleOffers.map((offer, index) => (
                    <OfferRow
                      key={`${offer.shopId}-${offer.url}-${offer.price}`}
                      offer={offer}
                      rank={index + 1}
                      cheapest={sameOffer(offer, data.floor)}
                    />
                  ))}
                </div>
              ) : data.offers.length ? (
                <div className="rounded-2xl border border-line bg-surface p-6 text-center">
                  <p className="text-sm font-medium">
                    برای رنگ «{colorFilter}» نتیجه‌ای پیدا نشد.
                  </p>
                  <button
                    type="button"
                    onClick={() => setColorFilter("")}
                    className="mt-2 cursor-pointer text-xs text-accent underline"
                  >
                    نمایش همهٔ رنگ‌ها
                  </button>
                </div>
              ) : null}

              {unknownColorCount > 0 && (
                <p className="text-[11px] text-muted">
                  {faNumber(unknownColorCount)} نتیجه رنگش مشخص نبود و بدون
                  فیلتر نشان داده می‌شود.
                </p>
              )}

              {data.shops
                .filter((shop) => shop.status !== "ok")
                .map((shop) => (
                  <div
                    key={shop.id}
                    className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${
                      shop.status === "error"
                        ? "border-danger/30 bg-danger-soft text-danger"
                        : "border-line bg-surface-2 text-muted"
                    }`}
                  >
                    <AlertIcon className="mt-0.5 size-4 shrink-0" />
                    <p>
                      <span className="font-bold">{shop.label}:</span>{" "}
                      {shop.status === "error"
                        ? (shop.message ?? "خطا در دریافت قیمت")
                        : "قیمتی برای این مشخصات پیدا نشد."}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-4 py-6 text-[11px] leading-6 text-muted">
          <p>
            قیمت‌ها زنده از صفحهٔ فروشگاه‌ها خوانده می‌شوند و ممکن است با لحظهٔ
            خرید متفاوت باشند. این سایت فروشنده نیست و سفارشی ثبت نمی‌کند.
          </p>
          <p className="mt-1">
            برای سایت دلخواه، آدرسی بدهید که قیمت در آن قابل خواندن باشد؛
            استفاده از <code className="nums">{"{q}"}</code> در آدرس، عبارت
            جست‌وجو را جایگزین می‌کند.
          </p>
        </div>
      </footer>
    </div>
  );
}
