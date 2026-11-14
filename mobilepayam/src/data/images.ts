/**
 * Local product photos. Files live in `public/images/products/` and were
 * captured from Zoomit product pages for this demo (see `docs/image-sources.json`).
 * Replace them with owned/licensed photos before a commercial launch.
 *
 * Products without an entry fall back to the shared `ProductArt` line art.
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  "iphone-16-pro-max": "/images/products/iphone-16-pro-max.webp",
  "iphone-16": "/images/products/iphone-16.webp",
  "galaxy-s25-ultra": "/images/products/galaxy-s25-ultra.webp",
  "galaxy-a56": "/images/products/galaxy-a56.webp",
  "xiaomi-14t": "/images/products/xiaomi-14t.webp",
  "pixel-9": "/images/products/pixel-9.webp",
  "apple-watch-10-46": "/images/products/apple-watch-10-46.webp",
  "galaxy-watch7-44": "/images/products/galaxy-watch7-44.webp",
  "mi-smart-band-9": "/images/products/mi-smart-band-9.webp",
  "huawei-watch-fit-3": "/images/products/huawei-watch-fit-3.webp",
  "airpods-pro-2": "/images/products/airpods-pro-2.webp",
  "airpods-4": "/images/products/airpods-4.webp",
  "galaxy-buds3": "/images/products/galaxy-buds3.webp",
  "jbl-tune-520bt": "/images/products/jbl-tune-520bt.webp",
  "sony-wh-ch720n": "/images/products/sony-wh-ch720n.webp",
  "anker-65w-gan": "/images/products/anker-65w-gan.webp",
  "anker-magsafe-10000": "/images/products/anker-magsafe-10000.webp",
  "baseus-powerbank-30000": "/images/products/baseus-powerbank-30000.webp",
};

export function productImage(
  slug: string,
  override?: string,
): string | undefined {
  return override ?? PRODUCT_IMAGES[slug];
}
