"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeftIcon,
  CheckIcon,
  CreditCardIcon,
  PackageIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/states";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { formatToman } from "@/lib/format";
import type { Order } from "@/lib/types";
import {
  validateAddress,
  validateFullName,
  validatePhone,
} from "@/lib/validation";

type Stage = "form" | "created" | "paid";

export function CheckoutView() {
  const { lines, totalPrice, hydrated, reload } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string | null;
    phone?: string | null;
    address?: string | null;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [stage, setStage] = useState<Stage>("form");

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-9 w-48" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          icon={<ShieldCheckIcon width={26} height={26} />}
          title="Please log in to check out"
          description="Checkout requires an account so your orders can be saved."
          action={
            <Link href="/login?next=/checkout" className={buttonClasses("primary", "md")}>
              Log in
            </Link>
          }
        />
      </div>
    );
  }

  if (lines.length === 0 && stage === "form") {
    return (
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          icon={<PackageIcon width={26} height={26} />}
          title="Your cart is empty"
          description="Add some products before checking out."
          action={
            <Link href="/shop" className={buttonClasses("primary", "md")}>
              <ArrowLeftIcon width={16} height={16} /> Browse the shop
            </Link>
          }
        />
      </div>
    );
  }

  const outOfStockLines = lines.filter((line) => !line.inStock);

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const errors = {
      fullName: validateFullName(fullName),
      phone: validatePhone(phone),
      address: validateAddress(address),
    };
    setFieldErrors(errors);
    if (errors.fullName || errors.phone || errors.address) return;
    if (outOfStockLines.length > 0) {
      setFormError("Your cart contains out-of-stock products. Remove them to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), phone: phone.trim(), address: address.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Could not place the order. Please try again.");
      }
      setOrder(data as Order);
      setStage("created");
      // The server cart has been converted into an order; refresh the UI copy.
      await reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not place the order.");
    } finally {
      setSubmitting(false);
    }
  };

  const payNow = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/pay`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Payment failed. Please try again.");
      }
      setOrder(data as Order);
      setStage("paid");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Payment failed.");
    } finally {
      setPaying(false);
    }
  };

  /* ---------------- Success screens ---------------- */

  // Placing the order empties the cart, so count the order's own lines.
  const orderedItems = order
    ? order.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  if (stage !== "form" && order) {
    return (
      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckIcon width={30} height={30} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-zinc-900 dark:text-white">
            {stage === "paid" ? "Payment complete" : "Order placed"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {stage === "paid"
              ? "Thank you! Your order is confirmed and on its way."
              : `Order #${order.id} has been placed (pending payment).`}
          </p>

          <dl className="mt-6 space-y-2 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-800/60">
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Order number</dt>
              <dd className="font-semibold text-zinc-900 dark:text-zinc-100">#{order.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Items</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">{orderedItems}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Total</dt>
              <dd className="text-base font-bold text-zinc-900 dark:text-white">
                {formatToman(order.total)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Status</dt>
              <dd className="font-semibold capitalize text-zinc-900 dark:text-zinc-100">
                {order.status}
              </dd>
            </div>
          </dl>

          {formError && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
            >
              {formError}
            </div>
          )}

          <div className="mt-6 space-y-2.5">
            {stage === "created" && (
              <Button size="lg" className="w-full" onClick={payNow} loading={paying}>
                <CreditCardIcon width={18} height={18} />
                Pay {formatToman(order.total)} (fake payment)
              </Button>
            )}
            <Link href="/account" className={buttonClasses("outline", "lg") + " w-full"}>
              View my orders
            </Link>
            <Link href="/shop" className={buttonClasses("ghost", "md") + " w-full"}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Checkout form ---------------- */

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
        Checkout
      </h1>

      {formError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
        >
          {formError}
        </div>
      )}

      {outOfStockLines.length > 0 && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300"
        >
          Some products in your cart went out of stock. Please remove them in the{" "}
          <Link href="/cart" className="underline">
            cart
          </Link>{" "}
          to continue.
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={placeOrder}
          noValidate
          className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
        >
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Delivery details
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Where should we send your order?
          </p>
          <div className="mt-5 space-y-4">
            <Input
              label="Full name"
              autoComplete="name"
              placeholder="Ali Ahmadi"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={fieldErrors.fullName}
            />
            <Input
              label="Phone number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09121234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={fieldErrors.phone}
            />
            <Textarea
              label="Address"
              placeholder="Tehran, Azadi St, No 12, Unit 3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={fieldErrors.address}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full"
            loading={submitting}
            disabled={outOfStockLines.length > 0}
          >
            Place order · {formatToman(totalPrice)}
          </Button>
          <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Payment is simulated by the practice API — no real charge.
          </p>
        </form>

        <aside className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Order summary
          </h2>
          <ul className="mt-4 space-y-3">
            {lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-3 text-sm">
                <span dir="auto" className="min-w-0 truncate text-zinc-600 dark:text-zinc-300">
                  {line.name} <span className="text-zinc-400">× {line.quantity}</span>
                </span>
                <span className="shrink-0 font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                  {formatToman(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Total</span>
            <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-white">
              {formatToman(totalPrice)}
            </span>
          </div>
          <Link href="/cart" className={buttonClasses("ghost", "sm") + " mt-4 w-full"}>
            Edit cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
