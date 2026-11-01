import type { Metadata } from "next";
import { FavoritesView } from "./favorites-view";

export const metadata: Metadata = {
  title: "Saved",
  description: "Products you have hearted, saved on this device.",
};

export default function FavoritesPage() {
  return <FavoritesView />;
}
