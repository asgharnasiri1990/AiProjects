"use client";

import Link from "next/link";
import { useCatalog } from "@/lib/store";
import { faNum } from "@/lib/format";
import { ProductArt } from "@/components/product-art";
import { container, card } from "@/lib/ui";

export function CategoriesView() {
  const { categories, products } = useCatalog();

  return (
    <main className={`${container} pb-10`}>
      <h1 className="py-4 text-lg font-extrabold text-ink-strong">دسته‌بندی‌ها</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const items = products.filter(
            (product) => product.categoryId === category.id,
          );
          return (
            <Link
              key={category.id}
              href={`/shop?cat=${category.id}`}
              className={`${card} group flex flex-col items-center gap-2 p-5 text-center transition-shadow hover:shadow-[0_10px_24px_-18px_rgba(35,36,63,0.45)]`}
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-canvas text-[#5b5d7e] transition-colors group-hover:bg-brand-soft group-hover:text-brand">
                <ProductArt icon={category.icon} className="h-9 w-auto" />
              </span>
              <b className="text-sm font-bold text-ink-strong">{category.name}</b>
              <span className="text-[11px] text-muted">
                {faNum(items.length)} کالا
              </span>
              {items.length > 0 ? (
                <span className="mt-1 line-clamp-1 text-[10.5px] text-muted">
                  {items.slice(0, 2).map((item) => item.name).join(" · ")}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
