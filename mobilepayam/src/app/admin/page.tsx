"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  addCategory,
  addProduct,
  deleteCategory,
  deleteProduct,
  lockAdmin,
  resetCatalog,
  updateOrderStatus,
  updateProduct,
  useAdminUnlocked,
  useCatalog,
  useOrders,
} from "@/lib/store";
import { minPrice, totalStock } from "@/data/catalog";
import { faNum, orderDate } from "@/lib/format";
import type { Category, IconKey, OrderStatus, Product } from "@/lib/types";
import { ProductArt } from "@/components/product-art";
import { AdminGate } from "@/components/admin-gate";
import { AdminUsed } from "@/components/admin-used";
import { container, card, input, label, btnPrimary, btnGhost } from "@/lib/ui";

const ICONS: { id: IconKey; label: string }[] = [
  { id: "phone", label: "موبایل" },
  { id: "watch", label: "ساعت" },
  { id: "earbuds", label: "هدفون" },
  { id: "charger", label: "شارژر" },
  { id: "cable", label: "کابل" },
  { id: "powerbank", label: "پاوربانک" },
  { id: "case", label: "قاب" },
  { id: "protector", label: "گلس" },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار پردازش",
  paid: "پرداخت شده",
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  canceled: "لغو شده",
};

type Form = {
  id?: string;
  name: string;
  brand: string;
  categoryId: string;
  price: string;
  stock: string;
  badge: string;
  description: string;
  icon: IconKey;
  image: string;
};

