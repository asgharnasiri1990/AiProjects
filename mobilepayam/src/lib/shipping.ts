export type ShippingMethod = {
  id: "courier" | "tipax" | "pickup";
  name: string;
  note: string;
  price: number;
};

export const FREE_SHIPPING_MIN = 5_000_000;

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "courier",
    name: "پیک همان روز — تهران",
    note: "تحویل تا ۶ ساعت پس از تأیید",
    price: 89_000,
  },
  {
    id: "tipax",
    name: "تیپاکس — شهرستان",
    note: "۲ تا ۴ روز کاری",
    price: 145_000,
  },
  {
    id: "pickup",
    name: "تحویل حضوری",
    note: "فروشگاه مرکزی، ولیعصر",
    price: 0,
  },
];

export function shippingFor(methodId: ShippingMethod["id"], subtotal: number): number {
  const method = SHIPPING_METHODS.find((item) => item.id === methodId);
  if (!method || method.price === 0) return 0;
  return subtotal >= FREE_SHIPPING_MIN ? 0 : method.price;
}

export function shippingMethodName(methodId: ShippingMethod["id"]): string {
  return SHIPPING_METHODS.find((item) => item.id === methodId)?.name ?? "";
}
