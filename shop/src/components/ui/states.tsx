import type { ReactNode } from "react";
import { AlertCircleIcon } from "@/components/icons";
import { Button } from "./button";

/** Centered "nothing here" panel with an optional call to action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Alert box for API failures with an optional retry button. */
export function ErrorState({
  message,
  onRetry,
  retryLabel = "Try again",
}: {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center dark:border-red-900 dark:bg-red-950/40"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
        <AlertCircleIcon width={24} height={24} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-red-800 dark:text-red-200">
          Something went wrong
        </h3>
        <p className="mt-1 max-w-md text-sm text-red-600 dark:text-red-300">
          {message ?? "An unexpected error occurred. Please try again."}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
