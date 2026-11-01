import { ApiError, getCategories, getProducts } from "./api";
import type { CategoryList, ProductList, ProductListQuery } from "./types";

/**
 * Shared catalogue loader for the shop and the home feed.
 *
 * Returns a discriminated result instead of throwing, so pages never have to
 * construct JSX inside a `try/catch`.
 */
export type CatalogResult =
  | { ok: true; products: ProductList; categories: CategoryList }
  | { ok: false; message: string };

export async function loadCatalog(query: ProductListQuery): Promise<CatalogResult> {
  try {
    const [products, categories] = await Promise.all([
      getProducts(query),
      getCategories(),
    ]);
    return { ok: true, products, categories };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : "We couldn't load the products right now.",
    };
  }
}
