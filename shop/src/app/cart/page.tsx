import type { Metadata } from "next";
import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the products in your cart and continue to checkout.",
};

export default function CartPage() {
  return <CartView />;
}
