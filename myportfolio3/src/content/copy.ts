import type { Locale } from "@/lib/i18n";

export interface Fact {
  value: string;
  label: string;
}

export interface Service {
  index: string;
  title: string;
  body: string;
}

export interface Copy {
  metaTitle: string;
  metaDescription: string;

  nav: {
    home: string;
    about: string;
    services: string;
    projects: string;
  };

  skipToContent: string;
  switchLanguage: string;
  openMenu: string;
  closeMenu: string;
  externalLink: string;

  heroLines: [string, string];
  heroMeta: string;
  heroLocation: string;
  heroStatement: string;
  heroServices: string[];
  heroCta: string;
  availability: string;
  portraitAlt: string;

  aboutLabel: string;
  aboutQuote: string;
  aboutBody: string;
  facts: Fact[];

  workLabel: string;
  workAll: string;
  workWeb: string;
  workTools: string;
  workSource: string;

  servicesLabel: string;
  servicesTitle: string;
  servicesLead: string;
  services: Service[];

  contactLabel: string;
  contactTitle: string;
  contactLead: string;
  contactCta: string;
  contactEmail: string;

  footerRights: string;
  footerCredit: string;

  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
}

export const copy: Record<Locale, Copy> = {
  en: {
    metaTitle: "Asghar Nasiri — Front-end developer",
    metaDescription:
      "Asghar Nasiri, front-end developer in Tehran. Fast, accessible, right-to-left interfaces with React, Next.js and TypeScript.",

    nav: {
      home: "Home",
      about: "About me",
      services: "Services",
      projects: "Projects",
    },

    skipToContent: "Skip to content",
    switchLanguage: "Switch language to Persian",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    externalLink: "opens in a new tab",

    heroLines: ["EXPLORE MY", "PORTFOLIO"],
    heroMeta: "FRONT-END DEVELOPER — EST. 2023",
    heroLocation: "TEHRAN, IRAN",
    heroStatement:
      "I AM PASSIONATE ABOUT CREATING WEBSITES THAT STAND OUT FROM THE CROWD.",
    heroServices: [
      "UI/UX",
      "WEB DESIGN",
      "LANDING PAGE DESIGN",
      "UI DESIGN FIGMA",
      "MOBILE APP DESIGN",
    ],
    heroCta: "See the work",
    availability: "Available for work",
    portraitAlt: "Portrait of Asghar Nasiri outdoors, looking at his phone",

    aboutLabel: "ABOUT",
    aboutQuote:
      "ASGHAR NASIRI IS A FRONT-END DEVELOPER IN TEHRAN, BUILDING FAST, ACCESSIBLE INTERFACES — AND SWEATING THE DETAILS MOST PEOPLE NEVER SEE.",
    aboutBody:
      "I started with JavaScript exercises and ended up shipping complete apps in React and Next.js. I would rather finish one thing and publish it than leave ten things half-built.",
    facts: [
      { value: "03", label: "Shipped apps" },
      { value: "18", label: "Routes in the build" },
      { value: "100", label: "Accessibility score" },
    ],

    workLabel: "FEATURED PROJECT",
    workAll: "ALL",
    workWeb: "WEB",
    workTools: "TOOLS",
    workSource: "View source",

    servicesLabel: "SERVICES",
    servicesTitle: "THE SERVICES WE PROVIDE",
    servicesLead:
      "CREATING VISUALLY APPEALING AND FUNCTIONAL INTERFACES TAILORED TO REAL NEEDS, WITH A CONSISTENT EXPERIENCE ACROSS SCREENS.",
    services: [
      {
        index: "01",
        title: "UI/UX",
        body: "Flows, states and the order of things — decided before a single pixel is drawn.",
      },
      {
        index: "02",
        title: "WEB DESIGN",
        body: "Layouts that hold real content, at every width, without hiding behind a mockup.",
      },
      {
        index: "03",
        title: "LANDING PAGE DESIGN",
        body: "One page, one job: make the next step obvious and keep the page fast.",
      },
      {
        index: "04",
        title: "UI DESIGN FIGMA",
        body: "Tokens and components in Figma, so screens stay consistent after handoff.",
      },
      {
        index: "05",
        title: "MOBILE APP DESIGN",
        body: "Small screens first, with touch targets and slow networks in mind.",
      },
    ],

    contactLabel: "SOCIALS",
    contactTitle: "LET'S TALK",
    contactLead: "I'M ALWAYS OPEN TO NEW OPPORTUNITIES AND DISCUSSIONS.",
    contactCta: "CONTACT ME",
    contactEmail: "EMAIL",

    footerRights: "PORTFOLIO. ALL RIGHTS RESERVED",
    footerCredit: "DESIGNED & BUILT BY ASGHAR NASIRI",

    notFoundTitle: "This page could not be found",
    notFoundBody: "The address may have changed, or the page may have been removed.",
    notFoundCta: "Back to home",
  },

  fa: {
    metaTitle: "اصغر نصیری — توسعه‌دهنده فرانت‌اند",
    metaDescription:
      "اصغر نصیری، توسعه‌دهنده فرانت‌اند در تهران. رابط‌های سریع، در دسترس و راست‌به‌چپ با React، Next.js و TypeScript.",

    nav: {
      home: "خانه",
      about: "درباره من",
      services: "خدمات",
      projects: "پروژه‌ها",
    },

    skipToContent: "رفتن به محتوای اصلی",
    switchLanguage: "تغییر زبان به انگلیسی",
    openMenu: "باز کردن منو",
    closeMenu: "بستن منو",
    externalLink: "در صفحه‌ی جدید باز می‌شود",

    heroLines: ["نمونه‌کارهایم", "را ببین"],
    heroMeta: "توسعه‌دهنده فرانت‌اند — از ۲۰۲۳",
    heroLocation: "تهران، ایران",
    heroStatement:
      "عاشق ساختن وب‌سایت‌هایی هستم که از بقیه جدا باشند.",
    heroServices: [
      "رابط کاربری",
      "طراحی وب",
      "طراحی لندینگ",
      "طراحی در فیگما",
      "طراحی اپ موبایل",
    ],
    heroCta: "دیدن کارها",
    availability: "آماده‌ی همکاری",
    portraitAlt: "پرتره‌ی اصغر نصیری در فضای باز، در حال نگاه‌کردن به گوشی",

    aboutLabel: "درباره",
    aboutQuote:
      "اصغر نصیری توسعه‌دهنده‌ی فرانت‌اند در تهران است؛ رابط‌های سریع و در دسترس می‌سازد و به جزئیاتی اهمیت می‌دهد که بیشتر مردم نمی‌بینند.",
    aboutBody:
      "از تمرین‌های جاوااسکریپت شروع کردم و به ساخت اپلیکیشن‌های کامل با React و Next.js رسیدم. ترجیح می‌دهم یک چیز را تا آخر بسازم و منتشر کنم تا اینکه ده چیز را نیمه‌کاره رها کنم.",
    facts: [
      { value: "03", label: "اپلیکیشن منتشرشده" },
      { value: "18", label: "مسیر در بیلد" },
      { value: "100", label: "امتیاز دسترس‌پذیری" },
    ],

    workLabel: "پروژه‌های منتخب",
    workAll: "همه",
    workWeb: "وب",
    workTools: "ابزار",
    workSource: "مشاهده‌ی سورس",

    servicesLabel: "خدمات",
    servicesTitle: "خدماتی که ارائه می‌دهم",
    servicesLead:
      "ساخت رابط‌های زیبا و کاربردی بر اساس نیاز واقعی، با تجربه‌ای یکدست در همه‌ی صفحه‌ها.",
    services: [
      {
        index: "01",
        title: "رابط کاربری",
        body: "جریان‌ها، حالت‌ها و ترتیب کارها — پیش از کشیدن اولین پیکسل.",
      },
      {
        index: "02",
        title: "طراحی وب",
        body: "چیدمانی که محتوای واقعی را در هر عرضی نگه می‌دارد، نه ماکاپی که دروغ می‌گوید.",
      },
      {
        index: "03",
        title: "طراحی لندینگ",
        body: "یک صفحه، یک کار: قدم بعدی باید واضح باشد و صفحه سریع بماند.",
      },
      {
        index: "04",
        title: "طراحی در فیگما",
        body: "توکن و کامپوننت، تا صفحه‌ها بعد از تحویل هم یکدست بمانند.",
      },
      {
        index: "05",
        title: "طراحی اپ موبایل",
        body: "اول صفحه‌ی کوچک، با در نظر گرفتن لمس و اینترنت کند.",
      },
    ],

    contactLabel: "شبکه‌های اجتماعی",
    contactTitle: "حرف بزنیم",
    contactLead: "همیشه برای فرصت‌های تازه و گفت‌وگو باز هستم.",
    contactCta: "تماس با من",
    contactEmail: "ایمیل",

    footerRights: "پورتفولیو. تمام حقوق محفوظ است",
    footerCredit: "طراحی و ساخت: اصغر نصیری",

    notFoundTitle: "این صفحه پیدا نشد",
    notFoundBody: "ممکن است نشانی تغییر کرده باشد یا صفحه حذف شده باشد.",
    notFoundCta: "بازگشت به خانه",
  },
};
