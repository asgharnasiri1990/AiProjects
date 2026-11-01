import type { Metadata } from "next";
import { Suspense } from "react";
import { ApiError, getCategories, getProducts } from "@/lib/api";
import type { CategoryList, ProductList, ProductListQuery, ProductSort } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { CategoryNav } from "@/components/category-nav";
import { ShopFilters } from "@/components/shop-filters";
import { MasonryGrid } from "@/components/masonry-grid";
import { Pagination } from "@/components/pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { CartIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse products, filter by category and price, and sort by price or newest.",
};

const SORTS = new Set<ProductSort>(["newest", "price", "-price", "name"]);
const PAGE_SIZE = 12;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

function parseQuery(raw: Record<string, string | string[] | undefined>) {
  const search = first(raw.q)?.trim().slice(0, 100) || undefined;

  const categoryRaw = first(raw.category);
  const category = categoryRaw && /^[a-z-]+$/.test(categoryRaw) ? categoryRaw : undefined;

  let minPrice = parsePositiveInt(first(raw.min));
  let maxPrice = parsePositiveInt(first(raw.max));
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  const sortRaw = first(raw.sort);
  const sort: ProductSort | undefined = sortRaw && SORTS.has(sortRaw as ProductSort)
    ? (sortRaw as ProductSort)
    : undefined;

  const pageRaw = parsePositiveInt(first(raw.page));
  const page = pageRaw && pageRaw >= 1 ? pageRaw : 1;

  const inStock = first(raw.stock) === "true" ? true : undefined;

  const query: ProductListQuery = {
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
    limit: PAGE_SIZE,
    inStock,
  };

  // String params (minus pagination) preserved for page links.
  const linkParams: Record<string, string> = {};
  if (search) linkParams.q = search;
  if (category) linkParams.category = category;
  if (minPrice !== undefined) linkParams.min = String(minPrice);
  if (maxPrice !== undefined) linkParams.max = String(maxPrice);
  if (sort) linkParams.sort = sort;
  if (inStock) linkParams.stock = "true";

  return { query, linkParams };
}

type ShopData =
  | { ok: true; products: ProductList; categories: CategoryList }
  | { ok: false; message: string };

/**
 * Data loading lives outside the component body so no JSX is constructed inside
 * a try/catch — React can't catch render errors thrown from there anyway.
 */
async function loadShopData(query: ProductListQuery): Promise<ShopData> {
  try {
    const [products, categories] = await Promise.all([getProducts(query), getCategories()]);
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

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const raw = (await searchParams) as Record<string, string | string[] | undefined>;
  const { query, linkParams } = parseQuery(raw);
  const result = await loadShopData(query);

  let body: React.ReactNode;
  let pagination: React.ReactNode = null;

  if (!result.ok) {
    body = <ErrorState message={result.message} />;
  } else {
    const { data, total, totalPages, page, limit } = result.products;

    if (data.length === 0) {
      body = (
        <EmptyState
          icon={<CartIcon width={26} height={26} />}
          title="No products found"
          description="Try a different search term, category or price range."
          action={
            <Link href="/shop" className={buttonClasses("primary", "md")}>
              Clear filters
            </Link>
          }
        />
      );
    } else {
      const firstIndex = (page - 1) * limit + 1;
      const lastIndex = Math.min(page * limit, total);
      body = (
        <>
          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
            Showing{" "}
            <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
              {firstIndex}–{lastIndex}
            </strong>{" "}
            of{" "}
            <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{total}</strong>{" "}
            products
          </p>
          <MasonryGrid>
            {data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </MasonryGrid>
        </>
      );
      pagination = <Pagination page={page} totalPages={totalPages} params={linkParams} />;
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Shop
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Discover products you&apos;ll love.
        </p>
      </header>

      {result.ok && (
        <>
          <Suspense fallback={null}>
            <CategoryNav categories={result.categories.data} />
          </Suspense>

          <div className="mt-4">
            <Suspense fallback={null}>
              <ShopFilters />
            </Suspense>
          </div>
        </>
      )}

      <div className="mt-8">{body}</div>
      {pagination}
    </div>
  );
}
