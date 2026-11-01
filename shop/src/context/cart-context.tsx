"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MAX_ITEM_QUANTITY } from "@/lib/api";
import type { Cart, CartLine, Product } from "@/lib/types";
import { useAuth } from "./auth-context";

const GUEST_CART_KEY = "toman-shop.guest-cart.v1";

interface CartContextValue {
  lines: CartLine[];
  totalItems: number;
  totalPrice: number;
  /** True once the initial cart (localStorage or API) has been loaded. */
  hydrated: boolean;
  add: (product: Product, quantity?: number) => Promise<void>;
  setQuantity: (productId: number, quantity: number) => Promise<void>;
  remove: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
  /** Re-fetch the server cart (used after checkout). */
  reload: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

function readGuestCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        line &&
        typeof line.id === "number" &&
        typeof line.quantity === "number" &&
        typeof line.price === "number",
    );
  } catch {
    return [];
  }
}

function writeGuestCart(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(lines));
}

/** Map an API cart response onto the shared CartLine shape. */
function linesFromCart(cart: Cart): CartLine[] {
  return cart.items.map((item) => ({
    id: item.product.id,
    slug: item.product.slug,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    stock: item.product.stock,
    inStock: item.product.inStock,
    quantity: item.quantity,
  }));
}

async function apiCart(
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<Cart | null> {
  const res = await fetch(path, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      data && typeof data.error === "string" ? data.error : "Cart update failed.";
    throw new Error(message);
  }
  return data as Cart | null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const userIdRef = useRef<number | null>(null);

  const loadGuest = useCallback(() => {
    setLines(readGuestCart());
    setHydrated(true);
  }, []);

  /**
   * Push any guest (localStorage) cart lines into the server cart.
   * A line that fails — network error, rate limit — is kept in localStorage
   * and retried on the next sync, so a failed merge never loses the cart.
   */
  const syncGuestCart = useCallback(async () => {
    const guestLines = readGuestCart();
    if (guestLines.length === 0) return;

    const failed: CartLine[] = [];
    for (const line of guestLines) {
      try {
        await apiCart("/api/cart/items", "POST", {
          productId: line.id,
          quantity: line.quantity,
        });
      } catch {
        failed.push(line);
      }
    }
    writeGuestCart(failed);
  }, []);

  const reload = useCallback(async () => {
    if (!user) return;
    try {
      await syncGuestCart();
      const cart = await apiCart("/api/cart", "GET");
      if (cart) setLines(linesFromCart(cart));
    } catch {
      // Keep showing the current cart if the refresh fails.
    }
  }, [user, syncGuestCart]);

  // React to sign-in / sign-out transitions.
  useEffect(() => {
    const prevUserId = userIdRef.current;
    userIdRef.current = user?.id ?? null;

    if (!user) {
      // Signed out (or first load as guest): show the guest cart.
      loadGuest();
      return;
    }

    if (prevUserId === user.id) {
      // Same user, just a re-render: load once on first mount.
      if (!hydrated) void reload();
      return;
    }

    // Signed in (fresh session): merge the guest cart into the account,
    // then show the synced server cart.
    void (async () => {
      await reload();
      setHydrated(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const cap = useCallback((product: Product | CartLine, quantity: number) => {
    const stockCap = product.inStock ? Math.min(product.stock, MAX_ITEM_QUANTITY) : 0;
    return Math.max(1, Math.min(quantity, stockCap || 1));
  }, []);

  const add = useCallback(
    async (product: Product, quantity = 1) => {
      if (!product.inStock) throw new Error("This product is out of stock.");
      const qty = Math.max(1, Math.min(quantity, Math.min(product.stock, MAX_ITEM_QUANTITY)));

      if (!user) {
        setLines((current) => {
          const existing = current.find((l) => l.id === product.id);
          const next = existing
            ? current.map((l) =>
                l.id === product.id ? { ...l, quantity: cap(l, l.quantity + qty) } : l,
              )
            : [
                ...current,
                {
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  stock: product.stock,
                  inStock: product.inStock,
                  quantity: qty,
                },
              ];
          writeGuestCart(next);
          return next;
        });
        return;
      }

      const cart = await apiCart("/api/cart/items", "POST", {
        productId: product.id,
        quantity: qty,
      });
      if (cart) setLines(linesFromCart(cart));
    },
    [user, cap],
  );

  const setQuantity = useCallback(
    async (productId: number, quantity: number) => {
      const applyOptimistic = (next: CartLine[]) => {
        setLines(next);
        if (!user) writeGuestCart(next);
      };

      const current = lines.find((l) => l.id === productId);
      if (!current) return;
      const nextQty = cap(current, quantity);

      applyOptimistic(
        lines.map((l) => (l.id === productId ? { ...l, quantity: nextQty } : l)),
      );

      if (user) {
        try {
          const cart = await apiCart(`/api/cart/items/${productId}`, "PATCH", {
            quantity: nextQty,
          });
          if (cart) setLines(linesFromCart(cart));
        } catch (error) {
          await reload();
          throw error;
        }
      }
    },
    [lines, user, reload, cap],
  );

  const remove = useCallback(
    async (productId: number) => {
      const optimistic = lines.filter((l) => l.id !== productId);
      setLines(optimistic);
      if (!user) {
        writeGuestCart(optimistic);
        return;
      }
      try {
        const cart = await apiCart(`/api/cart/items/${productId}`, "DELETE");
        if (cart) setLines(linesFromCart(cart));
      } catch {
        await reload();
      }
    },
    [lines, user, reload],
  );

  const clear = useCallback(async () => {
    setLines([]);
    if (!user) {
      writeGuestCart([]);
      return;
    }
    try {
      await apiCart("/api/cart", "DELETE");
    } catch {
      await reload();
    }
  }, [user, reload]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);
    const totalPrice = lines.reduce((sum, l) => sum + l.quantity * l.price, 0);
    return { lines, totalItems, totalPrice, hydrated, add, setQuantity, remove, clear, reload };
  }, [lines, hydrated, add, setQuantity, remove, clear, reload]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
