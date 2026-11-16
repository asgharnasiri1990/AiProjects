import type { SVGProps } from "react";

/**
 * Brand mark: a smile-like arc with three dots.
 * Vector so it stays crisp at favicon and header sizes; inherits `currentColor`.
 */
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 20c0 12.5 9 19 20 19s20-6.5 20-19"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="27" cy="46" r="3.2" fill="currentColor" />
      <circle cx="37" cy="46" r="3.2" fill="currentColor" />
      <circle cx="32" cy="53.5" r="3.2" fill="currentColor" />
    </svg>
  );
}
