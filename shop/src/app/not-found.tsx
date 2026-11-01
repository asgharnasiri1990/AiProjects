import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { PackageIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
        <PackageIcon width={28} height={28} />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className={buttonClasses("primary", "md")}>
          Back to shop
        </Link>
        <Link href="/" className={buttonClasses("outline", "md")}>
          Home
        </Link>
      </div>
    </div>
  );
}
