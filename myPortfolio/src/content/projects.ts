import type { Localized } from "@/lib/i18n";

export interface ProjectVersion {
  value: string;
  label: Localized;
}

export interface ProjectSection {
  heading: Localized;
  body: Localized;
}

export interface Project {
  slug: string;
  index: string;
  year: string;
  /** Public path to the cover photo. */
  cover: string;
  title: Localized;
  tagline: Localized;
  role: Localized;
  stack: string[];
  highlights: Localized[];
  tradeoff: Localized;
  metrics: ProjectVersion[];
  sections: ProjectSection[];
}

/**
 * Placeholder case studies — swap them for your own work.
 * `slug` becomes the URL: /fa/work/<slug>.
 */
export const projects: Project[] = [
  {
    slug: "kaveh-storefront",
    index: "01",
    year: "2026",
    cover: "/images/kaveh.webp",
    title: {
      fa: "کاوه — فروشگاه لوازم خانه",
      en: "Kaveh — Homeware Storefront",
    },
    tagline: {
      fa: "فروشگاه دوزبانه برای یک برند مستقل لوازم خانه، با تمرکز بر تصویر محصول و خرید بدون اصطکاک.",
      en: "A bilingual storefront for an independent homeware brand, built around product photography and frictionless checkout.",
    },
    role: {
      fa: "طراحی رابط کاربری و توسعه فرانت‌اند",
      en: "Interface design & front-end development",
    },
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    tradeoff: {
      fa: "تصاویر API را همان‌جا نرمال کردم و نسخه‌ی خودمان را ذخیره نکردم؛ این کار هر بار یک قدم به بارگذاری اضافه می‌کند، ولی هیچ محصولی دیگر بریده نمی‌شود.",
      en: "I normalise images from the API at render time instead of storing our own copies. It adds a step to every load, but no product is ever cropped.",
    },
    highlights: [
      {
        fa: "بازطراحی صفحه محصول با تصویر بزرگ و انتخاب سریع تنوع",
        en: "Redesigned the product page around a large image and quick variant selection",
      },
      {
        fa: "پیاده‌سازی چیدمان ماسونری با CSS برای فید الهام‌گرفته از پینترست",
        en: "Built a CSS-columns masonry feed inspired by Pinterest",
      },
      {
        fa: "کاهش مراحل تسویه حساب از پنج مرحله به سه مرحله",
        en: "Cut checkout from five steps down to three",
      },
    ],
    metrics: [
      { value: "+38%", label: { fa: "نرخ تبدیل", en: "Conversion rate" } },
      { value: "1.1s", label: { fa: "LCP روی موبایل", en: "Mobile LCP" } },
      { value: "4.8/5", label: { fa: "رضایت کاربران", en: "Customer rating" } },
    ],
    sections: [
      {
        heading: { fa: "مسئله", en: "The problem" },
        body: {
          fa: "کاربران موبایل بیشتر از صفحه محصول خارج می‌شدند. تصاویر کوچک، انتخاب تنوع پیچیده و فرآیند خرید پنج‌مرحله‌ای باعث می‌شد سبد خرید نیمه‌کاره رها شود.",
          en: "Mobile visitors kept leaving the product page. Small images, a confusing variant picker and a five-step checkout meant carts were abandoned halfway through.",
        },
      },
      {
        heading: { fa: "رویکرد", en: "The approach" },
        body: {
          fa: "صفحه محصول را به یک ستون واحد تبدیل کردم: تصویر بزرگ، قیمت و انتخاب تنوع در بالای صفحه، و دکمه خرید همیشه در دسترس. تصاویر از API می‌آمدند، پس یک لایه نرمال‌سازی برای ابعاد و نسبت تصویر ساختم تا هیچ محصولی بریده نشود.",
          en: "I turned the product page into a single column: a large image, price and variants at the top, and a buy button that is always within reach. Images came from an API, so I added a normalisation layer for dimensions and aspect ratio to make sure no product was ever cropped.",
        },
      },
      {
        heading: { fa: "نتیجه", en: "The outcome" },
        body: {
          fa: "در سه ماه اول، نرخ تکمیل خرید 38 درصد رشد کرد و زمان بارگذاری صفحه محصول به کمتر از 1.2 ثانیه رسید.",
          en: "In the first three months checkout completion grew by 38% and the product page loaded in under 1.2 seconds.",
        },
      },
    ],
  },
  {
    slug: "parvaz-flight-tracker",
    index: "02",
    year: "2025",
    cover: "/images/parvaz.webp",
    title: {
      fa: "پرواز — ردیابی زنده پروازها",
      en: "Parvaz — Live Flight Tracking",
    },
    tagline: {
      fa: "داشبوردی سبک برای جست‌وجوی پرواز، دیدن مسیر و وضعیت لحظه‌ای، مناسب استفاده در فرودگاه.",
      en: "A lightweight dashboard for searching flights, reading routes and checking live status, designed for use in a terminal.",
    },
    role: {
      fa: "طراحی محصول و توسعه فرانت‌اند",
      en: "Product design & front-end development",
    },
    stack: ["React", "TypeScript", "Route Handlers", "MapLibre"],
    tradeoff: {
      fa: "مسیر پرواز را با SVG ساده کشیدم، نه با کتابخانه‌ی سنگین نقشه؛ بار اولیه کمتر شد و مسیرها دقیق‌ترند، ولی زوم تعاملی نداریم.",
      en: "Routes are drawn as plain SVG rather than a map library: a lighter first load and precise paths, at the cost of no interactive zoom.",
    },
    highlights: [
      {
        fa: "نقشه مسیر با پشتیبانی راست‌به‌چپ و بدون کتابخانه سنگین نقشه",
        en: "A route map with full RTL support and no heavy map library",
      },
      {
        fa: "کش نتایج جست‌وجو در سمت سرور برای احترام به محدودیت API",
        en: "Server-side search caching to stay inside the API rate limit",
      },
      {
        fa: "حالت کم‌نور برای استفاده در کابین و سالن فرودگاه",
        en: "A low-light mode for cabins and terminal halls",
      },
    ],
    metrics: [
      { value: "0.9s", label: { fa: "زمان اولین پاسخ", en: "Time to first response" } },
      { value: "2×", label: { fa: "جست‌وجوی روزانه", en: "Daily searches" } },
      { value: "AA", label: { fa: "سطح دسترس‌پذیری", en: "Accessibility level" } },
    ],
    sections: [
      {
        heading: { fa: "مسئله", en: "The problem" },
        body: {
          fa: "جست‌وجوی پرواز در سایت‌های موجود کند بود و روی موبایل با اینترنت ضعیف فرودگاه کار نمی‌کرد. کاربر معمولاً عجله دارد و فقط یک عدد می‌خواهد: تأخیر دارد یا نه.",
          en: "Flight lookup on existing sites was slow and fell apart on a weak mobile connection at the airport. People are in a hurry and want one answer: is it delayed or not.",
        },
      },
      {
        heading: { fa: "رویکرد", en: "The approach" },
        body: {
          fa: "یک صفحه واحد با یک ورودی جست‌وجو ساختم. نتایج سمت سرور کش می‌شدند و نقشه فقط وقتی لازم بود بارگذاری می‌شد؛ این کار هم مصرف API را کم کرد و هم زمان بارگذاری را. وضعیت پرواز با یک نشانگر رنگی و یک جمله روشن خوانده می‌شد.",
          en: "I built a single page with one search input. Results were cached on the server and the map loaded only when needed, which cut both API usage and load time. Flight status is read through one colour indicator and one plain sentence.",
        },
      },
      {
        heading: { fa: "نتیجه", en: "The outcome" },
        body: {
          fa: "صفحه در کمتر از یک ثانیه پاسخ می‌داد و حتی با اتصال ضعیف هم قابل استفاده بود. شمار جست‌وجوهای روزانه دو برابر شد.",
          en: "The page responded in under a second and stayed usable on a poor connection. Daily searches doubled.",
        },
      },
    ],
  },
  {
    slug: "saba-design-system",
    index: "03",
    year: "2025",
    cover: "/images/saba.webp",
    title: {
      fa: "صبا — سیستم طراحی فینتک",
      en: "Saba — Fintech Design System",
    },
    tagline: {
      fa: "یک زبان طراحی مشترک برای پنج محصول مالی؛ از توکن‌های رنگ تا الگوهای دسترس‌پذیر.",
      en: "One shared design language for five financial products, from colour tokens to accessible patterns.",
    },
    role: {
      fa: "معماری سیستم طراحی",
      en: "Design system architecture",
    },
    stack: ["Design Tokens", "React", "Storybook", "WCAG 2.2"],
    tradeoff: {
      fa: "توکن‌ها در یک پکیج مشترک و نسخه‌بندی‌شده زندگی می‌کنند؛ هماهنگی بیشتر شد، ولی انتشار یک تغییر کوچک از کپی‌کردن کندتر است.",
      en: "Tokens live in one shared, versioned package: much better consistency, but shipping a small change is slower than copying it.",
    },
    highlights: [
      {
        fa: "تعریف توکن‌های معنایی و تولید خودکار CSS و TypeScript از یک منبع",
        en: "Defined semantic tokens with CSS and TypeScript generated from one source",
      },
      {
        fa: "مستندسازی زنده‌ی هر کامپوننت با مثال فارسی و انگلیسی",
        en: "Live documentation for every component, with Persian and English examples",
      },
      {
        fa: "بازبینی دسترس‌پذیری همه الگوها بر اساس WCAG 2.2 سطح AA",
        en: "Audited every pattern against WCAG 2.2 level AA",
      },
    ],
    metrics: [
      { value: "5", label: { fa: "محصول یکپارچه", en: "Products unified" } },
      { value: "−40%", label: { fa: "زمان ساخت رابط", en: "UI build time" } },
      { value: "100%", label: { fa: "پوشش تست دسترس‌پذیری", en: "A11y test coverage" } },
    ],
    sections: [
      {
        heading: { fa: "مسئله", en: "The problem" },
        body: {
          fa: "هر محصول رنگ، فاصله و دکمه‌های خودش را داشت؛ تغییر یک الگو در پنج تیم یعنی پنج پیاده‌سازی متفاوت. طراحان درباره‌ی جزئیات تکرارشونده بحث می‌کردند، نه درباره‌ی مسئله محصول.",
          en: "Every product had its own colours, spacing and buttons. Changing one pattern across five teams meant five different implementations, and designers spent reviews arguing about repeated details instead of the product problem.",
        },
      },
      {
        heading: { fa: "رویکرد", en: "The approach" },
        body: {
          fa: "توکن‌ها را از سطح پایه به سطح معنایی تقسیم کردم و برای هر کامپوننت قرارداد روشنی نوشتم. مستندات با مثال‌های واقعی دوزبانه کامل شد تا تیم‌ها به‌جای کپی‌کردن، از منبع استفاده کنند. هر الگو پیش از انتشار یک تست دسترس‌پذیری داشت.",
          en: "I split tokens from primitive to semantic levels and wrote a clear contract for each component. Documentation was filled with real bilingual examples so teams would use the source instead of copying it. Every pattern shipped only after an accessibility test.",
        },
      },
      {
        heading: { fa: "نتیجه", en: "The outcome" },
        body: {
          fa: "زمان ساخت یک صفحه جدید چهل درصد کم شد و بازبینی‌های طراحی به‌جای بحث درباره‌ی جزئیات، روی مسئله محصول تمرکز کرد.",
          en: "Building a new screen became 40% faster, and design reviews moved from detail debates back to the product problem.",
        },
      },
    ],
  },
  {
    slug: "daftar-notebook",
    index: "04",
    year: "2024",
    cover: "/images/daftar.webp",
    title: {
      fa: "دفتر — یادداشت دوزبانه",
      en: "Daftar — A Bilingual Notebook",
    },
    tagline: {
      fa: "اپلیکیشنی برای نوشتن و خواندن متن فارسی و انگلیسی در کنار هم، با تایپوگرافی درست.",
      en: "An app for writing and reading Persian and English side by side, with typography that behaves.",
    },
    role: {
      fa: "طراحی و توسعه مستقل",
      en: "Independent design & build",
    },
    stack: ["PWA", "IndexedDB", "Vazirmatn", "Service Worker"],
    tradeoff: {
      fa: "همه‌چیز محلی ذخیره می‌شود و حساب کاربری وجود ندارد؛ حریم خصوصی و کار آفلاین کامل است، ولی همگام‌سازی بین دستگاه‌ها نداریم.",
      en: "Everything is stored locally with no accounts: full privacy and offline use, but no sync between devices.",
    },
    highlights: [
      {
        fa: "چیدمان دوستونه با تشخیص خودکار جهت هر بلوک متن",
        en: "Two-column layout with automatic direction per text block",
      },
      {
        fa: "ذخیره‌سازی محلی و کار کامل بدون اینترنت",
        en: "Local storage and a fully offline experience",
      },
      {
        fa: "تنظیمات تایپوگرافی برای فاصله خطوط و اندازه قلم فارسی",
        en: "Typography settings for Persian line height and type size",
      },
    ],
    metrics: [
      { value: "12k", label: { fa: "کاربر ماهانه", en: "Monthly readers" } },
      { value: "4.7/5", label: { fa: "امتیاز کاربران", en: "User rating" } },
      { value: "100", label: { fa: "امتیاز Lighthouse", en: "Lighthouse score" } },
    ],
    sections: [
      {
        heading: { fa: "مسئله", en: "The problem" },
        body: {
          fa: "نوشتن متن فارسی و انگلیسی در ویرایشگرهای معمول باعث می‌شد جهت متن، اعداد و نشانه‌گذاری به‌هم بریزد. نویسندگان دوزبانه مجبور بودند بین دو برنامه جابه‌جا شوند.",
          en: "Writing Persian and English in ordinary editors broke direction, numerals and punctuation. Bilingual writers had to keep switching between two apps.",
        },
      },
      {
        heading: { fa: "رویکرد", en: "The approach" },
        body: {
          fa: "هر بلوک متن جهت خودش را از محتوا می‌گرفت، نه از تنظیم کلی صفحه. فونت وزیرمتن برای متن فارسی و تنظیمات جداگانه برای فاصله خطوط اضافه شد. همه‌چیز محلی ذخیره می‌شد تا کاربر بدون اینترنت هم بنویسد.",
          en: "Each text block took its direction from its contents rather than a page-wide setting. Vazirmatn handled Persian text, with separate controls for line height. Everything was stored locally so people could write without a connection.",
        },
      },
      {
        heading: { fa: "نتیجه", en: "The outcome" },
        body: {
          fa: "دفتر به یکی از ابزارهای روزانه‌ی نویسندگان دوزبانه تبدیل شد و در سال اول دوازده هزار کاربر ماهانه داشت.",
          en: "Daftar became a daily tool for bilingual writers and reached twelve thousand monthly readers in its first year.",
        },
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
