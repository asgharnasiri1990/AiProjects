export const MAX_ITEM_QUANTITY = 10;

/** ۹۶۵۰۰۰۰۰ → "۹۶٬۵۰۰٬۰۰۰" */
export function faNum(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

/** 96500000 → "۹۶٬۵۰۰٬۰۰۰ تومان" */
export function toman(value: number): string {
  return `${faNum(value)} تومان`;
}

export function discountPercent(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

export function clampQty(qty: number, stock: number): number {
  return Math.min(MAX_ITEM_QUANTITY, Math.max(0, Math.min(qty, stock)));
}

/** Digits-only normalizer for Persian/Arabic input. */
export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** Persian digits / thousands separators / spaces → Number (NaN when invalid). */
export function parseNumberInput(input: string): number {
  return Number(toEnglishDigits(input).replace(/[,٬\s]/g, ""));
}

export function orderCode(): string {
  return `MP-${Math.floor(10000 + Math.random() * 89999)}`;
}

/**
 * `crypto.randomUUID` only exists in a secure context (https or localhost).
 * A phone hitting the dev server over LAN is plain http, so fall back to a
 * timestamp+random id instead of throwing inside an event handler.
 */
export function uid(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function orderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
