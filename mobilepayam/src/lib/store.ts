"use client";

import { useSyncExternalStore } from "react";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { USED_LISTINGS } from "@/data/used";
import type { Category, Order, OrderItem, Product, UsedListing } from "@/lib/types";

const CATALOG_KEY = "mobilepayam.catalog.v1";
const ORDERS_KEY = "mobilepayam.orders.v1";
const USER_KEY = "mobilepayam.user.v1";
const COUPON_KEY = "mobilepayam.coupon.v1";
const ADMIN_KEY = "mobilepayam.admin.v1";
const USED_KEY = "mobilepayam.used.v2";

/**
 * Demo-only gate for /admin. This is NOT security: it runs in the browser and
 * anyone can bypass it. See PROGRESS.md — real auth must be added with the
 * backend (server-side session + role check on every mutation).
 */
export const ADMIN_DEMO_CODE = "1234";

export type Catalog = { products: Product[]; categories: Category[] };
export type User = { name: string; phone: string };
export type Coupon = { code: string; percent: number };

const SEED_CATALOG: Catalog = { products: PRODUCTS, categories: CATEGORIES };

const SEED_ORDERS: Order[] = [
  {
    id: "o-seed-1",
    code: "MP-10482",
    createdAt: "2026-11-02T10:00:00.000Z",
    customer: {
      name: "امیر پاکزاد",
      phone: "09123456789",
      province: "تهران",
      city: "تهران",
      address: "خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۱۲، واحد ۴",
      postalCode: "1968743211",
    },
    items: [
      {
        productId: "p-iphone-16-pro-max",
        variantId: "256-black",
        name: "آیفون ۱۶ پرو مکس",
        variantLabel: "۲۵۶ گیگابایت · تیتانیوم مشکی",
        price: 96_500_000,
        qty: 1,
      },
    ],
    shipping: { method: "پیک همان روز — تهران", price: 0 },
    payment: { method: "gateway", status: "paid" },
    subtotal: 96_500_000,
    total: 96_500_000,
    status: "shipped",
  },
  {
    id: "o-seed-2",
    code: "MP-10310",
    createdAt: "2026-09-23T09:30:00.000Z",
    customer: {
      name: "امیر پاکزاد",
      phone: "09123456789",
      province: "تهران",
      city: "تهران",
      address: "خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۱۲، واحد ۴",
      postalCode: "1968743211",
    },
    items: [
      {
        productId: "p-xiaomi-20000",
        variantId: "black",
        name: "پاوربانک ۲۰۰۰۰ شیائومی",
        variantLabel: "مشکی",
        price: 3_200_000,
        qty: 1,
      },
    ],
    shipping: { method: "تیپاکس — شهرستان", price: 0 },
    payment: { method: "sheba", status: "paid" },
    subtotal: 3_200_000,
    total: 3_200_000,
    status: "processing",
  },
];

function readStored<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function createStore<T>(key: string, seedValue: T) {
  let current: T | null = null;
  const listeners = new Set<() => void>();

  const get = (): T => {
    if (typeof window === "undefined") return seedValue;
    if (current === null) current = readStored<T>(key) ?? seedValue;
    return current;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const set = (next: T) => {
    current = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Quota or private mode: keep the in-memory value so the UI still works.
    }
    listeners.forEach((listener) => listener());
  };

  return { get, subscribe, set, getServer: () => seedValue };
}

const catalogStore = createStore<Catalog>(CATALOG_KEY, SEED_CATALOG);
const ordersStore = createStore<Order[]>(ORDERS_KEY, SEED_ORDERS);
const userStore = createStore<User | null>(USER_KEY, null);
const couponStore = createStore<Coupon | null>(COUPON_KEY, null);
const adminStore = createStore<boolean>(ADMIN_KEY, false);
const usedStore = createStore<UsedListing[]>(USED_KEY, USED_LISTINGS);

/* ── hooks ─────────────────────────────────────────────────── */

export function useCatalog(): Catalog {
  return useSyncExternalStore(
    catalogStore.subscribe,
    catalogStore.get,
    catalogStore.getServer,
  );
}

