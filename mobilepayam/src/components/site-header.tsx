"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCatalog } from "@/lib/store";
import { useCartCount } from "@/lib/cart";

const NAV = [
  { href: "/", label: "خانه" },
  { href: "/shop", label: "فروشگاه" },
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
];

const SUBS: Record<string, string[]> = {
  mobile: ["Apple", "Samsung", "Xiaomi", "Google"],
  watch: ["Apple", "Samsung", "Xiaomi", "Huawei"],
  audio: ["Apple", "Samsung", "JBL", "Sony"],
  power: ["Anker", "Apple", "Baseus"],
  bank: ["Xiaomi", "Anker", "Baseus"],
  cover: ["Apple", "Samsung", "Green Lion"],
};

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "search" | "user" | "cart" | "menu" | "chevron";
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  if (name === "search")
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20.5 20.5-4-4" />
      </svg>
    );
  if (name === "user")
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <circle cx="12" cy="8.5" r="3.8" />
        <path d="M4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5" />
      </svg>
    );
  if (name === "cart")
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6" />
        <circle cx="10" cy="20" r="1.3" />
        <circle cx="18" cy="20" r="1.3" />
      </svg>
    );
  if (name === "chevron")
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="m7 10 5 5 5-5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { categories } = useCatalog();
  const cartCount = useCartCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(categories[0]?.id ?? "mobile");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const subs = SUBS[activeCat] ?? [];
  const activeCategory = categories.find((item) => item.id === activeCat);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="bg-brand py-1 text-center text-[11px] text-white">
        ارسال رایگان برای سفارش‌های بالای ۵ میلیون تومان — ضمانت اصالت کالا
      </div>

      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-3 px-4 py-2.5">
        <Link
          href="/"
          dir="ltr"
          className="shrink-0 rounded-lg bg-brand px-3 py-1.5 text-[15px] font-black text-white sm:text-base"
          aria-label="mobilepayam — خانه"
        >
          mobilepayam.
        </Link>

        <form action="/shop" className="relative hidden flex-1 sm:block md:max-w-[560px]">
          <input
            type="search"
            name="q"
            placeholder="جستجوی محصول…"
            aria-label="جستجوی محصول"
            className="h-10 w-full rounded-lg border border-transparent bg-canvas px-10 text-sm text-ink-strong outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
            <Icon name="search" className="h-4.5 w-4.5" />
          </span>
        </form>

        <div className="mr-auto flex items-center gap-1">
          <Link
            href="/account"
            className="grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-canvas hover:text-brand"
            aria-label="حساب کاربری"
          >
            <Icon name="user" />
          </Link>
          <Link
            href="/cart"
            className="relative flex h-10 items-center gap-2 rounded-lg border border-line-strong px-2.5 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <Icon name="cart" />
            <span className="hidden sm:inline">سبد خرید</span>
            <b className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] text-white">
              {cartCount.toLocaleString("fa-IR")}
            </b>
          </Link>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center gap-1 px-4 py-1.5">
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mega-menu"
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold transition-colors ${
                menuOpen ? "bg-brand-soft text-brand" : "text-ink-strong hover:bg-canvas"
              }`}
            >
              <Icon name="menu" className="h-4.5 w-4.5" />
              دسته‌بندی محصولات
              <Icon
                name="chevron"
                className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen ? (
              <div
                id="mega-menu"
                className="absolute right-0 top-full z-50 mt-1 grid w-[min(560px,92vw)] grid-cols-1 overflow-hidden rounded-lg border border-line bg-surface shadow-[0_24px_48px_-24px_rgba(35,36,63,0.35)] md:grid-cols-[220px_1fr]"
              >
                <ul className="max-h-80 overflow-auto border-l border-line p-1.5 scroll-thin">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/shop?cat=${category.id}`}
                        onMouseEnter={() => setActiveCat(category.id)}
                        onFocus={() => setActiveCat(category.id)}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-xs transition-colors ${
                          activeCat === category.id
                            ? "bg-brand-soft font-bold text-brand"
                            : "text-ink hover:bg-canvas"
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="hidden p-4 md:block">
                  <b className="mb-3 block text-sm font-extrabold text-ink-strong">
                    {activeCategory?.name}
                  </b>
                  <div className="flex flex-wrap gap-2">
                    {subs.map((brand) => (
                      <Link
                        key={brand}
                        href={`/shop?cat=${activeCat}&brand=${brand}`}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-md bg-canvas px-2.5 py-1 text-[11.5px] text-[#5b5d7e] transition-colors hover:bg-brand-soft hover:text-brand"
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/shop?cat=${activeCat}`}
                    onClick={() => setMenuOpen(false)}
                    className="mt-4 inline-block text-xs font-bold text-brand"
                  >
                    همهٔ {activeCategory?.name}
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          <nav className="flex items-center gap-0.5">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    active
                      ? "font-bold text-brand"
                      : "text-[#61638a] hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/shop"
              className="hidden whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#61638a] hover:text-brand sm:inline"
            >
              پیشنهاد شگفت‌انگیز
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
