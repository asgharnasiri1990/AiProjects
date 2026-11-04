export interface SearchInput {
  brand: string;
  brandLabel: string;
  model: string;
  storageGb: number | null;
  color: string;
  query: string;
  signal?: AbortSignal;
}

export interface Offer {
  shopId: string;
  shopLabel: string;
  title: string;
  price: number;
  url: string;
  color?: string;
  colors?: string[];
  storageGb?: number;
  ramGb?: number;
  origin?: string;
  inStock?: boolean;
}

export interface ShopStatus {
  id: string;
  label: string;
  status: "ok" | "empty" | "error";
  count: number;
  ms: number;
  message?: string;
}

export interface SearchMeta {
  brand: string;
  brandLabel: string;
  model: string;
  storageGb: number | null;
  color: string;
  text: string;
}

export interface PricesResponse {
  query: SearchMeta;
  fetchedAt: string;
  offers: Offer[];
  floor: Offer | null;
  shops: ShopStatus[];
}

export interface Provider {
  id: string;
  label: string;
  search(input: SearchInput): Promise<Offer[]>;
}