export function useOrders(): Order[] {
  return useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.get,
    ordersStore.getServer,
  );
}

export function useUser(): User | null {
  return useSyncExternalStore(
    userStore.subscribe,
    userStore.get,
    userStore.getServer,
  );
}

export function useCoupon(): Coupon | null {
  return useSyncExternalStore(
    couponStore.subscribe,
    couponStore.get,
    couponStore.getServer,
  );
}

export function useAdminUnlocked(): boolean {
  return useSyncExternalStore(
    adminStore.subscribe,
    adminStore.get,
    adminStore.getServer,
  );
}

export function useUsedListings(): UsedListing[] {
  return useSyncExternalStore(
    usedStore.subscribe,
    usedStore.get,
    usedStore.getServer,
  );
}

/* ── non-hook reads (event handlers, calculations) ─────────── */

export function getCatalogValue(): Catalog {
  return catalogStore.get();
}

export function getOrdersValue(): Order[] {
  return ordersStore.get();
}

/* ── catalog mutations ─────────────────────────────────────── */

export function addProduct(product: Product) {
  const catalog = catalogStore.get();
  catalogStore.set({ ...catalog, products: [product, ...catalog.products] });
}

export function updateProduct(product: Product) {
  const catalog = catalogStore.get();
  catalogStore.set({
    ...catalog,
    products: catalog.products.map((item) =>
      item.id === product.id ? product : item,
    ),
  });
}

export function deleteProduct(id: string) {
  const catalog = catalogStore.get();
  catalogStore.set({
    ...catalog,
    products: catalog.products.filter((item) => item.id !== id),
  });
}

export function addCategory(category: Category) {
  const catalog = catalogStore.get();
  catalogStore.set({
    ...catalog,
    categories: [...catalog.categories, category],
  });
}

export function deleteCategory(id: string): boolean {
  const catalog = catalogStore.get();
  if (catalog.products.some((product) => product.categoryId === id)) {
    return false;
  }
  catalogStore.set({
    ...catalog,
    categories: catalog.categories.filter((category) => category.id !== id),
  });
  return true;
}

export function resetCatalog() {
  catalogStore.set(SEED_CATALOG);
  ordersStore.set(SEED_ORDERS);
  couponStore.set(null);
  usedStore.set(USED_LISTINGS);
}

/* ── used phones ───────────────────────────────────────────── */

export function addUsedListing(listing: UsedListing) {
  usedStore.set([listing, ...usedStore.get()]);
}

export function updateUsedListing(listing: UsedListing) {
  usedStore.set(
    usedStore.get().map((item) => (item.id === listing.id ? listing : item)),
  );
}

export function deleteUsedListing(id: string) {
  usedStore.set(usedStore.get().filter((item) => item.id !== id));
}

/* ── orders ────────────────────────────────────────────────── */

export function placeOrder(order: Order) {
  ordersStore.set([order, ...ordersStore.get()]);
}

export function updateOrderStatus(id: string, status: Order["status"]) {
  ordersStore.set(
    ordersStore.get().map((order) =>
      order.id === id ? { ...order, status } : order,
    ),
  );
}

export function orderItemsFor(
  items: OrderItem[],
): { name: string; qty: number; price: number }[] {
  return items.map((item) => ({
    name: item.name,
    qty: item.qty,
    price: item.price,
  }));
}

/* ── user & coupon ─────────────────────────────────────────── */

export function signIn(user: User) {
  userStore.set(user);
}

export function signOut() {
  userStore.set(null);
}

const COUPONS: Record<string, number> = { PAYAM10: 10, NOWRUZ15: 15 };

export function applyCoupon(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  const percent = COUPONS[normalized];
  if (!percent) return false;
  couponStore.set({ code: normalized, percent });
  return true;
}

export function clearCoupon() {
  couponStore.set(null);
}

/* ── admin demo gate (not security) ───────────────────────── */

export function unlockAdmin(code: string): boolean {
  if (code.trim() !== ADMIN_DEMO_CODE) return false;
  adminStore.set(true);
  return true;
}

export function lockAdmin() {
  adminStore.set(false);
}
