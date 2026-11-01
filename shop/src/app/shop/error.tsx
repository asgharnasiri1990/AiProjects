"use client";

import { ErrorState } from "@/components/ui/states";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
        Shop
      </h1>
      <ErrorState message={error.message} onRetry={reset} />
    </div>
  );
}
