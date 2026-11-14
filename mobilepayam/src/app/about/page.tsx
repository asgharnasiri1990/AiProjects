import type { Metadata } from "next";
import Link from "next/link";
import { container, card } from "@/lib/ui";

export const metadata: Metadata = { title: "درباره ما" };

const STATS = [
  { value: "۷", label: "سال تجربه" },
  { value: "۲۴٬۰۰۰", label: "سفارش موفق" },
  { value: "۴٫۸/۵", label: "رضایت مشتریان" },
  { value: "۱۸۰+", label: "مدل موجود" },
];

const VALUES = [
  {
    index: "۰۱",
    title: "اصالت، بدون استثنا",
    text: "هر کالا با کد رهگیری رسمی و گارانتی معتبر عرضه می‌شود.",
  },
  {
    index: "۰۲",
    title: "قیمت شفاف",
    text: "بدون هزینهٔ پنهان؛ قیمت نهایی همان است که می‌بینید.",
  },
  {
    index: "۰۳",
    title: "مشاورهٔ انسانی",
    text: "کارشناس واقعی، نه ربات؛ پیش از خرید راهنمایی می‌گیرید.",
  },
  {
    index: "۰۴",
    title: "پشتیبانی پس از فروش",
    text: "نصب، انتقال داده و پیگیری گارانتی در فروشگاه انجام می‌شود.",
  },
];

export default function AboutPage() {
  return (
    <main className={`${container} pb-10`}>
      <section className={`${card} mt-4 px-6 py-8 sm:px-8`}>
        <span className="text-[11px] font-bold text-brand">دربارهٔ ما</span>
        <h1 className="mt-2 max-w-[24ch] text-2xl font-black leading-relaxed text-ink-strong sm:text-3xl">
          فروشگاهی برای کسانی که جزئیات را می‌بینند.
        </h1>
        <p className="mt-3 max-w-[62ch] text-[12.5px] leading-7 text-[#5b5d7e]">
          mobilepayam از سال ۱۳۹۸ موبایل و لوازم جانبی اورجینال را با قیمت شفاف و
          مشاورهٔ واقعی عرضه می‌کند. هدف ما ساده است: خرید یک گوشی نباید استرس
          داشته باشد.
        </p>
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className={`${card} px-4 py-4`}>
            <b className="block text-2xl font-black text-ink-strong">{stat.value}</b>
            <span className="text-[11px] text-muted">{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="mt-3 grid gap-3 sm:grid-cols-2">
        {VALUES.map((value) => (
          <div key={value.index} className={`${card} p-5`}>
            <span className="text-[11px] font-extrabold text-brand">{value.index}</span>
            <b className="mt-1 block text-sm font-extrabold text-ink-strong">
              {value.title}
            </b>
            <p className="mt-1 text-[11.5px] leading-6 text-[#5b5d7e]">{value.text}</p>
          </div>
        ))}
      </section>

      <section className={`${card} mt-3 flex flex-wrap items-center justify-between gap-3 p-5`}>
        <div>
          <b className="block text-sm font-extrabold text-ink-strong">
            سؤالی دارید؟
          </b>
          <p className="mt-1 text-[11.5px] text-muted">
            شنبه تا پنجشنبه، ۱۰ تا ۲۰ — پاسخگویی توسط کارشناس.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-dark"
        >
          تماس با ما
        </Link>
      </section>
    </main>
  );
}