export default function AdminPage() {
  const { products, categories } = useCatalog();
  const orders = useOrders();
  const unlocked = useAdminUnlocked();
  const [tab, setTab] = useState<"products" | "orders" | "categories" | "used">(
    "products",
  );
  const [form, setForm] = useState<Form | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "phone" as IconKey });
  const [notice, setNotice] = useState("");

  const stats = useMemo(
    () => ({
      products: products.length,
      orders: orders.length,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      lowStock: products.filter((product) => totalStock(product) <= 3).length,
    }),
    [products, orders],
  );

  if (!unlocked) return <AdminGate />;

  const openAdd = () =>
    setForm({
      name: "",
      brand: "",
      categoryId: categories[0]?.id ?? "mobile",
      price: "",
      stock: "",
      badge: "",
      description: "",
      icon: "phone",
      image: "",
    });

  const openEdit = (product: Product) => {
    // Keep the edit form and saveProduct on the same variant: both use [0].
    const variant = product.variants[0];
    setForm({
      id: product.id,
      name: product.name,
      brand: product.brand,
      categoryId: product.categoryId,
      price: String(variant.price),
      stock: String(variant.stock),
      badge: product.badge ?? "",
      description: product.description,
      icon: product.icon,
      image: product.image ?? "",
    });
  };

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const saveProduct = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;

    const price = Number(form.price);
    const stock = Number(form.stock);
    if (form.name.trim().length < 3) return flash("نام محصول را کامل وارد کنید.");
    if (form.brand.trim().length < 2) return flash("برند را وارد کنید.");
    if (!Number.isInteger(price) || price <= 0)
      return flash("قیمت باید عدد صحیح و بزرگ‌تر از صفر باشد.");
    if (!Number.isInteger(stock) || stock < 0)
      return flash("موجودی باید عدد صحیح و صفر یا بیشتر باشد.");

    if (form.id) {
      const existing = products.find((product) => product.id === form.id);
      if (!existing) return;
      const firstVariant = existing.variants[0];
      const updated: Product = {
        ...existing,
        name: form.name.trim(),
        brand: form.brand.trim(),
        categoryId: form.categoryId,
        description: form.description.trim(),
        badge: form.badge.trim() || undefined,
        icon: form.icon,
        image: form.image.trim() || undefined,
        variants: [
          { ...firstVariant, price, stock: Math.max(0, stock) },
          ...existing.variants.slice(1),
        ],
      };
      updateProduct(updated);
      flash("محصول ویرایش شد.");
    } else {
      const id = `p-${Date.now().toString(36)}`;
      const created: Product = {
        id,
        slug: `custom-${Date.now().toString(36)}`,
        name: form.name.trim(),
        brand: form.brand.trim(),
        categoryId: form.categoryId,
        icon: form.icon,
        image: form.image.trim() || undefined,
        description: form.description.trim() || "توضیحی برای این محصول ثبت نشده است.",
        rating: 0,
        reviews: 0,
        badge: form.badge.trim() || undefined,
        specs: [],
        variants: [
          { id: "default", price, stock: Math.max(0, stock) },
        ],
        createdAt: new Date().toISOString(),
      };
      addProduct(created);
      flash("محصول اضافه شد.");
    }
    setForm(null);
  };

  const removeProduct = (product: Product) => {
    if (!window.confirm(`«${product.name}» حذف شود؟`)) return;
    deleteProduct(product.id);
    flash("محصول حذف شد.");
  };

  const addNewCategory = (event: React.FormEvent) => {
    event.preventDefault();
    if (newCategory.name.trim().length < 2) return flash("نام دسته را وارد کنید.");
    const slug = `cat-${Date.now().toString(36)}`;
    const category: Category = {
      id: slug,
      slug,
      name: newCategory.name.trim(),
      icon: newCategory.icon,
    };
    addCategory(category);
    setNewCategory({ name: "", icon: "phone" });
    flash("دسته‌بندی اضافه شد.");
  };

  return (
    <main className={`${container} pb-10`}>
      <div className="flex flex-wrap items-end justify-between gap-2 py-4">
        <div>
          <span className="text-[11px] font-bold text-brand">پنل مدیریت</span>
          <h1 className="text-lg font-extrabold text-ink-strong">مدیریت فروشگاه</h1>
          <p className="mt-1 text-[10.5px] text-muted">
            تغییرات در همین مرورگر ذخیره می‌شوند و بلافاصله در فروشگاه دیده می‌شوند.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={lockAdmin}
            className={`${btnGhost} h-9 px-3 text-[11px]`}
          >
            قفل پنل
          </button>
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("همهٔ تغییرات پاک و دادهٔ اولیه بازگردانی شود؟")) return;
              resetCatalog();
              flash("دادهٔ فروشگاه بازنشانی شد.");
            }}
            className={`${btnGhost} h-9 px-3 text-[11px]`}
          >
            بازنشانی داده
          </button>
          <button type="button" onClick={openAdd} className={`${btnPrimary} h-9 px-3 text-[11px]`}>
            + افزودن محصول
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className={`${card} px-4 py-3`}>
          <span className="text-[10.5px] text-muted">کل محصولات</span>
          <b className="block text-lg font-extrabold text-ink-strong">
            {faNum(stats.products)}
          </b>
        </div>
        <div className={`${card} px-4 py-3`}>
          <span className="text-[10.5px] text-muted">سفارش‌ها</span>
          <b className="block text-lg font-extrabold text-ink-strong">
            {faNum(stats.orders)}
          </b>
        </div>
        <div className={`${card} px-4 py-3`}>
          <span className="text-[10.5px] text-muted">مجموع فروش</span>
          <b className="block text-base font-extrabold text-ink-strong">
            {faNum(stats.revenue)}
            <span className="text-[9.5px] font-normal text-muted"> تومان</span>
          </b>
        </div>
        <div className={`${card} px-4 py-3`}>
          <span className="text-[10.5px] text-muted">موجودی کم</span>
          <b className="block text-lg font-extrabold text-warning">
            {faNum(stats.lowStock)}
          </b>
        </div>
      </div>

      {notice ? (
        <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-[11px] font-bold text-success">
          {notice}
        </p>
      ) : null}

      <div className="mt-3 flex gap-1 rounded-lg border border-line bg-surface p-1">
        {(
          [
            ["products", "محصولات"],
            ["used", "کارکرده‌ها"],
            ["orders", "سفارش‌ها"],
            ["categories", "دسته‌بندی‌ها"],
          ] as const
        ).map(([id, name]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-bold transition-colors ${
              tab === id ? "bg-brand text-white" : "text-ink hover:bg-canvas"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {tab === "products" ? (
        <div className={`${card} mt-3 overflow-x-auto p-3`}>
          <table className="w-full min-w-[640px] border-collapse text-[11.5px]">
            <thead>
              <tr className="text-muted">
                <th className="px-2 py-2 text-right font-medium">محصول</th>
                <th className="px-2 py-2 text-right font-medium">دسته</th>
                <th className="px-2 py-2 text-right font-medium">برند</th>
                <th className="px-2 py-2 text-right font-medium">قیمت</th>
                <th className="px-2 py-2 text-right font-medium">موجودی</th>
                <th className="px-2 py-2 text-right font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-line">
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface">
                        <ProductArt icon={product.icon} className="h-6 w-auto text-[#4a4c6d]" />
                      </span>
                      <b className="font-semibold text-ink-strong">{product.name}</b>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-muted">
                    {categories.find((category) => category.id === product.categoryId)?.name ?? "—"}
                  </td>
                  <td className="px-2 py-2 text-muted">{product.brand}</td>
                  <td className="px-2 py-2 text-ink-strong">{faNum(minPrice(product))}</td>
                  <td className="px-2 py-2">
                    <span
                      className={
                        totalStock(product) <= 3 ? "font-bold text-warning" : "text-ink"
                      }
                    >
                      {faNum(totalStock(product))}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="rounded-md border border-line px-2 py-1 text-[10.5px] font-bold text-ink hover:border-brand hover:text-brand"
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(product)}
                        className="rounded-md border border-line px-2 py-1 text-[10.5px] font-bold text-brand hover:border-brand"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    محصولی وجود ندارد؛ از دکمهٔ «افزودن محصول» استفاده کنید.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "used" ? <AdminUsed /> : null}

      {tab === "orders" ? (
        <div className={`${card} mt-3 overflow-x-auto p-3`}>
          <table className="w-full min-w-[680px] border-collapse text-[11.5px]">
            <thead>
              <tr className="text-muted">
                <th className="px-2 py-2 text-right font-medium">شماره</th>
                <th className="px-2 py-2 text-right font-medium">مشتری</th>
                <th className="px-2 py-2 text-right font-medium">تاریخ</th>
                <th className="px-2 py-2 text-right font-medium">مبلغ</th>
                <th className="px-2 py-2 text-right font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-line">
                  <td dir="ltr" className="px-2 py-2 text-right font-mono text-ink-strong">
                    {order.code}
                  </td>
                  <td className="px-2 py-2">
                    <b className="block text-ink-strong">{order.customer.name}</b>
                    <span dir="ltr" className="block text-[10px] text-muted">
                      {order.customer.phone}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-muted">{orderDate(order.createdAt)}</td>
                  <td className="px-2 py-2 text-ink-strong">{faNum(order.total)}</td>
                  <td className="px-2 py-2">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value as OrderStatus)
                      }
                      className="h-8 rounded-md border border-line-strong bg-surface px-2 text-[10.5px] outline-none focus:border-brand"
                    >
                      {Object.entries(STATUS_LABELS).map(([value, text]) => (
                        <option key={value} value={value}>
                          {text}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    سفارشی ثبت نشده است.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "categories" ? (
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_320px]">
          <div className={`${card} p-3`}>
            <table className="w-full border-collapse text-[11.5px]">
              <tbody>
                {categories.map((category) => {
                  const count = products.filter(
                    (product) => product.categoryId === category.id,
                  ).length;
                  return (
                    <tr key={category.id} className="border-b border-line last:border-b-0">
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <ProductArt icon={category.icon} className="h-6 w-auto text-[#4a4c6d]" />
                          <b className="font-semibold text-ink-strong">{category.name}</b>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-muted">{faNum(count)} کالا</td>
                      <td className="px-2 py-2 text-left">
                        <button
                          type="button"
                          onClick={() => {
                            if (count > 0) {
                              flash("این دسته محصول دارد؛ ابتدا محصولات را جابه‌جا کنید.");
                              return;
                            }
                            if (deleteCategory(category.id)) flash("دسته حذف شد.");
                          }}
                          className="rounded-md border border-line px-2 py-1 text-[10.5px] font-bold text-brand"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <form onSubmit={addNewCategory} className={`${card} h-fit p-4`}>
            <b className="mb-3 block text-sm font-extrabold text-ink-strong">
              افزودن دسته‌بندی
            </b>
            <label className={label}>
              نام دسته
              <input
                value={newCategory.name}
                onChange={(event) =>
                  setNewCategory((current) => ({ ...current, name: event.target.value }))
                }
                className={input}
                placeholder="مثلاً لوازم گیمینگ"
              />
            </label>
            <label className={`${label} mt-3`}>
              آیکن
              <select
                value={newCategory.icon}
                onChange={(event) =>
                  setNewCategory((current) => ({
                    ...current,
                    icon: event.target.value as IconKey,
                  }))
                }
                className={input}
              >
                {ICONS.map((icon) => (
                  <option key={icon.id} value={icon.id}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className={`${btnPrimary} mt-4 w-full`}>
              افزودن
            </button>
          </form>
        </div>
      ) : null}

      {form ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-strong/40 p-4">
          <form
            onSubmit={saveProduct}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card border border-line bg-surface p-5"
          >
            <div className="flex items-center justify-between border-b border-line pb-2">
              <b className="text-sm font-extrabold text-ink-strong">
                {form.id ? "ویرایش محصول" : "افزودن محصول"}
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
              <label className={label}>
                نام محصول
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, name: event.target.value })
                  }
                  className={input}
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
                />
              </label>
              <label className={label}>
                دسته‌بندی
                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm(
                      (current) => current && { ...current, categoryId: event.target.value },
                    )
                  }
                  className={input}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
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
                موجودی
                <input
                  value={form.stock}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, stock: event.target.value })
                  }
                  inputMode="numeric"
                  dir="ltr"
                  className={`${input} text-left`}
                />
              </label>
              <label className={label}>
                برچسب (اختیاری)
                <input
                  value={form.badge}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, badge: event.target.value })
                  }
                  className={input}
                  placeholder="پرفروش، جدید…"
                />
              </label>
              <label className={label}>
                آیکن
                <select
                  value={form.icon}
                  onChange={(event) =>
                    setForm(
                      (current) =>
                        current && { ...current, icon: event.target.value as IconKey },
                    )
                  }
                  className={input}
                >
                  {ICONS.map((icon) => (
                    <option key={icon.id} value={icon.id}>
                      {icon.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={label}>
                آدرس تصویر (اختیاری)
                <input
                  value={form.image}
                  onChange={(event) =>
                    setForm((current) => current && { ...current, image: event.target.value })
                  }
                  dir="ltr"
                  className={`${input} text-left`}
                  placeholder="/images/products/…png"
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                توضیح کوتاه
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm(
                      (current) => current && { ...current, description: event.target.value },
                    )
                  }
                  rows={2}
                  className="min-h-20 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink-strong outline-none focus:border-brand"
                />
              </label>
            </div>

            {form.id ? (
              <p className="mt-3 rounded-lg bg-canvas px-3 py-2 text-[10.5px] text-muted">
                قیمت و موجودی روی تنوع اول محصول اعمال می‌شود؛ سایر تنوع‌ها حفظ می‌شوند.
              </p>
            ) : null}

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

      <p className="mt-4 text-center text-[10.5px] text-muted">
        نسخهٔ نمایشی بدون احراز هویت —{" "}
        <Link href="/" className="text-brand">
          بازگشت به فروشگاه
        </Link>
      </p>
    </main>
  );
}
