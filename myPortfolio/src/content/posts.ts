import type { Localized } from "@/lib/i18n";

export type BlockKind = "p" | "h2" | "quote";

export interface Block {
  kind: BlockKind;
  text: Localized;
}

export interface Post {
  slug: string;
  /** ISO date, used for sorting. */
  date: string;
  displayDate: Localized;
  readingTime: number;
  title: Localized;
  summary: Localized;
  tags: string[];
  blocks: Block[];
}

/** Newest first. */
export const posts: Post[] = [
  {
    slug: "before-writing-code",
    date: "2026-10-18",
    displayDate: { fa: "26 مهر 1405", en: "Oct 18, 2026" },
    readingTime: 3,
    title: {
      fa: "پیش از نوشتن کد، چه چیزی را می‌خوانم",
      en: "What I read before I write code",
    },
    summary: {
      fa: "سه سندی که پیش از باز کردن ادیتور می‌خواهم؛ و کاری که وقتی وجود ندارند انجام می‌دهم.",
      en: "Three documents I want before opening an editor, and what I do when they don't exist.",
    },
    tags: ["process"],
    blocks: [
      {
        kind: "p",
        text: {
          fa: "بیشتر خرابی‌های یک رابط پیش از اولین خط کد اتفاق می‌افتد: وقتی هنوز روشن نیست این صفحه برای چه کسی است و بعد از آن چه اتفاقی می‌افتد. من پیش از شروع، سه چیز را می‌خواهم ببینم.",
          en: "Most broken interfaces fail before the first line of code, while nobody can say who the screen is for or what happens next. Before I start, I want to see three things.",
        },
      },
      {
        kind: "h2",
        text: { fa: "یک. جمله‌ی مسئله", en: "One. The problem sentence" },
      },
      {
        kind: "p",
        text: {
          fa: "یک جمله، نه یک لیست قابلیت: «کاربر باید بتواند سفارش دیروزش را در کمتر از ده ثانیه پیدا کند.» اگر نتوانیم این جمله را بنویسیم، طراحی هنوز شروع نشده است.",
          en: "One sentence, not a feature list: “someone should find yesterday's order in under ten seconds.” If we cannot write that sentence, the design has not started.",
        },
      },
      {
        kind: "h2",
        text: { fa: "دو. متن واقعی", en: "Two. Real copy" },
      },
      {
        kind: "p",
        text: {
          fa: "متن جایگزین فارسی تقریباً همیشه دروغ می‌گوید؛ چون طول واقعی، محل شکستن خط و اعداد را پنهان می‌کند. من با نام واقعی محصول، قیمت واقعی و پیام خطای واقعی طراحی می‌کنم.",
          en: "Placeholder copy lies, especially in Persian: it hides the real length, the real line breaks and the real numbers. I design with the actual product name, the actual price and the actual error message.",
        },
      },
      {
        kind: "h2",
        text: { fa: "سه. محدودیت‌ها", en: "Three. The constraints" },
      },
      {
        kind: "p",
        text: {
          fa: "سقف درخواست API، بودجه‌ی عملکرد، دسترس‌پذیری و راست‌به‌چپ. اینها ویژگی‌هایی نیستند که آخر کار اضافه شوند؛ شکل رابط را از همان اول تعیین می‌کنند.",
          en: "API limits, the performance budget, accessibility and right-to-left text. These are not features added at the end; they decide the shape of the interface from the start.",
        },
      },
      {
        kind: "p",
        text: {
          fa: "وقتی هیچ‌کدام از اینها نیست، سعی نمی‌کنم همه‌چیز را حدس بزنم. کوچک‌ترین تکه‌ی واقعی را می‌سازم: یک صفحه، با داده‌ی واقعی، و آن را جلوی کاربر می‌گذارم.",
          en: "When none of it exists, I don't try to guess everything. I build the smallest real slice — one screen, real data — and put it in front of the person who will use it.",
        },
      },
      {
        kind: "quote",
        text: {
          fa: "اگر نمی‌توانی مسئله را در یک جمله بگویی، هنوز مسئله را نمی‌شناسی.",
          en: "If you cannot state the problem in one sentence, you do not know the problem yet.",
        },
      },
    ],
  },
  {
    slug: "persian-typography",
    date: "2026-09-27",
    displayDate: { fa: "5 مهر 1405", en: "Sep 27, 2026" },
    readingTime: 4,
    title: {
      fa: "تایپوگرافی فارسی یک تصمیم محصولی است",
      en: "Persian typography is a product decision",
    },
    summary: {
      fa: "چرا فاصله خطوط، اندازه قلم و اعداد را باید در همان ابتدا تصمیم گرفت.",
      en: "Why line height, type size and numerals are decisions to make at the start.",
    },
    tags: ["typography", "rtl"],
    blocks: [
      {
        kind: "p",
        text: {
          fa: "در فارسی، تایپوگرافی فقط زیبایی نیست. فاصله خطوط کم، متن را خفه می‌کند؛ اندازه قلم کوچک، حروف چسبیده را ناخوانا می‌سازد؛ و اعداد لاتین در کنار متن فارسی می‌توانند ریتم جمله را بشکنند.",
          en: "In Persian, typography is not decoration. Tight line height suffocates a paragraph, small type makes connected letters hard to read, and Latin numerals dropped into Persian text can break the rhythm of a sentence.",
        },
      },
      {
        kind: "h2",
        text: { fa: "با متن واقعی تست کن", en: "Test with real copy" },
      },
      {
        kind: "p",
        text: {
          fa: "لورم ایپسوم فارسی وجود ندارد. اگر رابط را با «متن نمونه» بسازی، اولین نوشته‌ی واقعی کارت را می‌شکند. من همیشه با بلندترین عنوانی که ممکن است، تست می‌کنم.",
          en: "There is no Persian lorem ipsum. Build an interface around sample text and the first real paragraph will break it. I always test with the longest plausible title.",
        },
      },
      {
        kind: "h2",
        text: { fa: "اعداد را تصمیم بگیر", en: "Decide about numerals" },
      },
      {
        kind: "p",
        text: {
          fa: "عدد، تاریخ و قیمت باید یک قاعده‌ی ثابت داشته باشند. من در متن فارسی اعداد فارسی می‌گذارم و در برچسب‌های فنی، لاتین. مهم این است که همین قاعده در کل محصول یکسان بماند.",
          en: "Numbers, dates and prices need one consistent rule. I use Persian numerals in prose and Latin ones in technical labels. What matters is that the same rule holds across the product.",
        },
      },
      {
        kind: "h2",
        text: { fa: "فاصله خطوط، نه فاصله حروف", en: "Line height, not letter spacing" },
      },
      {
        kind: "p",
        text: {
          fa: "اضافه کردن فاصله‌ی حروف به متن فارسی، حروف را از هم جدا می‌کند. اگر به فضای بیشتری نیاز داری، فاصله‌ی خطوط را زیاد کن. همین یک تغییر، بیشتر از هر فونت تازه‌ای به خوانایی کمک می‌کند.",
          en: "Letter spacing pulls Persian letters apart. If you need more air, increase the line height — that single change helps readability more than any new font.",
        },
      },
      {
        kind: "quote",
        text: {
          fa: "تایپوگرافی خوب دیده نمی‌شود؛ فقط وقتی بد است حس می‌شود.",
          en: "Good typography is invisible. You only feel it when it is wrong.",
        },
      },
    ],
  },
  {
    slug: "sixty-request-budget",
    date: "2026-08-30",
    displayDate: { fa: "8 شهریور 1405", en: "Aug 30, 2026" },
    readingTime: 4,
    title: {
      fa: "طراحی در محدودیت ۶۰ درخواست در دقیقه",
      en: "Designing inside a sixty-request budget",
    },
    summary: {
      fa: "وقتی API سقف دارد، رابط باید باهوش‌تر شود، نه کندتر.",
      en: "When the API has a ceiling, the interface has to get smarter, not slower.",
    },
    tags: ["performance", "api"],
    blocks: [
      {
        kind: "p",
        text: {
          fa: "روی فروشگاهی کار می‌کردم که API عمومی‌اش دقیقاً ۶۰ درخواست در دقیقه اجازه می‌داد. هر صفحه‌ی جدید فقط یک درخواست نبود؛ یک تصمیم طراحی بود.",
          en: "I worked on a storefront whose public API allowed exactly sixty requests a minute. Every new screen was not just a request; it was a design decision.",
        },
      },
      {
        kind: "h2",
        text: { fa: "هر درخواست را توجیه کن", en: "Justify every request" },
      },
      {
        kind: "p",
        text: {
          fa: "اول می‌پرسیدم این داده واقعاً لازم است یا فقط «خوب است داشته باشیم»؟ نتیجه این شد که فیلترها در URL زندگی کنند و صفحه فقط همان چیزی را بگیرد که نشان می‌دهد.",
          en: "First question: is this data required, or just nice to have? The answer moved filters into the URL and kept each page to exactly the data it displays.",
        },
      },
      {
        kind: "h2",
        text: { fa: "کش، به‌جای تکرار", en: "Cache instead of repeating" },
      },
      {
        kind: "p",
        text: {
          fa: "دسته‌بندی‌ها را پنج دقیقه کش کردم و درخواست‌های هم‌زمان را با React.cache یکی کردم. همین دو کار، بار صفحه‌ی محصول را تقریباً نصف کرد.",
          en: "I cached categories for five minutes and deduplicated concurrent calls with React.cache. Those two changes cut the cost of a product page roughly in half.",
        },
      },
      {
        kind: "h2",
        text: { fa: "رابط نباید منتظر بماند", en: "The interface should not wait" },
      },
      {
        kind: "p",
        text: {
          fa: "جایی که نمی‌شد درخواست را کم کرد، تجربه را تغییر دادم: اسکلتون، به‌روزرسانی خوش‌بینانه و پیام خطای روشن. محدودیت API تبدیل شد به دلیل خوبی برای ساده‌تر کردن رابط.",
          en: "Where a request could not be removed, I changed the experience: skeletons, optimistic updates and a clear error message. The API limit became a good reason to simplify the interface.",
        },
      },
      {
        kind: "quote",
        text: {
          fa: "وقتی منابع کم است، طراحی مهم می‌شود.",
          en: "When resources are scarce, design starts to matter.",
        },
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
