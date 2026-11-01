import type { ReactNode } from "react";

/**
 * Pinterest-style masonry using CSS multi-column layout: no measuring, no
 * client JavaScript, no layout shift.
 *
 * Multi-column has no `row-gap`, so the vertical spacing and the
 * "don't split a card across columns" rule live on the direct children —
 * which is why cards must be direct descendants of this component.
 */
export const masonryClasses = [
  "columns-2 gap-4 md:columns-3 md:gap-5 xl:columns-4",
  "[&>*]:mb-4 [&>*]:break-inside-avoid md:[&>*]:mb-5",
].join(" ");

export function MasonryGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${masonryClasses} ${className}`}>{children}</div>;
}
