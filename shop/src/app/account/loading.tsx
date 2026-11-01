import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-9 w-44" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="mb-4 mt-8 h-6 w-36" />
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
    </div>
  );
}
