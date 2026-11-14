import type { Metadata } from "next";
import Link from "next/link";
import { container, card } from "@/lib/ui";

export const metadata: Metadata = { title: "تماس با ما" };

const CHANNELS = [
  {
    title: "تلفن فروشگاه",
    value: "۰۴۵-۳۳۲۴۵۷۳۶",
    href: "tel:+984533245736",
    note: "شنبه تا پنجشنبه، ۱۰ تا ۲۰",
  },
  {
    title: "ایمیل",
    value: "hello@mobilepayam.ir",
    href: "mailto:hello@mobilepayam.ir",
    note: "پاسخ تا ۲۴ ساعت کاری",
  },
  {
    title: "آدرس",
    value: "اردبیل، بازار صفویه، موبایل پیام",
    href: "https://maps.google.com/?q=اردبیل%20بازار%20صفویه%20موبایل%20پیام",
    note: "تحویل حضوری با هماهنگی",
  },
];

export default function ContactPage() {
  return (
    <main className={`${container} pb-10`}>
      <div className="py-4">
        <h1 className="text-lg font-extrabold text-ink-strong">تماس با ما</h1>
        <p className="mt-1 text-[11.5px] text-muted">
          برای مشاورهٔ خرید، پیگیری سفارش یا پشتیبانی پس از فروش با ما در ارتباط باشید.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {CHANNELS.map((channel) => (
          <div key={channel.title} className={`${card} p-4`}>
            <b className="block text-xs font-extrabold text-ink-strong">
              {channel.title}
            </b>
            {channel.href ? (
              <a
                href={channel.href}
                className="mt-2 block text-[12px] text-ink transition-colors hover:text-brand"
                dir={channel.href.startsWith("tel:") ? "ltr" : undefined}
              >
                {channel.value}
              </a>
            ) : (
              <p className="mt-2 text-[12px] text-ink">{channel.value}</p>
            )}
            <p className="mt-1 text-[10.5px] text-muted">{channel.note}</p>
          </div>
        ))}
      </div>

      <section className={`${card} mt-3 p-5`}>
        <b className="block text-sm font-extrabold text-ink-strong">
          پیگیری سریع سفارش
        </b>
        <p className="mt-1 max-w-[60ch] text-[11.5px] leading-6 text-[#5b5d7e]">
          اگر کد سفارش را دارید، وضعیت ارسال را بدون تماس تلفنی ببینید. برای
          تغییر آدرس یا لغو سفارش، پیش از ارسال با پشتیبانی تماس بگیرید.
        </p>
        <Link
          href="/track"
          className="mt-3 inline-flex h-10 items-center rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brand-dark"
        >
          پیگیری سفارش
        </Link>
      </section>
    </main>
  );
}
