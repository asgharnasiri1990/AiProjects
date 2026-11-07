/**
 * Shops that ship with an adapter. Keep this list in sync with
 * `lib/providers/index.ts`; the form builds its checkboxes from here so the
 * client never imports server-only code.
 */
export interface ShopMeta {
  id: string;
  label: string;
  domain: string;
}

export const SHOPS: ShopMeta[] = [
  { id: "technolife", label: "تکنولایف", domain: "technolife.com" },
  { id: "farnaa", label: "فرنا", domain: "farnaa.com" },
];
