"use client";

import { useSyncExternalStore } from "react";
import { getCatalogValue, useCatalog } from "@/lib/store";
import { MAX_ITEM_QUANTITY } from "@/lib/format";
import type { CartLine, Product, Variant } from "@/lib/types";

const CART_KEY = "mobilepayam.cart.v1";
const SEED: CartLine[] = [];

let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

function get(): CartLine[] {
  if (typeof window === "undefined") return SEED;
  if (lines === null) lines = read();
  return lines;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function set(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors; keep the in-memory cart
  }
  listeners.forEach((listener) => listener());
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, get, () => SEED);
}

export type ResolvedLine = {
  line: CartLine;
  product: Product;
  variant: Variant;
};

export function useResolvedCart(): {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
} {
  const cart = useCart();
  const { products } = useCatalog();

  const resolved: ResolvedLine[] = [];
  for (const line of cart) {
    const product = products.find((item) => item.id === line.productId);
    const variant = product?.variants.find((item) => item.id === line.variantId);
    if (product && variant) resolved.push({ line, product, variant });
  }

  return {
    lines: resolved,
    count: resolved.reduce((sum, item) => sum + item.line.qty, 0),
    subtotal: resolved.reduce(
      (sum, item) => sum + item.variant.price * item.line.qty,
      0,
    ),
  };
}

export function useCartCount(): number {
  const { count } = useResolvedCart();
  return count;
}

export function addToCart(productId: string, variantId: string, qty = 1) {
  const catalog = getCatalogValue();
  const product = catalog.products.find((item) => item.id === productId);
  const variant = product?.variants.find((item) => item.id === variantId);
  if (!product || !variant) return;

  const current = get();
  const existing = current.find(
    (line) => line.productId === productId && line.variantId === variantId,
  );
  const cap = Math.min(MAX_ITEM_QUANTITY, variant.stock);

  if (existing) {
    set(
      current.map((line) =>
        line === existing
          ? { ...line, qty: Math.min(cap, line.qty + qty) }
          : line,
      ),
    );
    return;
  }
  set([...current, { productId, variantId, qty: Math.min(cap, Math.max(1, qty)) }]);
}

export function setLineQty(
  productId: string,
  variantId: string,
  qty: number,
) {
  const catalog = getCatalogValue();
  const variant = catalog.products
    .find((item) => item.id === productId)
    ?.variants.find((item) => item.id === variantId);
  const cap = Math.min(MAX_ITEM_QUANTITY, variant?.stock ?? 0);
  const next = Math.max(0, Math.min(cap, qty));

  set(
    get()
      .map((line) =>
        line.productId === productId && line.variantId === variantId
          ? { ...line, qty: next }
          : line,
      )
      .filter((line) => line.qty > 0),
  );
}

export function removeLine(productId: string, variantId: string) {
  set(
    get().filter(
      (line) =>
        !(line.productId === productId && line.variantId === variantId),
    ),
  );
}

export function clearCart() {
  set([]);
}
