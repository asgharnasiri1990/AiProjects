import { masonryClasses } from "@/components/masonry-grid";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-xl bg-primary-200/70 dark:bg-white/10 ${className}`}
    />
  );
}

const SKELETON_RATIOS = ["1 / 1", "4 / 5", "3 / 4", "5 / 6"];

export function ProductCardSkeleton({ ratio = "4 / 5" }: { ratio?: string }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white dark:bg-zinc-900">
      <div style={{ aspectRatio: ratio }}>
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="space-y-2 px-3 pb-3.5 pt-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/5" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading products" className={masonryClasses}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} ratio={SKELETON_RATIOS[i % SKELETON_RATIOS.length]} />
      ))}
    </div>
  );
}
