import Link from "next/link";
import { ShoppingBagIcon, ShieldCheckIcon, CartIcon, CreditCardIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: "Real authentication",
    description:
      "Create an account, stay signed in with a secure httpOnly cookie, and log back in anytime.",
  },
  {
    icon: CartIcon,
    title: "Cart that follows you",
    description:
      "Your cart is saved locally as a guest and synced to your account the moment you log in.",
  },
  {
    icon: CreditCardIcon,
    title: "Checkout & orders",
    description:
      "Place orders, pay with the API's fake payment, and track everything in your account.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-50 via-transparent to-transparent dark:from-primary-950/30"
        />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary-700 shadow-sm dark:border-primary-800 dark:bg-zinc-900 dark:text-primary-300">
            <ShoppingBagIcon width={13} height={13} />
            Powered by the practice.amirm.me API
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            A minimal shop that speaks{" "}
            <span className="text-primary-600 dark:text-primary-400">Gadget Center</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Browse gadgets, books and gear, filter by price, and check out — all in a clean,
            fast, dark-mode-friendly interface.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className={buttonClasses("primary", "lg")}>
              Start shopping
            </Link>
            <Link href="/signup" className={buttonClasses("outline", "lg")}>
              Create an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        aria-label="Features"
        className="mx-auto grid w-full max-w-5xl gap-5 px-4 pb-20 sm:grid-cols-3 sm:px-6"
      >
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
              <feature.icon width={20} height={20} />
            </span>
            <h2 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {feature.title}
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
