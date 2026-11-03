import type { Locale } from "@/lib/i18n";

export interface Fact {
  value: string;
  label: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface TimelineEntry {
  period: string;
  title: string;
  detail: string;
}

export interface Copy {
  metaTitle: string;
  metaDescription: string;

  nav: {
    work: string;
    archive: string;
    about: string;
    contact: string;
  };

  skipToContent: string;
  switchLanguage: string;
  openMenu: string;
  closeMenu: string;
  externalLink: string;

  availability: string;
  heroStatement: string;
  heroLead: string;
  ctaWork: string;
  ctaContact: string;

  facts: Fact[];

  workTitle: string;
  workLead: string;
  workAll: string;
  workView: string;

  archiveTitle: string;
  archiveLead: string;
  archiveAll: string;

  aboutTitle: string;
  aboutLead: string;
  aboutBody: string[];
  skillsTitle: string;
  skills: SkillGroup[];
  timelineTitle: string;
  timeline: TimelineEntry[];

  processTitle: string;
  processLead: string;
  process: { title: string; body: string }[];

  contactTitle: string;
  contactLead: string;
  contactEmail: string;
  contactSocials: string;
  formTitle: string;
  formName: string;
  formEmail: string;
  formMessage: string;
  formSubmit: string;
  formNote: string;
  formError: string;
  formSubject: string;
  formDirect: string;

  footerNote: string;
  footerBuilt: string;
  footerSource: string;

