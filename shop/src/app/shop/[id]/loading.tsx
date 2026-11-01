import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-5 w-28" />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="flex flex-col gap-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
