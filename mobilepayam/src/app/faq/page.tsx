import type { Metadata } from "next";
import { container, card } from "@/lib/ui";

export const metadata: Metadata = { title: "سؤالات متداول" };

const GROUPS = [
  {
    title: "خرید و ارسال",
    items: [
      {
        q: "ارسال چقدر طول می‌کشد؟",
        a: "سفارش‌های تهران با پیک همان روز (ثبت تا ساعت ۱۴) و شهرستان با تیپاکس ۲ تا ۴ روز کاری ارسال می‌شوند.",
      },
      {
        q: "هزینهٔ ارسال چقدر است؟",
        a: "پیک تهران ۸۹٬۰۰۰ تومان، تیپاکس ۱۴۵٬۰۰۰ تومان و تحویل حضوری رایگان است. سفارش‌های بالای ۵ میلیون تومان ارسال رایگان دارند.",
      },
      {
        q: "امکان تحویل حضوری وجود دارد؟",
        a: "بله، پس از تأیید سفارش می‌توانید در ساعات کاری به فروشگاه مراجعه کنید.",
      },
    ],
  },
  {
    title: "پرداخت",
    items: [
      {
        q: "چه روش‌های پرداختی دارید؟",
        a: "پرداخت آنلاین از طریق درگاه بانکی و واریز به شمارهٔ شبا با بارگذاری تصویر فیش.",
      },
      {
        q: "سفارش با فیش کی تأیید می‌شود؟",
        a: "پس از بررسی فیش توسط پشتیبانی، وضعیت سفارش از «در انتظار تأیید فیش» به «در حال پردازش» تغییر می‌کند.",
      },
    ],
  },
  {
    title: "گارانتی و بازگشت",
    items: [
      {
        q: "گارانتی محصولات چگونه است؟",
        a: "همهٔ کالاها با گارانتی رسمی و کد رهگیری عرضه می‌شوند؛ مدت گارانتی در صفحهٔ هر محصول ذکر شده است.",
      },
      {
        q: "امکان بازگشت کالا وجود دارد؟",
        a: "تا ۷ روز پس از تحویل، در صورت سالم بودن بسته‌بندی و لوازم همراه، کالا قابل بازگشت است.",
      },
      {
        q: "هزینهٔ بازگشت با چه کسی است؟",
        a: "در صورت ایراد فنی یا ارسال اشتباه، هزینهٔ بازگشت با فروشگاه است.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className={`${container} pb-10`}>
      <div className="py-4">
        <h1 className="text-lg font-extrabold text-ink-strong">سؤالات متداول</h1>
        <p className="mt-1 text-[11.5px] text-muted">
          پاسخ پرتکرارترین سؤال‌ها دربارهٔ خرید، ارسال، پرداخت و بازگشت کالا.
        </p>
      </div>

      <div className="grid gap-3">
        {GROUPS.map((group) => (
          <section key={group.title} className={`${card} p-4`}>
            <h2 className="mb-2 text-sm font-extrabold text-ink-strong">
              {group.title}
            </h2>
            <div className="divide-y divide-line">
              {group.items.map((item) => (
                <details key={item.q} className="group py-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-semibold text-ink-strong">
                    {item.q}
                    <span className="text-muted transition-transform group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-2 text-[11.5px] leading-6 text-[#5b5d7e]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <section id="returns" className={`${card} p-4`}>
          <h2 className="text-sm font-extrabold text-ink-strong">شرایط بازگشت کالا</h2>
          <ol className="mt-2 list-inside list-decimal space-y-1.5 text-[11.5px] leading-6 text-[#5b5d7e]">
            <li>کالا باید در بسته‌بندی اصلی و با همهٔ لوازم همراه باشد.</li>
            <li>هفت روز از تاریخ تحویل برای ثبت درخواست بازگشت فرصت دارید.</li>
            <li>کالاهای نصب‌شده یا آسیب‌دیدهٔ ناشی از استفاده مشمول بازگشت نیستند.</li>
            <li>برای ثبت درخواست، کد سفارش را از صفحهٔ پیگیری ارسال کنید.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
