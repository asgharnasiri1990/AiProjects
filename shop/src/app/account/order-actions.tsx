"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Pay / cancel controls for a pending order. */
export function OrderActions({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"pay" | "cancel" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = async (action: "pay" | "cancel") => {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/${action}`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Request failed. Please try again.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {error && (
        <p role="alert" className="mr-auto text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => act("cancel")}
        loading={busy === "cancel"}
        disabled={busy !== null}
      >
        Cancel order
      </Button>
      <Button size="sm" onClick={() => act("pay")} loading={busy === "pay"} disabled={busy !== null}>
        Pay now
      </Button>
    </div>
  );
}
