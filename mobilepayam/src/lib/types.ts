export type IconKey =
  | "phone"
  | "watch"
  | "earbuds"
  | "charger"
  | "cable"
  | "powerbank"
  | "case"
  | "protector";

export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: IconKey;
};

export type Variant = {
  id: string;
  /** e.g. "تیتانیوم طبیعی" — optional for accessories. */
  color?: string;
  colorHex?: string;
  /** e.g. "۲۵۶ گیگابایت" — phones only. */
  storage?: string;
  /** Integer Toman. */
  price: number;
  stock: number;
};

export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  icon: IconKey;
  /** Path under /public; when absent the ProductArt SVG is rendered. */
  image?: string;
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
  /** Optional struck-through price for the card. */
  oldPrice?: number;
  specs: Spec[];
  variants: Variant[];
  createdAt: string;
};

export type CartLine = {
  productId: string;
  variantId: string;
  qty: number;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled";

export type PaymentMethod = "gateway" | "sheba";

export type OrderItem = {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  qty: number;
};

export type Customer = {
  name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
};

export type Order = {
  id: string;
  code: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  shipping: { method: string; price: number };
  payment: {
    method: PaymentMethod;
    status: "paid" | "awaiting-receipt" | "failed";
    receiptName?: string;
  };
  subtotal: number;
  total: number;
  status: OrderStatus;
};

/* ── used phones ──────────────────────────────────────────── */

export type UsedCondition = "like-new" | "excellent" | "good" | "fair";
export type UsedStatus = "available" | "reserved" | "sold";

export type UsedListing = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  storage?: string;
  color?: string;
  condition: UsedCondition;
  price: number;
  oldPrice?: number;
  /** 0–100, shown as ٪ */
  batteryHealth?: number;
  /** Shop warranty in months (0 = without warranty). */
  warrantyMonths: number;
  city: string;
  description: string;
  specs: Spec[];
  /** One or more image URLs; the first is the cover. */
  images: string[];
  /** Direct mp4/webm URL or a YouTube/Aparat link. */
  video?: string;
  status: UsedStatus;
  createdAt: string;
};
