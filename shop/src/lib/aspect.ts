/**
 * Aspect ratios used by the masonry feed.
 *
 * Every product image on the API is a 400×400 SVG with the artwork centred in
 * roughly the middle 42% of the canvas, so any ratio from 1:1 down to 3:4
 * crops the coloured background without ever clipping the artwork. Keep new
 * ratios inside that range or images will start losing their content.
 */
const FEED_RATIOS = ["1 / 1", "4 / 5", "3 / 4", "5 / 6"] as const;

/**
 * Stable pseudo-random ratio for a product, derived from its slug so the same
 * card always renders at the same height — across pages, filters and re-renders
 * (no layout shift, no hydration mismatch).
 */
export function feedAspectRatio(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return FEED_RATIOS[Math.abs(hash) % FEED_RATIOS.length];
}
