import type { Category, Product, Variant } from "@/lib/types";

/* ─────────────────────────────────────────────────────────────
   The only seed. The store copies this into localStorage on first
   run; components must read the store, never this module directly
   (except for static metadata such as categories).
   ───────────────────────────────────────────────────────────── */

export const CATEGORIES: Category[] = [
  { id: "mobile", slug: "mobile", name: "موبایل", icon: "phone" },
  { id: "watch", slug: "watch", name: "ساعت هوشمند", icon: "watch" },
  { id: "audio", slug: "audio", name: "هدفون و ایرپاد", icon: "earbuds" },
  { id: "power", slug: "charger", name: "شارژر و کابل", icon: "charger" },
  { id: "bank", slug: "powerbank", name: "پاوربانک", icon: "powerbank" },
  { id: "cover", slug: "case", name: "قاب و گلس", icon: "case" },
];

const v = (
  id: string,
  price: number,
  stock: number,
  extra: Partial<Variant> = {},
): Variant => ({ id, price, stock, ...extra });

const P = (p: Omit<Product, "createdAt"> & { createdAt?: string }): Product => ({
  createdAt: "2026-10-20",
  ...p,
});

export const PRODUCTS: Product[] = [
  /* ── موبایل ─────────────────────────────────────────────── */
  P({
    id: "p-iphone-16-pro-max",
    slug: "iphone-16-pro-max",
    name: "آیفون ۱۶ پرو مکس",
    brand: "Apple",
    categoryId: "mobile",
    icon: "phone",
    badge: "پرفروش",
    oldPrice: 102_000_000,
    rating: 4.9,
    reviews: 312,
    description:
      "تیتانیوم طبیعی، تراشهٔ A18 Pro و دوربین سه‌گانهٔ ۴۸ مگاپیکسل؛ با گارانتی ۱۸ ماههٔ رسمی.",
    specs: [
      { label: "صفحه‌نمایش", value: "۶٫۹ اینچ Super Retina XDR، 120Hz" },
      { label: "تراشه", value: "Apple A18 Pro" },
      { label: "دوربین", value: "۴۸ + ۴۸ + ۱۲ مگاپیکسل" },
      { label: "باتری", value: "۴۶۸۵ میلی‌آمپرساعت" },
    ],
    variants: [
      v("256-black", 96_500_000, 5, {
        color: "تیتانیوم مشکی",
        colorHex: "#2f2f33",
        storage: "۲۵۶ گیگابایت",
      }),
      v("256-natural", 96_500_000, 3, {
        color: "تیتانیوم طبیعی",
        colorHex: "#c8c2b6",
        storage: "۲۵۶ گیگابایت",
      }),
      v("512-blue", 112_000_000, 2, {
        color: "تیتانیوم آبی",
        colorHex: "#5b6b74",
        storage: "۵۱۲ گیگابایت",
      }),
    ],
    createdAt: "2026-11-08",
  }),
  P({
    id: "p-iphone-16",
    slug: "iphone-16",
    name: "آیفون ۱۶",
    brand: "Apple",
    categoryId: "mobile",
    icon: "phone",
    rating: 4.8,
    reviews: 208,
    description:
      "نسل جدید آیفون با دوربین ۴۸ مگاپیکسل و دکمهٔ کنترل دوربین؛ سبک و خوش‌دست.",
    specs: [
      { label: "صفحه‌نمایش", value: "۶٫۱ اینچ Super Retina XDR" },
      { label: "تراشه", value: "Apple A18" },
      { label: "دوربین", value: "۴۸ + ۱۲ مگاپیکسل" },
    ],
    variants: [
      v("128-black", 71_900_000, 8, {
        color: "مشکی",
        colorHex: "#1c1c1e",
        storage: "۱۲۸ گیگابایت",
      }),
      v("256-pink", 79_500_000, 4, {
        color: "صورتی",
        colorHex: "#f2c6cd",
        storage: "۲۵۶ گیگابایت",
      }),
    ],
  }),
  P({
    id: "p-galaxy-s25-ultra",
    slug: "galaxy-s25-ultra",
    name: "سامسونگ گلکسی S25 اولترا",
    brand: "Samsung",
    categoryId: "mobile",
    icon: "phone",
    badge: "جدید",
    rating: 4.8,
    reviews: 204,
    description:
      "پرچمدار سامسونگ با قلم S Pen، دوربین ۲۰۰ مگاپیکسلی و نمایشگر ۶٫۹ اینچی.",
    specs: [
      { label: "صفحه‌نمایش", value: "۶٫۹ اینچ Dynamic AMOLED 2X" },
      { label: "تراشه", value: "Snapdragon 8 Elite" },
      { label: "دوربین", value: "۲۰۰ + ۵۰ + ۵۰ + ۱۰ مگاپیکسل" },
    ],
    variants: [
      v("256-titanium", 78_900_000, 6, {
        color: "تیتانیوم",
        colorHex: "#8d8d93",
        storage: "۲۵۶ گیگابایت",
      }),
      v("512-black", 86_500_000, 3, {
        color: "مشکی",
        colorHex: "#1a1a1e",
        storage: "۵۱۲ گیگابایت",
      }),
    ],
    createdAt: "2026-11-02",
  }),
  P({
    id: "p-galaxy-a56",
    slug: "galaxy-a56",
    name: "سامسونگ گلکسی A56",
    brand: "Samsung",
    categoryId: "mobile",
    icon: "phone",
    rating: 4.5,
    reviews: 96,
    description:
      "میان‌ردهٔ محبوب سامسونگ با باتری ۵۰۰۰ میلی‌آمپری و نمایشگر سوپر AMOLED.",
    specs: [
      { label: "صفحه‌نمایش", value: "۶٫۷ اینچ Super AMOLED، 120Hz" },
      { label: "حافظه", value: "۸ گیگ رم" },
      { label: "باتری", value: "۵۰۰۰ میلی‌آمپرساعت" },
    ],
    variants: [
      v("128-blue", 18_900_000, 14, {
        color: "آبی",
        colorHex: "#4d6fa8",
        storage: "۱۲۸ گیگابایت",
      }),
      v("256-black", 21_400_000, 7, {
        color: "مشکی",
        colorHex: "#202024",
        storage: "۲۵۶ گیگابایت",
      }),
    ],
  }),
  P({
    id: "p-xiaomi-14t",
    slug: "xiaomi-14t",
    name: "شیائومی 14T",
    brand: "Xiaomi",
    categoryId: "mobile",
    icon: "phone",
    rating: 4.6,
    reviews: 143,
    description:
      "دوربین لایکا، شارژ سریع ۶۷ وات و نمایشگر ۱۴۴ هرتز؛ انتخاب هوشمندانهٔ میان‌رده.",
    specs: [
      { label: "صفحه‌نمایش", value: "۶٫۷ اینچ AMOLED، 144Hz" },
      { label: "دوربین", value: "۵۰ + ۵۰ + ۱۲ مگاپیکسل" },
      { label: "شارژ", value: "۶۷ وات" },
    ],
    variants: [
      v("256-black", 32_500_000, 9, {
        color: "مشکی",
        colorHex: "#191919",
        storage: "۲۵۶ گیگابایت",
      }),
      v("512-blue", 36_200_000, 4, {
        color: "آبی",
        colorHex: "#2f5f8f",
        storage: "۵۱۲ گیگابایت",
      }),
    ],
  }),
  P({
    id: "p-pixel-9",
    slug: "pixel-9",
    name: "گوگل پیکسل ۹",
    brand: "Google",
    categoryId: "mobile",
    icon: "phone",
    badge: "جدید",
    rating: 4.7,
    reviews: 87,
    description:
      "بهترین دوربین محاسباتی اندروید با تراشهٔ Tensor G4 و هفت سال به‌روزرسانی.",
    specs: [
      { label: "صفحه‌نمایش", value: "۶٫۳ اینچ Actua، 120Hz" },
      { label: "تراشه", value: "Google Tensor G4" },
      { label: "دوربین", value: "۵۰ + ۴۸ مگاپیکسل" },
    ],
    variants: [
      v(
        "128-obsidian",
        54_000_000,
        3,
        { color: "مشکی", colorHex: "#1d1d1f", storage: "۱۲۸ گیگابایت" },
      ),
    ],
    createdAt: "2026-11-10",
  }),

  /* ── ساعت هوشمند ────────────────────────────────────────── */
  P({
    id: "p-apple-watch-10",
    slug: "apple-watch-10-46",
    name: "اپل واچ سری ۱۰ — ۴۶ میلی‌متری",
    brand: "Apple",
    categoryId: "watch",
    icon: "watch",
    rating: 4.7,
    reviews: 98,
    description:
      "نمایشگر بزرگ‌تر، شارژ سریع و قابلیت‌های سلامتی؛ در دو رنگ مشکی و نقره‌ای.",
    specs: [
      { label: "نمایشگر", value: "OLED همیشه روشن" },
      { label: "باتری", value: "تا ۱۸ ساعت" },
      { label: "ضدآب", value: "۵۰ متر" },
    ],
    variants: [
      v("46-black", 24_500_000, 6, {
        color: "مشکی",
        colorHex: "#1f1f22",
      }),
      v("46-silver", 24_500_000, 4, {
        color: "نقره‌ای",
        colorHex: "#d8d8dc",
      }),
    ],
  }),
  P({
    id: "p-galaxy-watch7",
    slug: "galaxy-watch7-44",
    name: "سامسونگ گلکسی واچ ۷ — ۴۴ میلی‌متری",
    brand: "Samsung",
    categoryId: "watch",
    icon: "watch",
    rating: 4.5,
    reviews: 64,
    description:
      "سنسور ترکیب بدن، GPS دقیق و Wear OS؛ همراه روزمرهٔ اندرویدی‌ها.",
    specs: [
      { label: "نمایشگر", value: "Super AMOLED ۱٫۵ اینچ" },
      { label: "باتری", value: "۴۲۵ میلی‌آمپرساعت" },
      { label: "ضدآب", value: "5ATM" },
    ],
    variants: [v("44-green", 15_900_000, 8, { color: "سبز", colorHex: "#4c6b57" })],
  }),
  P({
    id: "p-mi-band-9",
    slug: "mi-smart-band-9",
    name: "شیائومی می بند ۹",
    brand: "Xiaomi",
    categoryId: "watch",
    icon: "watch",
    badge: "پرفروش",
    rating: 4.4,
    reviews: 421,
    description:
      "مچ‌بند سبک با نمایشگر AMOLED، پایش خواب و بیش از ۱۵۰ حالت ورزشی.",
    specs: [
      { label: "نمایشگر", value: "AMOLED ۱٫۶۲ اینچ" },
      { label: "باتری", value: "تا ۲۱ روز" },
      { label: "ضدآب", value: "5ATM" },
    ],
    variants: [v("band-9", 2_350_000, 25, { color: "مشکی", colorHex: "#222" })],
  }),
  P({
    id: "p-huawei-fit-3",
    slug: "huawei-watch-fit-3",
    name: "هواوی واچ فیت ۳",
    brand: "Huawei",
    categoryId: "watch",
    icon: "watch",
    rating: 4.3,
    reviews: 51,
    description:
      "بدنهٔ باریک، باتری طولانی و پایش دقیق ضربان؛ مناسب ورزش روزانه.",
    specs: [
      { label: "نمایشگر", value: "AMOLED ۱٫۸۲ اینچ" },
      { label: "باتری", value: "تا ۱۰ روز" },
      { label: "وزن", value: "۲۶ گرم" },
    ],
    variants: [v("fit-3", 4_900_000, 12, { color: "خاکستری", colorHex: "#7c7f86" })],
  }),

  /* ── هدفون و ایرپاد ─────────────────────────────────────── */
  P({
    id: "p-airpods-pro-2",
    slug: "airpods-pro-2",
    name: "ایرپاد پرو ۲ — USB-C",
    brand: "Apple",
    categoryId: "audio",
    icon: "earbuds",
    badge: "تخفیف",
    oldPrice: 14_500_000,
    rating: 4.9,
    reviews: 421,
    description:
      "حذف فعال نویز، صدای شفاف و کیس USB-C؛ پرفروش‌ترین ایرپاد بازار.",
    specs: [
      { label: "نوع", value: "درون‌گوشی بی‌سیم" },
      { label: "باتری", value: "تا ۶ ساعت + کیس" },
      { label: "اتصال", value: "Bluetooth 5.3" },
    ],
    variants: [v("white", 12_900_000, 15, { color: "سفید", colorHex: "#f4f4f4" })],
  }),
  P({
    id: "p-airpods-4",
    slug: "airpods-4",
    name: "ایرپاد ۴",
    brand: "Apple",
    categoryId: "audio",
    icon: "earbuds",
    badge: "جدید",
    rating: 4.7,
    reviews: 132,
    description:
      "طراحی جدید، صدای Spatial Audio و کیس کوچک‌تر؛ نسخهٔ پایه و سبک.",
    specs: [
      { label: "نوع", value: "نیمه‌درون‌گوشی" },
      { label: "باتری", value: "تا ۵ ساعت" },
      { label: "اتصال", value: "Bluetooth 5.3" },
    ],
    variants: [v("white", 9_800_000, 10, { color: "سفید", colorHex: "#f4f4f4" })],
    createdAt: "2026-11-05",
  }),
  P({
    id: "p-galaxy-buds3",
    slug: "galaxy-buds3",
    name: "گلکسی بادز ۳",
    brand: "Samsung",
    categoryId: "audio",
    icon: "earbuds",
    rating: 4.4,
    reviews: 74,
    description:
      "طراحی باز، ترجمهٔ هم‌زمان و اتصال پایدار به اکوسیستم سامسونگ.",
    specs: [
      { label: "نوع", value: "نیمه‌درون‌گوشی" },
      { label: "باتری", value: "تا ۶ ساعت" },
      { label: "اتصال", value: "Bluetooth 5.4" },
    ],
    variants: [v("silver", 7_450_000, 9, { color: "نقره‌ای", colorHex: "#cfd2d8" })],
  }),
  P({
    id: "p-jbl-tune-520bt",
    slug: "jbl-tune-520bt",
    name: "هدفون JBL Tune 520BT",
    brand: "JBL",
    categoryId: "audio",
    icon: "earbuds",
    rating: 4.3,
    reviews: 118,
    description:
      "هدفون سبک با باتری ۵۷ ساعته و صدای JBL Pure Bass.",
    specs: [
      { label: "نوع", value: "روی‌گوشی" },
      { label: "باتری", value: "تا ۵۷ ساعت" },
      { label: "اتصال", value: "Bluetooth 5.3" },
    ],
    variants: [
      v("black", 2_150_000, 18, { color: "مشکی", colorHex: "#1b1b1b" }),
    ],
  }),
  P({
    id: "p-sony-ch720n",
    slug: "sony-wh-ch720n",
    name: "سونی WH-CH720N",
    brand: "Sony",
    categoryId: "audio",
    icon: "earbuds",
    rating: 4.6,
    reviews: 89,
    description:
      "حذف نویز سبک و باتری طولانی؛ یکی از بهترین‌های ردهٔ قیمتی.",
    specs: [
      { label: "نوع", value: "روی‌گوشی" },
      { label: "باتری", value: "تا ۳۵ ساعت" },
      { label: "اتصال", value: "Bluetooth 5.2" },
    ],
    variants: [v("black", 5_600_000, 7, { color: "مشکی", colorHex: "#222" })],
  }),

  /* ── شارژر و کابل ───────────────────────────────────────── */
  P({
    id: "p-anker-65w",
    slug: "anker-65w-gan",
    name: "شارژر ۶۵ وات GaN انکر",
    brand: "Anker",
    categoryId: "power",
    icon: "charger",
    rating: 4.6,
    reviews: 156,
    description:
      "سه پورت، فناوری GaN و ابعاد کوچک؛ شارژ هم‌زمان لپ‌تاپ و موبایل.",
    specs: [
      { label: "توان", value: "۶۵ وات" },
      { label: "پورت", value: "۲×USB-C + ۱×USB-A" },
      { label: "ویژگی", value: "GaN II" },
    ],
    variants: [v("white", 2_450_000, 20, { color: "سفید", colorHex: "#fafafa" })],
  }),
  P({
    id: "p-apple-20w",
    slug: "apple-20w-adapter",
    name: "آداپتور ۲۰ وات اپل",
    brand: "Apple",
    categoryId: "power",
    icon: "charger",
    rating: 4.5,
    reviews: 240,
    description:
      "شارژر اصلی اپل با پورت USB-C؛ مناسب آیفون و ایرپاد.",
    specs: [
      { label: "توان", value: "۲۰ وات" },
      { label: "پورت", value: "USB-C" },
    ],
    variants: [v("white", 1_250_000, 30, { color: "سفید", colorHex: "#fff" })],
  }),
  P({
    id: "p-baseus-cable",
    slug: "baseus-usbc-cable-1m",
    name: "کابل تایپ‌سی به لایتنینگ ۱ متری",
    brand: "Baseus",
    categoryId: "power",
    icon: "cable",
    badge: "تخفیف",
    oldPrice: 850_000,
    rating: 4.4,
    reviews: 88,
    description:
      "کابل فست‌شارژ با روکش نایلونی و مقاومت بالا؛ مناسب استفادهٔ روزمره.",
    specs: [
      { label: "طول", value: "۱ متر" },
      { label: "توان", value: "۲۰ وات" },
      { label: "جنس", value: "نایلون بافته" },
    ],
    variants: [v("black", 690_000, 40, { color: "مشکی", colorHex: "#222" })],
  }),

  /* ── پاوربانک ───────────────────────────────────────────── */
  P({
    id: "p-xiaomi-20000",
    slug: "xiaomi-powerbank-20000",
    name: "پاوربانک ۲۰۰۰۰ شیائومی",
    brand: "Xiaomi",
    categoryId: "bank",
    icon: "powerbank",
    badge: "پرفروش",
    rating: 4.5,
    reviews: 132,
    description:
      "ظرفیت بالا با شارژ سریع ۲۲٫۵ وات و نمایشگر دیجیتال درصد باتری.",
    specs: [
      { label: "ظرفیت", value: "۲۰۰۰۰ میلی‌آمپرساعت" },
      { label: "خروجی", value: "۲۲٫۵ وات" },
      { label: "وزن", value: "۴۴۰ گرم" },
    ],
    variants: [v("black", 3_200_000, 12, { color: "مشکی", colorHex: "#1e1e1e" })],
  }),
  P({
    id: "p-anker-magsafe",
    slug: "anker-magsafe-10000",
    name: "پاوربانک مگ‌سیف انکر ۱۰۰۰۰",
    brand: "Anker",
    categoryId: "bank",
    icon: "powerbank",
    rating: 4.6,
    reviews: 61,
    description:
      "شارژ بی‌سیم مغناطیسی برای آیفون، با پایهٔ تاشو و پورت USB-C.",
    specs: [
      { label: "ظرفیت", value: "۱۰۰۰۰ میلی‌آمپرساعت" },
      { label: "خروجی", value: "۷٫۵ وات بی‌سیم" },
      { label: "ویژگی", value: "MagSafe" },
    ],
    variants: [v("white", 4_850_000, 8, { color: "سفید", colorHex: "#f6f6f6" })],
  }),
  P({
    id: "p-baseus-30000",
    slug: "baseus-powerbank-30000",
    name: "پاوربانک ۳۰۰۰۰ بیسوس",
    brand: "Baseus",
    categoryId: "bank",
    icon: "powerbank",
    rating: 4.3,
    reviews: 44,
    description:
      "ظرفیت بالا برای سفر و کمپینگ؛ سه پورت خروجی و شارژ سریع ۶۵ وات.",
    specs: [
      { label: "ظرفیت", value: "۳۰۰۰۰ میلی‌آمپرساعت" },
      { label: "خروجی", value: "۶۵ وات" },
      { label: "وزن", value: "۵۸۰ گرم" },
    ],
    variants: [v("black", 5_900_000, 5, { color: "مشکی", colorHex: "#1c1c1c" })],
  }),

  /* ── قاب و گلس ──────────────────────────────────────────── */
  P({
    id: "p-iphone16-case",
    slug: "iphone16-magsafe-case",
    name: "قاب مگ‌سیف شفاف آیفون ۱۶",
    brand: "Apple",
    categoryId: "cover",
    icon: "case",
    rating: 4.3,
    reviews: 64,
    description:
      "قاب شفاف با حلقهٔ مگ‌سیف؛ محافظت کامل بدون پنهان‌کردن طراحی گوشی.",
    specs: [
      { label: "جنس", value: "پلی‌کربنات شفاف" },
      { label: "سازگاری", value: "iPhone 16" },
      { label: "ویژگی", value: "MagSafe" },
    ],
    variants: [v("clear", 1_450_000, 22, { color: "شفاف", colorHex: "#eef0f2" })],
  }),
  P({
    id: "p-s25-case",
    slug: "galaxy-s25-clear-case",
    name: "قاب شفاف گلکسی S25",
    brand: "Samsung",
    categoryId: "cover",
    icon: "case",
    rating: 4.2,
    reviews: 38,
    description:
      "قاب سبک و شفاف با لبهٔ بلند برای محافظت از دوربین.",
    specs: [
      { label: "جنس", value: "TPU شفاف" },
      { label: "سازگاری", value: "Galaxy S25" },
    ],
    variants: [v("clear", 890_000, 16, { color: "شفاف", colorHex: "#eef0f2" })],
  }),
  P({
    id: "p-ceramic-glass",
    slug: "ceramic-glass",
    name: "گلس سرامیکی تمام‌چسب",
    brand: "Green Lion",
    categoryId: "cover",
    icon: "protector",
    rating: 4.1,
    reviews: 51,
    description:
      "گلس سرامیکی با پوشش کامل صفحه و مقاومت بالا در برابر خط و خش.",
    specs: [
      { label: "جنس", value: "سرامیک" },
      { label: "پوشش", value: "تمام‌چسب" },
      { label: "سختی", value: "9H" },
    ],
    variants: [v("clear", 450_000, 60, { color: "شفاف", colorHex: "#eef0f2" })],
  }),
];

/* ── selectors (pure, no storage) ─────────────────────────── */

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function minPrice(product: Product): number {
  return cheapestAvailableVariant(product).price;
}

/** The card must advertise the same variant it adds, so this is the single
 *  source of truth for the "from" price: the cheapest variant that is in
 *  stock. Falls back to the cheapest variant when everything is sold out. */
export function cheapestAvailableVariant(product: Product): Variant {
  const available = product.variants.filter((variant) => variant.stock > 0);
  const pool = available.length > 0 ? available : product.variants;

  return pool.reduce((cheapest, variant) =>
    variant.price < cheapest.price ? variant : cheapest,
  );
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
}

export function defaultVariant(product: Product): Variant {
  return (
    product.variants.find((variant) => variant.stock > 0) ?? product.variants[0]
  );
}

export function productBySlug(
  products: Product[],
  slug: string,
): Product | undefined {
  return products.find((product) => product.slug === slug);
}
