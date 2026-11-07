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
  switchTheme: string;
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
  aboutLead: string;
  aboutBody: string[];
  facts: Fact[];

  workLabel: string;
  workAll: string;
  workWeb: string;
  workTools: string;
  workSource: string;
  workRepos: string;

  servicesLabel: string;
  servicesTitle: string;
  servicesLead: string;
  services: Service[];

  contactLabel: string;
  contactTitle: string;
  contactLead: string;
  contactCta: string;
  contactEmail: string;
  copyEmail: string;
  copied: string;

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
      "Asghar Nasiri, front-end developer in Iran. Fast, accessible, right-to-left interfaces with React, Next.js and TypeScript.",

    nav: {
      home: "Home",
      about: "About me",
      services: "Services",
      projects: "Projects",
    },

    skipToContent: "Skip to content",
    switchLanguage: "Switch language to Persian",
    switchTheme: "Switch theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    externalLink: "opens in a new tab",

    heroLines: ["EXPLORE MY", "PORTFOLIO"],
    heroMeta: "FRONT-END DEVELOPER — EST. 2023",
    heroLocation: "IRAN",
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
    aboutLead:
      "Hi! I'm Asghar, a Front-End Developer passionate about building clean, modern, and user-friendly web experiences.",
    aboutBody: [
      "I enjoy turning ideas and designs into functional websites, paying attention to the little details that make a difference. I'm currently focused on improving my skills in JavaScript, TypeScript, React, and Next.js, while exploring new tools and technologies along the way.",
      "For me, development is all about learning, solving problems, and getting better with every project. I enjoy taking on new challenges, experimenting with ideas, and building things that people can actually use.",
      "I'm always open to learning, collaborating, and creating something meaningful.",
    ],    facts: [
      { value: "03", label: "Shipped apps" },
      { value: "18", label: "Routes in the build" },
      { value: "100", label: "Accessibility score" },
    ],

    workLabel: "FEATURED PROJECT",
    workAll: "ALL",
    workWeb: "WEB",
    workTools: "TOOLS",
    workSource: "View source",
    workRepos: "All repositories",

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
    contactTitle: "OPEN TO WORK",
    contactLead: "I'M ALWAYS AVAILABLE FOR NEW OPPORTUNITIES AND DISCUSSIONS.",
    contactCta: "CONTACT ME",
    contactEmail: "EMAIL",
    copyEmail: "COPY EMAIL",
    copied: "COPIED",

    footerRights: "PORTFOLIO. ALL RIGHTS RESERVED",
    footerCredit: "DESIGNED & BUILT BY ASGHAR NASIRI",

    notFoundTitle: "This page could not be found",
    notFoundBody: "The address may have changed, or the page may have been removed.",
    notFoundCta: "Back to home",
  },

  fa: {
    metaTitle: "اصغر نصیری — توسعه‌دهنده فرانت‌اند",
    metaDescription:
      "اصغر نصیری، توسعه‌دهنده فرانت‌اند در ایران. رابط‌های سریع، در دسترس و راست‌به‌چپ با React، Next.js و TypeScript.",

    nav: {
      home: "خانه",
      about: "درباره من",
      services: "خدمات",
      projects: "پروژه‌ها",
    },

    skipToContent: "رفتن به محتوای اصلی",
    switchLanguage: "تغییر زبان به انگلیسی",
    switchTheme: "تغییر تم",
    openMenu: "باز کردن منو",
    closeMenu: "بستن منو",
    externalLink: "در صفحه‌ی جدید باز می‌شود",

    heroLines: ["نمونه‌کارهایم", "را ببین"],
    heroMeta: "توسعه‌دهنده فرانت‌اند — از ۲۰۲۳",
    heroLocation: "ایران",
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
    aboutLead:
      "سلام! من اصغرم، یک توسعه‌دهنده فرانت‌اند که به ساخت تجربه‌های وب مدرن، زیبا و کاربرپسند علاقه‌مندم.",
    aboutBody: [
      "از تبدیل ایده‌ها و طرح‌های گرافیکی به وب‌سایت‌های کاربردی لذت می‌برم و همیشه به جزئیات کوچکی که می‌توانند تفاوت بزرگی ایجاد کنند توجه دارم. در حال حاضر تمرکزم روی تقویت مهارت‌هایم در JavaScript، TypeScript، React و Next.js است و در کنار آن، ابزارها و تکنولوژی‌های جدید را نیز تجربه می‌کنم.",
      "از نظر من، برنامه‌نویسی یعنی یادگیری مداوم، حل مسئله و بهتر شدن با هر پروژه. از روبه‌رو شدن با چالش‌های جدید، آزمایش ایده‌ها و ساخت محصولاتی که واقعاً برای افراد کاربرد دارند لذت می‌برم.",
      "همیشه مشتاق یادگیری، همکاری با دیگران و خلق چیزهای ارزشمند هستم.",
    ],    facts: [
      { value: "03", label: "اپلیکیشن منتشرشده" },
      { value: "18", label: "مسیر در بیلد" },
      { value: "100", label: "امتیاز دسترس‌پذیری" },
    ],

    workLabel: "پروژه‌های منتخب",
    workAll: "همه",
    workWeb: "وب",
    workTools: "ابزار",
    workSource: "مشاهده‌ی سورس",
    workRepos: "همه‌ی مخزن‌ها",

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
    contactTitle: "آماده همکاری",
    contactLead: "همیشه برای فرصت‌های تازه و گفت‌وگو در دسترس هستم.",
    contactCta: "تماس با من",
    contactEmail: "ایمیل",
    copyEmail: "کپی ایمیل",
    copied: "کپی شد",

    footerRights: "پورتفولیو. تمام حقوق محفوظ است",
    footerCredit: "طراحی و ساخت: اصغر نصیری",

    notFoundTitle: "این صفحه پیدا نشد",
    notFoundBody: "ممکن است نشانی تغییر کرده باشد یا صفحه حذف شده باشد.",
    notFoundCta: "بازگشت به خانه",
  },
};
