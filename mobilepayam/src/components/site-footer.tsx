import Link from "next/link";

const COLUMNS = [
  {
    title: "فروشگاه",
    links: [
      { href: "/shop?cat=mobile", label: "موبایل" },
      { href: "/shop?cat=watch", label: "ساعت هوشمند" },
      { href: "/shop?cat=audio", label: "هدفون و ایرپاد" },
      { href: "/shop?cat=power", label: "شارژر و کابل" },
      { href: "/used", label: "گوشی کارکرده" },
    ],
  },
  {
    title: "حساب",
    links: [
      { href: "/account", label: "سفارش‌های من" },
      { href: "/cart", label: "سبد خرید" },
      { href: "/track", label: "پیگیری سفارش" },
      { href: "/login", label: "ورود / ثبت‌نام" },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { href: "/contact", label: "تماس با ما" },
      { href: "/faq", label: "سؤالات متداول" },
      { href: "/faq#returns", label: "شرایط بازگشت" },
      { href: "/about", label: "درباره ما" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-[1560px] gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center"
            aria-label="mobilepayam — خانه"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo.png"
              alt="mobilepayam"
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-3 max-w-[32ch] text-[11.5px] leading-6 text-muted">
            موبایل و لوازم جانبی اورجینال، با ضمانت اصالت کالا و پشتیبانی واقعی.
          </p>
          <p className="mt-3 text-[11px] text-muted">
            تلفن:{" "}
            <span dir="ltr" className="inline-block">
              ۰۴۵-۳۳۲۴۵۷۳۶
            </span>
            <br />
            اردبیل، بازار صفویه، موبایل پیام
            <br />
            شنبه تا پنجشنبه، ۱۰ تا ۲۰
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <b className="mb-2 block text-xs font-extrabold text-ink-strong">
              {column.title}
            </b>
            {column.links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="block py-1 text-[11.5px] text-[#6b6d8f] transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1560px] flex-wrap items-center justify-between gap-2 px-4 py-3 text-[10.5px] text-muted">
          <span>© ۱۴۰۴ mobilepayam — همهٔ حقوق محفوظ است.</span>
          <span className="flex items-center gap-3">
            <Link href="/admin" className="hover:text-brand">
              پنل مدیریت
            </Link>
            <Link href="/faq" className="hover:text-brand">
              قوانین و بازگشت
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
