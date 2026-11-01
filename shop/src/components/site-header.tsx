"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import {
  CartIcon,
  ChevronDownIcon,
  HeartIcon,
  LogoutIcon,
  MenuIcon,
  PackageIcon,
  ShoppingBagIcon,
  UserIcon,
  XIcon,
} from "@/components/icons";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClasses } from "@/components/ui/button";
import { useFavorites } from "@/context/favorites-context";

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm shadow-primary-600/30">
        <ShoppingBagIcon width={18} height={18} />
      </span>
      <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
        Digital<span className="text-primary-600 dark:text-primary-400">Shop</span>
      </span>
    </Link>
  );
}

function CartLink() {
  const { totalItems } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-primary-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      <CartIcon />
      {totalItems > 0 && (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-bold text-white"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}

function FavoritesLink() {
  const { count } = useFavorites();
  return (
    <Link
      href="/favorites"
      aria-label={`Saved items, ${count}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-primary-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      <HeartIcon
        className={count > 0 ? "fill-accent-500 text-accent-600 dark:text-accent-500" : ""}
      />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-[11px] font-bold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setOpen(false);
      router.push("/shop");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
          <UserIcon width={15} height={15} />
        </span>
        <span className="hidden max-w-28 truncate sm:block">{user.username}</span>
        <ChevronDownIcon
          width={14}
          height={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="border-b border-zinc-100 px-3.5 py-2.5 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {user.username}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Signed in</p>
          </div>
          <Link
            role="menuitem"
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <PackageIcon width={16} height={16} /> My orders
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            <LogoutIcon width={16} height={16} /> {loggingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile menu on navigation.
  useEffect(() => setMobileOpen(false), [pathname]);

  const shopActive = pathname?.startsWith("/shop");

  const navLinks = (
    <>
      <Link
        href="/shop"
        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
          shopActive
            ? "text-primary-700 dark:text-primary-300"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
      >
        Shop
      </Link>
    </>
  );

  const authArea = user ? (
    <UserMenu />
  ) : (
    <div className="flex items-center gap-2">
      <Link href="/login" className={buttonClasses("ghost", "sm")}>
        Log in
      </Link>
      <Link href="/signup" className={buttonClasses("primary", "sm")}>
        Sign up
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-primary-200/60 bg-canvas/85 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {navLinks}
          </nav>

          {/* Search lives in the bar on large screens… */}
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <Suspense fallback={<div className="h-11 w-full max-w-xl rounded-full bg-primary-100/70 dark:bg-white/10" />}>
              <SearchBar className="w-full max-w-xl" />
            </Suspense>
          </div>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <ThemeToggle />
            <FavoritesLink />
            <CartLink />
            <div className="hidden md:block">{authArea}</div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-primary-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* …and in its own row below it on small screens. */}
        <div className="pb-3 lg:hidden">
          <Suspense fallback={<div className="h-11 w-full rounded-full bg-primary-100/70 dark:bg-white/10" />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-primary-200/60 bg-canvas px-4 pb-4 pt-2 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {navLinks}
          </nav>
          <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">{authArea}</div>
        </div>
      )}
    </header>
  );
}
