import { notFound } from "next/navigation";

/** Any unhandled path inside a locale falls through to the theme's 404. */
export default function CatchAllPage() {
  notFound();
}
