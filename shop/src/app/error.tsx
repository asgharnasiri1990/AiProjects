"use client";

import { ErrorState } from "@/components/ui/states";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
      <ErrorState
        message={
          error.message || "An unexpected error occurred while loading this page."
        }
        onRetry={reset}
      />
    </div>
  );
}
