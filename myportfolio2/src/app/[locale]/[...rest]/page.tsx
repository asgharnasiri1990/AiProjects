import { notFound } from "next/navigation";

/**
 * Any unhandled path inside a locale lands here and becomes the themed 404.
 */
export default function CatchAllPage() {
  notFound();
}
