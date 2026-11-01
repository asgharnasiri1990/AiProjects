import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "./signup-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a DigitalShop account.",
};

export default function SignupPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <Suspense fallback={<Skeleton className="h-[520px] w-full rounded-2xl" />}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
