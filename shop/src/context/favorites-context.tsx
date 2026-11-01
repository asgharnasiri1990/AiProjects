"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";

const STORAGE_KEY = "toman-shop.favorites.v1";
const MAX_FAVORITES = 100;

/**
 * Wishlist store.
 *
 * The practice API has no favourites endpoint, so this is device-local: we keep
 * a snapshot of each saved product in localStorage (same idea as the guest
 * cart's CartLine). Prices and stock in the snapshot can go stale until the page
 * refreshes them; the detail page always shows live data.
 *
 * Implemented as an external store rather than state + effect so the first
 * client render can differ safely from the server render (no hydration
 * mismatch) and other tabs stay in sync.
 */

const EMPTY: Product[] = [];
let snapshot: Product[] = EMPTY;
let snapshotRaw: string | null = null;
const listeners = new Set<() => void>();

function parseFavorites(raw: string | null): Product[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (item): item is Product =>
        !!item &&
        typeof item === "object" &&
        typeof (item as Product).id === "number" &&
        typeof (item as Product).name === "string" &&
        typeof (item as Product).price === "number" &&
        typeof (item as Product).image === "string" &&
        typeof (item as Product).slug === "string",
    );
  } catch {
    return EMPTY;
  }
}

function readSnapshot(): Product[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = parseFavorites(raw);
  }
  return snapshot;
}

function getServerSnapshot(): Product[] {
  return EMPTY;
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Fires when *another* tab writes; drop the cache so the next read re-parses.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    snapshotRaw = null;
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function persist(items: Product[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota or private mode: keep the in-memory value for this session.
  }
  snapshotRaw = null;
  emit();
}

interface FavoritesContextValue {
  items: Product[];
  count: number;
  has: (id: number) => boolean;
  toggle: (product: Product) => void;
  remove: (id: number) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);

  const has = useCallback((id: number) => items.some((item) => item.id === id), [items]);

  const toggle = useCallback((product: Product) => {
    const current = readSnapshot();
    const exists = current.some((item) => item.id === product.id);
    persist(
      exists
        ? current.filter((item) => item.id !== product.id)
        : [product, ...current].slice(0, MAX_FAVORITES),
    );
  }, []);

  const remove = useCallback((id: number) => {
    persist(readSnapshot().filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => persist([]), []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ items, count: items.length, has, toggle, remove, clear }),
    [items, has, toggle, remove, clear],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