  caseBack: string;
  caseRole: string;
  caseYear: string;
  caseStack: string;
  caseSource: string;
  caseFigures: string;
  caseNotes: string;
  caseNext: string;
  caseIndex: string;

  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
}

export const copy: Record<Locale, Copy> = {
  fa: {
    metaTitle: "اصغر نصیری — توسعه‌دهنده فرانت‌اند",
    metaDescription:
      "اصغر نصیری، توسعه‌دهنده فرانت‌اند در تهران. ساخت رابط‌های سریع، در دسترس و راست‌به‌چپ با React، Next.js و TypeScript.",

    nav: {
      work: "کار",
      archive: "بایگانی",
      about: "درباره",
      contact: "تماس",
    },

    skipToContent: "رفتن به محتوای اصلی",
    switchLanguage: "تغییر زبان به انگلیسی",
    openMenu: "باز کردن منو",
    closeMenu: "بستن منو",
    externalLink: "در صفحه‌ی جدید باز می‌شود",

    availability: "آماده‌ی همکاری",
    heroStatement: "رابط‌هایی می‌سازم که سر راه نمی‌ایستند.",
    heroLead:
      "توسعه‌دهنده‌ی فرانت‌اند در تهران. بیشتر با React، Next.js و TypeScript کار می‌کنم و به بخش‌های دیده‌نشده اهمیت می‌دهم: راست‌به‌چپِ درست، دسترس‌پذیری واقعی و صفحه‌هایی که روی اتصال ضعیف هم سریع می‌مانند.",
    ctaWork: "دیدن کارها",
    ctaContact: "نوشتن پیام",

    facts: [
      { value: "03", label: "اپلیکیشن کامل" },
      { value: "06", label: "مخزن عمومی" },
      { value: "02", label: "زبان رابط" },
    ],

    workTitle: "کارهای منتخب",
    workLead:
      "سه اپلیکیشن که از صفر در همین مخزن ساخته شده‌اند. هیچ‌کدام ماکاپ نبوده‌اند؛ هر کدام با یک محدودیت واقعی شروع شده است.",
    workAll: "همه‌ی کارها",
    workView: "خواندن شرح پروژه",

    archiveTitle: "بایگانی",
    archiveLead:
      "تمرین‌ها و ساختن‌های کوچک‌تر از همان دوره؛ بخشی از یادگیری که معمولاً نشان داده نمی‌شود.",
    archiveAll: "همه‌ی مخزن‌ها",

    aboutTitle: "درباره",
    aboutLead:
      "فرانت‌اند را با ساختن یاد می‌گیرم، نه با تماشا کردن.",
    aboutBody: [
      "من اصغر هستم. مسیرم از تمرین‌های جاوااسکریپت شروع شد و به ساخت اپلیکیشن‌های کامل با React و Next.js رسید. ترجیح می‌دهم یک چیز را تا آخر بسازم و منتشر کنم تا اینکه ده چیز را نیمه‌کاره رها کنم.",
      "بیشتر از هر چیز به جزئیاتی علاقه دارم که کاربر نمی‌بیند: جهت متن، فاصله‌ی خطوط فارسی، حالت فوکوس، پیام‌های خطا و رفتار صفحه وقتی اینترنت ضعیف است. این‌ها همان جاهایی هستند که یک رابط یا قابل‌اعتماد می‌شود یا نمی‌شود.",
      "الان روی درست کردن همین جزئیات در پروژه‌های خودم تمرکز دارم و دنبال فرصتی برای انجامش در یک تیم هستم.",
    ],
    skillsTitle: "ابزارها",
    skills: [
      {
        title: "روزمره",
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        title: "در کنارش",
        items: ["Node.js", "JavaScript", "Python", "Git"],
      },
      {
        title: "اهمیت دارد",
        items: ["رابط راست‌به‌چپ", "دسترس‌پذیری", "تایپوگرافی", "کارایی"],
      },
    ],
    timelineTitle: "مسیر",
    timeline: [
      {
        period: "۲۰۲۵",
        title: "ترم سوم — جاوااسکریپت و Node.js",
        detail: "تمرین‌های پایه‌ی زبان و اولین سرویس‌های سمت سرور.",
      },
      {
        period: "۲۰۲۶",
        title: "ترم چهارم — React، Next.js و Tailwind",
        detail: "کامپوننت، مسیریابی، داده‌گیری و چیدمان با ابزارهای امروزی.",
      },
      {
        period: "۲۰۲۶",
        title: "سه اپلیکیشن کامل",
        detail: "فروشگاه، ردیاب پرواز و همین سایت؛ از طراحی تا انتشار.",
      },
    ],

    processTitle: "روش کار",
    processLead:
      "چهار مرحله که هر پروژه از آن‌ها رد می‌شود. هیچ‌کدام جذاب نیستند و همه‌شان لازم‌اند.",
    process: [
      {
        title: "اول مسئله",
        body: "پیش از هر خط کد، کد موجود، API و محدودیت‌ها را می‌خوانم. بیشتر کار همین است: فهمیدن اینکه واقعاً چه چیزی خراب است.",
      },
      {
        title: "طرح در مرورگر",
        body: "اول یک صفحه با داده‌ی واقعی؛ نه ماکاپی که دروغ می‌گوید. چیدمان پیش از کامپوننت.",
      },
      {
        title: "ساختن بخش‌های خسته‌کننده",
        body: "حالت خالی، پیام خطا، فوکوس با کیبورد، راست‌به‌چپ. این‌ها را کاربر حس می‌کند و کسی نمایششان نمی‌دهد.",
      },
      {
        title: "انتشار و بررسی",
        body: "تایپ‌چک، بیلد، و بعد کلیک‌کردن روی صفحه‌ی باریک. اگر فقط روی سیستم من کار کند، تمام نشده است.",
      },
    ],

    contactTitle: "بنویسید.",
    contactLead:
      "اگر تیمی هستید که به یک فرانت‌اندِ دقیق نیاز دارد، یا پروژه‌ای دارید که باید درست ساخته شود، ایمیل من باز است. معمولاً در دو روز کاری پاسخ می‌دهم.",
    contactEmail: "ایمیل",
    contactSocials: "جای دیگر",
    formTitle: "یا از همین‌جا بنویسید",
    formName: "نام",
    formEmail: "ایمیل",
    formMessage: "پیام",
    formSubmit: "آماده‌کردن ایمیل",
    formNote:
      "این فرم پیام را در برنامه‌ی ایمیل شما آماده می‌کند؛ چیزی روی سرور ذخیره نمی‌شود.",
    formError: "لطفاً نام، ایمیل و پیام را کامل کنید.",
    formSubject: "پیام از وب‌سایت",
    formDirect: "یا مستقیم بنویسید:",

    footerNote: "طراحی و ساخت با دقت.",
    footerBuilt: "ساخته‌شده با Next.js، بدون پایگاه داده.",
    footerSource: "کد این سایت",

    caseBack: "بازگشت به کارها",
    caseRole: "نقش",
    caseYear: "سال",
    caseStack: "ابزارها",
    caseSource: "کد",
    caseFigures: "در یک نگاه",
    caseNotes: "تصمیم‌ها",
    caseNext: "پروژه‌ی بعدی",
    caseIndex: "فهرست",

    notFoundTitle: "این صفحه پیدا نشد",
    notFoundBody: "ممکن است نشانی تغییر کرده باشد یا صفحه حذف شده باشد.",
    notFoundCta: "بازگشت به خانه",
  },

  en: {
    metaTitle: "Asghar Nasiri — Front-end developer",
    metaDescription:
      "Asghar Nasiri, a front-end developer in Tehran building fast, accessible, right-to-left interfaces with React, Next.js and TypeScript.",

    nav: {
      work: "Work",
      archive: "Archive",
      about: "About",
      contact: "Contact",
    },

    skipToContent: "Skip to content",
    switchLanguage: "Switch language to Persian",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    externalLink: "opens in a new tab",

    availability: "Open to work",
    heroStatement: "I build interfaces that get out of the way.",
    heroLead:
      "Front-end developer in Tehran. I work mostly in React, Next.js and TypeScript, and I care about the unglamorous parts: correct right-to-left layout, real accessibility, and pages that stay fast on a weak connection.",
    ctaWork: "See the work",
    ctaContact: "Write to me",

    facts: [
      { value: "03", label: "Shipped apps" },
      { value: "06", label: "Public repos" },
      { value: "02", label: "Site languages" },
    ],

    workTitle: "Selected work",
    workLead:
      "Three apps built from scratch in this one repository. None of them are mockups; each started with a real constraint.",
    workAll: "All work",
    workView: "Read the case study",

    archiveTitle: "Archive",
    archiveLead:
      "Exercises and smaller builds from the same period — the part of learning that rarely gets shown.",
    archiveAll: "All repositories",

    aboutTitle: "About",
    aboutLead: "I learn front-end by building it, not by watching it.",
    aboutBody: [
      "I am Asghar. I started with JavaScript exercises and ended up shipping complete apps in React and Next.js. I would rather finish one thing and publish it than leave ten things half-built.",
      "What I care about most is the detail the user never notices: text direction, Persian line height, focus states, error messages, and what a page does on a poor connection. Those are the places where an interface becomes trustworthy, or does not.",
      "Right now I am sharpening exactly those details in my own projects, and looking for a team where I can do it for real.",
    ],
    skillsTitle: "Tools",
    skills: [
      {
        title: "Daily",
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        title: "Alongside",
        items: ["Node.js", "JavaScript", "Python", "Git"],
      },
      {
        title: "I care about",
        items: ["RTL interfaces", "Accessibility", "Typography", "Performance"],
      },
    ],
    timelineTitle: "Path",
    timeline: [
      {
        period: "2025",
        title: "Term three — JavaScript and Node.js",
        detail: "Language fundamentals and the first server-side services.",
      },
      {
        period: "2026",
        title: "Term four — React, Next.js and Tailwind",
        detail: "Components, routing, data fetching and layout with current tools.",
      },
      {
        period: "2026",
        title: "Three complete apps",
        detail: "A storefront, a flight tracker and this site; from design to deploy.",
      },
    ],

    processTitle: "How I work",
    processLead:
      "Four steps every project goes through. None of them are glamorous, and all of them are necessary.",
    process: [
      {
        title: "The problem first",
        body: "Before a line of code I read what exists: the code, the API, the constraints. Most of the work is finding out what is actually broken.",
      },
      {
        title: "Sketch in the browser",
        body: "One page with real data, not a mockup that lies. Layout first, components second.",
      },
      {
        title: "Build the boring parts",
        body: "Empty states, error messages, keyboard focus, right-to-left. Users feel these and nobody demos them.",
      },
      {
        title: "Ship, then check",
        body: "Typecheck, build, then click through it on a narrow screen. If it only works on my machine, it is not done.",
      },
    ],

    contactTitle: "Say hello.",
    contactLead:
      "If you are a team that needs a careful front-end, or you have a project that has to be built properly, my inbox is open. I usually reply within two working days.",
    contactEmail: "Email",
    contactSocials: "Elsewhere",
    formTitle: "Or write from here",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formSubmit: "Prepare the email",
    formNote:
      "This opens your mail app with the message ready. Nothing is stored on a server.",
    formError: "Please fill in your name, email and message.",
    formSubject: "Message from the website",
    formDirect: "Or write directly:",

    footerNote: "Designed and built with care.",
    footerBuilt: "Built with Next.js, no database.",
    footerSource: "Source of this site",

    caseBack: "Back to work",
    caseRole: "Role",
    caseYear: "Year",
    caseStack: "Stack",
    caseSource: "Source",
    caseFigures: "At a glance",
    caseNotes: "Decisions",
    caseNext: "Next project",
    caseIndex: "Index",

    notFoundTitle: "This page could not be found",
    notFoundBody: "The address may have changed, or the page may have been removed.",
    notFoundCta: "Back to home",
  },
};
