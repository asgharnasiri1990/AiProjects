import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiError, getOrders, imageUrl } from "@/lib/api";
import { getSessionToken, getSessionUser } from "@/lib/session";
import { formatDate, formatToman } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { PackageIcon, UserIcon } from "@/components/icons";
import { OrderActions } from "./order-actions";

export const metadata: Metadata = {
  title: "My account",
  description: "Your profile and order history.",
};

const STATUS_BADGE: Record<OrderStatus, BadgeVariant> = {
  paid: "success",
  pending: "warning",
  cancelled: "danger",
};

function OrderCard({ order }: { order: Order }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Order #{order.id}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Placed {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={STATUS_BADGE[order.status]} className="capitalize">
            {order.status}
          </Badge>
          <span className="text-base font-bold tabular-nums text-zinc-900 dark:text-white">
            {formatToman(order.total)}
          </span>
        </div>
      </header>

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {order.items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3 px-5 py-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-white dark:border-zinc-800">
              <Image
                src={imageUrl(item.image)}
                alt={item.name}
                fill
                sizes="48px"
                className="object-contain p-1"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p dir="auto" className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {item.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {item.quantity} × {formatToman(item.price)}
              </p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatToman(item.subtotal)}
            </span>
          </li>
        ))}
      </ul>

      {order.status === "pending" && (
        <footer className="border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <OrderActions orderId={order.id} />
        </footer>
      )}
    </article>
  );
}

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) {
    // Cookie exists (middleware passed) but the token is no longer valid.
    redirect("/login?next=/account");
  }

  const token = (await getSessionToken()) ?? "";

  let orders: Order[] = [];
  let ordersError: string | null = null;
  try {
    const result = await getOrders(token);
    orders = result.data;
  } catch (error) {
    ordersError =
      error instanceof ApiError
        ? error.message
        : "Could not load your orders right now.";
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
        My account
      </h1>

      {/* Profile card */}
      <section
        aria-label="Profile"
        className="mt-6 flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
          <UserIcon width={26} height={26} />
        </span>
        <div>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {user.username}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Member since {formatDate(user.created_at)}
          </p>
        </div>
      </section>

      {/* Orders */}
      <section aria-label="Order history" className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Order history
        </h2>

        {ordersError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {ordersError}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              <PackageIcon width={26} height={26} />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              No orders yet
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              When you place an order it will show up here.
            </p>
            <Link href="/shop" className={buttonClasses("primary", "md") + " mt-6"}>
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
