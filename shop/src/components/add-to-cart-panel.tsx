"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { Button, buttonClasses } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartPanel({
  product,
  maxQuantity,
}: {
  product: Product;
  maxQuantity: number;
}) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state !== "added") return;
    const timer = setTimeout(() => setState("idle"), 2500);
    return () => clearTimeout(timer);
  }, [state]);

  if (!product.inStock) {
    return (
      <div className="space-y-3">
        <Button variant="primary" size="lg" disabled aria-disabled>
          Add to cart
        </Button>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          This product is currently out of stock. Check back later.
        </p>
      </div>
    );
  }

  const handleAdd = async () => {
    setState("adding");
    setError(null);
    try {
      await add(product, quantity);
      setState("added");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Could not add to cart.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector
          value={quantity}
          onChange={(value) => {
            setQuantity(value);
            setState("idle");
          }}
          max={Math.max(1, maxQuantity)}
          label={product.name}
        />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Max {maxQuantity} per order
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          onClick={handleAdd}
          loading={state === "adding"}
          className="flex-1 sm:flex-none sm:px-10"
        >
          {state === "added" ? (
            <>
              <CheckIcon width={18} height={18} /> Added
            </>
          ) : (
            "Add to cart"
          )}
        </Button>
        {state === "added" && (
          <Link href="/cart" className={buttonClasses("outline", "lg")}>
            View cart
          </Link>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
