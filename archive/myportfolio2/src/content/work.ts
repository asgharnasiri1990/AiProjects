import type { Localized } from "@/lib/i18n";

export interface WorkSection {
  heading: Localized;
  body: Localized;
}

export interface WorkNote {
  title: Localized;
  body: Localized;
}

export interface WorkFigure {
  value: string;
  label: Localized;
}

export interface Work {
  slug: string;
  index: string;
  year: string;
  title: Localized;
  tagline: Localized;
  role: Localized;
  stack: string[];
  /** Public repository or subdirectory that holds the code. */
  source: string;
  figures: WorkFigure[];
  sections: WorkSection[];
  notes: WorkNote[];
}

/**
 * Real projects, written from the code that exists in this repository.
 * `slug` becomes the URL: /fa/work/<slug>.
 */
export const work: Work[] = [
  {
    slug: "digital-shop",
    index: "01",
    year: "2026",
    title: { fa: "دیجیتال‌شاپ — فروشگاه روی یک API عمومی", en: "DigitalShop — a storefront on a public API" },
    tagline: {
      fa: "نُه صفحه، نُه مسیر API و هیچ پایگاه داده‌ای؛ همه‌چیز روی یک API عمومی با بودجه‌ی شصت درخواست در دقیقه.",
      en: "Nine pages, nine route handlers and no database: everything runs on a public API with a budget of sixty requests a minute.",
    },
    role: { fa: "طراحی رابط و ساخت کامل", en: "Interface design and full build" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "REST"],
    source: "https://github.com/asgharnasiri1990/AiProjects/tree/main/shop",
    figures: [
      { value: "18", label: { fa: "مسیر در بیلد", en: "Routes in the build" } },
      { value: "04", label: { fa: "وابستگی زمان اجرا", en: "Runtime dependencies" } },
      { value: "100", label: { fa: "امتیاز دسترس‌پذیری", en: "Accessibility score" } },
    ],
    sections: [
      {
        heading: { fa: "محدودیت", en: "The constraint" },
        body: {
          fa: "هیچ پایگاه داده و هیچ داده‌ی ساختگی وجود نداشت: محصول‌ها، دسته‌ها، ورود، سبد خرید و سفارش‌ها همه روی یک API عمومی بودند که هر کلاینت را به شصت درخواست در دقیقه محدود می‌کند. هم‌زمان توکن ورود نباید هرگز به مرورگر می‌رسید.",
          en: "There was no database and no mock data: products, categories, auth, carts and orders all lived on a public API capped at sixty requests per minute per client. At the same time the auth token could never reach the browser.",
        },
      },
      {
        heading: { fa: "ساخت", en: "The build" },
        body: {
          fa: "خواندن از طریق کامپوننت‌های سرور و یک نقطه‌ی واحد انجام می‌شود؛ نوشتن از طریق مسیرهای API که توکن را از کوکی httpOnly برمی‌دارند. برای هر صفحه یک درخواست، سه کار لازم بود: کش‌کردن کاربر با React.cache تا چیدمان و صفحه یک تماس مشترک داشته باشند، به‌اشتراک‌گذاشتن محصول بین متادیتا و بدنه، و کش سیصدثانیه‌ای فقط برای دسته‌ها. سبد خرید مهمان در مرورگر می‌ماند و هنگام ورود، خط‌به‌خط به سبد سرور منتقل می‌شود.",
          en: "Reads go through server components into one chokepoint; writes go through route handlers that take the token from an httpOnly cookie. Keeping each page to one request took three moves: caching the session user with React.cache so the layout and the page share one call, sharing the product fetch between metadata and the body, and caching only categories for five minutes. A guest cart stays in the browser and is merged line by line into the server cart at sign-in.",
        },
      },
      {
        heading: { fa: "تریدآف", en: "The trade-off" },
        body: {
          fa: "روش من برای محدودیت نرخ، پرهیز بود نه بازیابی: هیچ عقب‌نشینی برای پاسخ ۴۲۹ نوشته نشده و هیچ تایم‌اوتی وصل نیست، هرچند مسیر سیگنال از قبل وجود دارد. یک تریدآف دیگر را هم پنهان نکرده‌ام: چون صفحه‌ی محصول اسکلت بارگذاری دارد، جریان‌سازی پیش از notFound شروع می‌شود و محصول ناموجود با وضعیت ۲۰۰ و noindex برمی‌گردد.",
          en: "My strategy for the rate limit was avoidance, not recovery: there is no backoff for a 429 and no timeout wired up, even though the signal plumbing exists. I did not hide the other trade-off either: because the product page ships a loading skeleton, streaming starts before notFound, so a missing product answers with status 200 and noindex.",
        },
      },
    ],
    notes: [
      {
        title: { fa: "یک نقطه برای همه‌ی درخواست‌ها", en: "One chokepoint for requests" },
        body: {
          fa: "همه‌ی تماس‌ها از یک تابع رد می‌شوند: شکست شبکه به خطای خوانا تبدیل می‌شود، پاسخ ۲۰۴ خالی برمی‌گردد، JSON دفاعی خوانده می‌شود و تنظیم هم‌زمان cache و revalidate خطا می‌دهد.",
          en: "Every call passes one function: network failure becomes a readable error, 204 returns empty, JSON is parsed defensively, and setting both cache and revalidate at once is rejected.",
        },
      },
      {
        title: { fa: "سبدی که از ورود جان سالم می‌برد", en: "A cart that survives sign-in" },
        body: {
          fa: "انتقال سبد مهمان هر خط را جدا می‌فرستد، شکست‌ها را جمع می‌کند و فقط همان‌ها را به حافظه‌ی محلی برمی‌گرداند تا دوباره تلاش شوند؛ و همگام‌سازی پیش از خواندن سبد سرور انجام می‌شود.",
          en: "The guest-cart merge sends each line, collects failures, and writes only those back to local storage for a retry; it also runs before the server cart is read.",
        },
      },
      {
        title: { fa: "چیدمان ماسونری بدون جاوااسکریپت", en: "Masonry without JavaScript" },
        body: {
          fa: "ستون‌های CSS و نسبت‌های ارتفاعی که از نام محصول مشتق می‌شوند، بین یک‌به‌یک و سه‌به‌چهار می‌مانند تا تصویر بریده نشود. قلب ذخیره هم خواهرِ لینک کارت است، نه فرزندش؛ پس هیچ عنصر تعاملی تودرتو نداریم.",
          en: "CSS columns plus height ratios derived from the product slug, kept between 1:1 and 3:4 so artwork is never clipped. The save heart is a sibling of the card link rather than a child, so there are no nested interactive elements.",
        },
      },
    ],
  },
  {
    slug: "flight-lookup",
    index: "02",
    year: "2026",
    title: { fa: "ردیاب پرواز", en: "Flight lookup" },
    tagline: {
      fa: "یک ورودی، یک جواب. پشت این سادگی، یک قرارداد تایپ و یک لایه‌ی نرمال‌سازی نشسته است.",
      en: "One field, one answer. Behind that simplicity sit a single response contract and a normalisation layer.",
    },
    role: { fa: "طراحی و ساخت", en: "Design and build" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "AviationStack"],
    source:
      "https://github.com/asgharnasiri1990/AiProjects/tree/main/flight-tracker",
    figures: [
      { value: "02", label: { fa: "فایل اصلی", en: "Core files" } },
      { value: "18", label: { fa: "فیلد در قرارداد", en: "Fields in the contract" } },
      { value: "60s", label: { fa: "کش سمت سرور", en: "Server cache" } },
    ],
    sections: [
      {
        heading: { fa: "محدودیت", en: "The constraint" },
        body: {
          fa: "کاربر در فرودگاه است، عجله دارد و فقط یک جواب می‌خواهد: تأخیر دارد یا نه. API رایگان هم سخاوتمند نیست؛ کلید باید سمت سرور بماند و هر جست‌وجو فقط یک درخواست ارزش دارد. پس تمام کار باید در یک صفحه و یک مسیر API انجام می‌شد.",
          en: "The user is in a terminal, in a hurry, and wants one answer: is it delayed or not. The free flight API is not generous either; the key has to stay on the server and each lookup deserves exactly one request. So everything had to fit in one page and one route handler.",
        },
      },
      {
        heading: { fa: "ساخت", en: "The build" },
        body: {
          fa: "مسیر API داده‌ی تودرتوی AviationStack را به یک قرارداد صاف با هجده فیلد تبدیل می‌کند و هر فیلد را با مقدار جانشین می‌پوشاند، تا رابط هیچ‌وقت با داده‌ی ناقص نشکند. مدت پرواز روی سرور و از زمان‌های برنامه‌ریزی‌شده حساب می‌شود. برای زمان اصلی یک قاعده وجود دارد — واقعی، بعد تخمینی، بعد برنامه‌ریزی‌شده — و هر سه زمان هم جداگانه نمایش داده می‌شوند.",
          en: "The route handler turns nested AviationStack data into one flat eighteen-field contract, filling every field with a fallback so the UI never breaks on partial data. Duration is computed on the server from the scheduled times. For the headline time there is one rule — actual, then estimated, then scheduled — while all three are still shown separately.",
        },
      },
      {
        heading: { fa: "تریدآف", en: "The trade-off" },
        body: {
          fa: "دو چیز را عمداً رها کردم و بعداً به آن‌ها برمی‌گردم: درخواست‌ها لغو نمی‌شوند، پس دو جست‌وجوی سریع می‌تواند پاسخ قدیمی را روی پاسخ تازه بنشاند؛ و نتیجه‌ی غیرهمزمان با aria-live اعلام نمی‌شود، پس کاربر صفحه‌خوان نمی‌فهمد جواب رسیده است. هیچ‌کدام سخت نیستند؛ فقط هنوز انجام نشده‌اند.",
          en: "Two things I deliberately left for later: requests are not cancelled, so two fast submits can let an old response overwrite a newer one; and the async result is not announced with aria-live, so a screen-reader user is not told the answer arrived. Neither is hard to fix. Neither is fixed yet.",
        },
      },
    ],
    notes: [
      {
        title: { fa: "یک قرارداد، دو طرف", en: "One contract, two sides" },
        body: {
          fa: "تایپ FlightData از مسیر API صادر می‌شود و کلاینت آن را به‌صورت type-only وارد می‌کند. رابط و API نمی‌توانند از هم جدا بیفتند و تایپ در باندل نهایی اثری ندارد.",
          en: "The FlightData type is exported from the route handler and imported by the client as a type-only import. UI and API cannot drift apart, and the type adds nothing to the bundle.",
        },
      },
      {
        title: { fa: "نبودن کلید، یک ویژگی است", en: "A missing key is a feature" },
        body: {
          fa: "اگر کلید نباشد یا همان مقدار نمونه باشد، مسیر API داده‌ی نمایشی برمی‌گرداند و هیچ درخواستی به بیرون نمی‌رود. یعنی سایت بدون هیچ تنظیمی قابل نمایش است و سهمیه‌ی API را هم نمی‌سوزاند.",
          en: "When the key is absent or still the placeholder, the handler returns deterministic demo data and makes no outbound request. The deploy is demonstrable with zero configuration and burns no API quota.",
        },
      },
      {
        title: { fa: "کدام زمان، زمان اصلی است؟", en: "Which time is the time?" },
        body: {
          fa: "یک قاعده‌ی روشن به‌جای سه ساعت رقیب: زمان اصلی از actual، بعد estimated، بعد scheduled می‌آید و هر سه در کارت جداگانه دیده می‌شوند. مدت پرواز فقط وقتی نمایش داده می‌شود که بازه مثبت باشد.",
          en: "One clear rule instead of three competing clocks: the headline time comes from actual, then estimated, then scheduled, and all three are still readable in the card. Duration only renders when the interval is positive.",
        },
      },
    ],
  },
  {
    slug: "this-site",
    index: "03",
    year: "2026",
    title: { fa: "همین سایت", en: "This site" },
    tagline: {
      fa: "یک سایت دوزبانه و کاملاً ایستا، بدون پایگاه داده و بدون CMS؛ محتوا داده است.",
      en: "A bilingual, fully static site with no database and no CMS; the content is data.",
    },
    role: { fa: "طراحی و ساخت", en: "Design and build" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    source: "https://github.com/asgharnasiri1990/AiProjects",
    figures: [
      { value: "02", label: { fa: "زبان", en: "Languages" } },
      { value: "00", label: { fa: "درخواست در زمان اجرا", en: "Runtime fetches" } },
      { value: "01", label: { fa: "چیدمان برای هر دو جهت", en: "Layout for both directions" } },
    ],
    sections: [
      {
        heading: { fa: "محدودیت", en: "The constraint" },
        body: {
          fa: "سایت باید فارسی و انگلیسی باشد، هر دو از یک کد، با جهت درست در هر زبان. نه سروری برای فرم تماس، نه پایگاهی برای نوشته‌ها؛ هر صفحه باید از پیش ساخته شود و روی هر میزبانی کار کند.",
          en: "The site had to be Persian and English, both from one codebase, each with the correct direction. No server for the contact form, no database for the writing; every page prebuilt and deployable anywhere.",
        },
      },
      {
        heading: { fa: "ساخت", en: "The build" },
        body: {
          fa: "چیدمان ریشه زیر مسیر زبان زندگی می‌کند و خودش lang و dir را می‌نویسد؛ یک proxy مسیرهای بدون زبان را به زبان ذخیره‌شده یا فارسی هدایت می‌کند. در چیدمان فقط از ویژگی‌های منطقی استفاده شده تا یک کد در هر دو جهت درست بماند، و فاصله‌ی حروف فقط روی متن لاتین اعمال می‌شود چون اسکریپت فارسی به آن حساس است.",
          en: "The root layout lives under the locale segment and writes lang and dir itself; a proxy sends bare paths to the saved locale, or Persian. Layout uses logical properties only, so one set of components stays correct in both directions, and letter-spacing is applied to Latin text alone because it breaks Persian script.",
        },
      },
      {
        heading: { fa: "تریدآف", en: "The trade-off" },
        body: {
          fa: "بدون CMS، هر تغییر متن یک کامیت است. این برای سایتی که خودم تنها اداره می‌کنم درست است و سرعت و سادگی می‌دهد، ولی اگر کسی جز من بخواهد متن بنویسد، باید یک لایه‌ی محتوا اضافه شود.",
          en: "Without a CMS, changing a sentence is a commit. That is right for a site I maintain alone — it buys speed and simplicity — but the moment someone else needs to write copy, a content layer has to go in.",
        },
      },
    ],
    notes: [
      {
        title: { fa: "محتوا به‌جای JSX", en: "Content, not JSX" },
        body: {
          fa: "هر کلمه در چهار فایل محتوا زندگی می‌کند. اضافه‌کردن یک پروژه یعنی اضافه‌کردن یک شیء، نه ساختن یک صفحه‌ی جدید.",
          en: "Every word lives in four content files. Adding a project means adding an object, not hand-writing a new page.",
        },
      },
      {
        title: { fa: "اعداد در متن فارسی", en: "Numbers inside Persian text" },
        body: {
          fa: "اعدادی که نماد دارند در یک عنصر داخلی با dir برابر ltr قرار می‌گیرند؛ وگرنه دوسویه‌نویسی علامت را به سمت اشتباه می‌برد. بلوک بیرونی جهت خودش را نگه می‌دارد تا با برچسبش هم‌تراز بماند.",
          en: "Numbers that carry symbols sit in an inner dir=ltr element, otherwise bidi moves the sign to the wrong side. The outer block keeps its own direction so it stays aligned with its label.",
        },
      },
      {
        title: { fa: "فرم بدون سرور", en: "A form with no server" },
        body: {
          fa: "فرم تماس فقط در مرورگر اعتبارسنجی می‌کند و یک ایمیل آماده باز می‌کند. هیچ داده‌ای جایی ذخیره نمی‌شود، و سایت ایستا می‌ماند.",
          en: "The contact form validates in the browser and opens a prefilled email. Nothing is stored anywhere, and the site stays static.",
        },
      },
    ],
  },
];

export function getWork(slug: string): Work | undefined {
  return work.find((item) => item.slug === slug);
}

export function nextWork(slug: string): Work {
  const index = work.findIndex((item) => item.slug === slug);
  return work[(index + 1) % work.length];
}
