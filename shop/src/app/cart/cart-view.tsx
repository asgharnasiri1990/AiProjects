"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeftIcon, CartIcon, TrashIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/states";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { imageUrl, MAX_ITEM_QUANTITY } from "@/lib/api";
import { formatToman } from "@/lib/format";

export function CartView() {
  const { lines, totalItems, totalPrice, hydrated, setQuantity, remove, clear } = useCart();
  const { user } = useAuth();
  const [lineError, setLineError] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-9 w-40" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Your cart
        </h1>
        <EmptyState
          icon={<CartIcon width={26} height={26} />}
          title="Your cart is empty"
          description="Browse the shop and add something you like — your cart is saved on this device."
          action={
            <Link href="/shop" className={buttonClasses("primary", "md")}>
              <ArrowLeftIcon width={16} height={16} /> Browse the shop
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Your cart
          <span className="ml-2 align-middle text-base font-normal text-zinc-400">
            ({totalItems} item{totalItems === 1 ? "" : "s"})
          </span>
        </h1>
        <button
          type="button"
          onClick={() => {
            setLineError(null);
            void clear();
          }}
          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          Clear cart
        </button>
      </div>

      {lineError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
        >
          {lineError}
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        {/* Lines */}
        <ul className="space-y-4">
          {lines.map((line) => {
            const maxQty = line.inStock
              ? Math.min(line.stock, MAX_ITEM_QUANTITY)
              : line.quantity;
            return (
              <li
                key={line.id}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:items-center"
              >
                <Link
                  href={`/shop/${line.id}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-white dark:border-zinc-800"
                >
                  <Image
                    src={imageUrl(line.image)}
                    alt={line.name}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/shop/${line.id}`}
                      dir="auto"
                      className="line-clamp-1 font-semibold text-zinc-900 hover:text-primary-600 dark:text-zinc-100 dark:hover:text-primary-400"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      {formatToman(line.price)} each
                    </p>
                    {!line.inStock && (
                      <Badge variant="danger" className="mt-1">
                        Out of stock — remove it to check out
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <QuantitySelector
                      size="sm"
                      value={line.quantity}
                      max={Math.max(1, maxQty)}
                      disabled={!line.inStock}
                      label={line.name}
                      onChange={(quantity) => {
                        setLineError(null);
                        setQuantity(line.id, quantity).catch((error: unknown) => {
                          setLineError(
                            error instanceof Error
                              ? error.message
                              : "Could not update the cart.",
                          );
                        });
                      }}
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold tabular-nums text-zinc-900 dark:text-white">
                        {formatToman(line.price * line.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setLineError(null);
                          void remove(line.id);
                        }}
                        aria-label={`Remove ${line.name} from cart`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      >
                        <TrashIcon width={17} height={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <aside className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Summary
          </h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Items</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">{totalItems}</dd>
            </div>
            <div className="flex justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <dt className="font-semibold text-zinc-900 dark:text-zinc-100">Total</dt>
              <dd className="text-lg font-bold tabular-nums text-zinc-900 dark:text-white">
                {formatToman(totalPrice)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 space-y-2.5">
            {user ? (
              <Link href="/checkout" className={buttonClasses("primary", "lg") + " w-full"}>
                Checkout
              </Link>
            ) : (
              <>
                <Link
                  href="/checkout"
                  className={buttonClasses("primary", "lg") + " w-full"}
                >
                  Log in to check out
                </Link>
                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                  Your cart will be waiting for you after login.
                </p>
              </>
            )}
            <Link
              href="/shop"
              className={buttonClasses("outline", "lg") + " w-full"}
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
