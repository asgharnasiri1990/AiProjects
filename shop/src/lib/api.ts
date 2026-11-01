import type {
  Cart,
  CategoryList,
  CheckoutInput,
  LoginResult,
  Order,
  OrderList,
  Product,
  ProductList,
  ProductListQuery,
  User,
} from "./types";

/** Base URL of the practice shop API. */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://practice.amirm.me"
).replace(/\/+$/, "");

/** The API allows at most 10 units of one product per cart. */
export const MAX_ITEM_QUANTITY = 10;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
  /**
   * Cache lifetime in seconds for public, slowly-changing data.
   * Omit it for anything user-specific or per-request (the default is
   * `no-store`).
   */
  revalidate?: number;
}

/**
 * Low-level fetch wrapper for the practice API.
 * Always throws ApiError (never a raw network TypeError) on failure.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, signal, revalidate } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  // `cache` and `next.revalidate` conflict, so exactly one is set.
  const init: RequestInit & { next?: { revalidate: number } } = {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    ...(revalidate === undefined
      ? { cache: "no-store" as const }
      : { next: { revalidate } }),
  };

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError(
      0,
      "Could not reach the shop server. Check your connection and try again.",
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  let data: unknown;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = undefined;
    }
  }

  if (!res.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : `Request failed with status ${res.status}.`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

/** Turn an API image path into an absolute URL. */
export function imageUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${API_URL}${path}`;
}

/* ------------------------------------------------------------------ */
/* Shop                                                                */
/* ------------------------------------------------------------------ */

/** Category names and counts change rarely, so they are cached for a while. */
export async function getCategories(signal?: AbortSignal): Promise<CategoryList> {
  return apiFetch<CategoryList>("/categories", { signal, revalidate: 300 });
}

export async function getProducts(
  query: ProductListQuery,
  signal?: AbortSignal,
): Promise<ProductList> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.inStock !== undefined) params.set("inStock", String(query.inStock));
  if (query.sort) params.set("sort", query.sort);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return apiFetch<ProductList>(`/products${qs ? `?${qs}` : ""}`, { signal });
}

export async function getProduct(
  id: number,
  signal?: AbortSignal,
): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { signal });
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function register(
  username: string,
  password: string,
): Promise<User> {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: { username, password },
  });
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export async function me(token: string): Promise<User> {
  return apiFetch<User>("/auth/me", { token });
}

export async function logout(token: string): Promise<void> {
  await apiFetch<void>("/auth/logout", { method: "POST", token });
}

/* ------------------------------------------------------------------ */
/* Cart (requires a Bearer token)                                      */
/* ------------------------------------------------------------------ */

export async function getCart(token: string): Promise<Cart> {
  return apiFetch<Cart>("/me/cart", { token });
}

export async function addCartItem(
  token: string,
  productId: number,
  quantity = 1,
): Promise<Cart> {
  return apiFetch<Cart>("/me/cart/items", {
    method: "POST",
    token,
    body: { productId, quantity },
  });
}

export async function setCartItemQuantity(
  token: string,
  productId: number,
  quantity: number,
): Promise<Cart> {
  return apiFetch<Cart>(`/me/cart/items/${productId}`, {
    method: "PATCH",
    token,
    body: { quantity },
  });
}

export async function removeCartItem(
  token: string,
  productId: number,
): Promise<Cart> {
  return apiFetch<Cart>(`/me/cart/items/${productId}`, {
    method: "DELETE",
    token,
  });
}

export async function clearCartApi(token: string): Promise<void> {
  await apiFetch<void>("/me/cart", { method: "DELETE", token });
}

/* ------------------------------------------------------------------ */
/* Orders (require a Bearer token)                                     */
/* ------------------------------------------------------------------ */

export async function getOrders(token: string): Promise<OrderList> {
  return apiFetch<OrderList>("/me/orders", { token });
}

export async function checkout(
  token: string,
  input: CheckoutInput,
): Promise<Order> {
  return apiFetch<Order>("/me/orders", {
    method: "POST",
    token,
    body: input,
  });
}

export async function payOrder(token: string, orderId: number): Promise<Order> {
  return apiFetch<Order>(`/me/orders/${orderId}/pay`, {
    method: "POST",
    token,
  });
}

export async function cancelOrder(
  token: string,
  orderId: number,
): Promise<Order> {
  return apiFetch<Order>(`/me/orders/${orderId}/cancel`, {
    method: "POST",
    token,
  });
}
