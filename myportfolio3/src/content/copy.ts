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
  navPrimary: string;
  navMobile: string;

  skipToContent: string;
  switchLanguage: string;
  switchTheme: string;
  openMenu: string;
  closeMenu: string;
  externalLink: string;

  heroLines: [string, string];
  heroMeta: string;
  heroStatement: string;
  heroServices: string[];
  heroTicker: string[];
  heroCta: string;
  availability: string;

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
  formTitle: string;
  formName: string;
  formEmail: string;
  formMessage: string;
  formSubmit: string;
  formNote: string;
  formError: string;
  formEmailError: string;
  formSubject: string;

  footerRights: string;
  footerCredit: string;
  footerStats: string;

  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;

  stats: StatsCopy;
}

export interface StatsCopy {
  label: string;
  back: string;
  title: string;
  lead: string;
  total: string;
  storage: string;
  storageKv: string;
  storageFile: string;
  storageNone: string;
  rangeLabel: string;
  ranges: Record<"today" | "week" | "month" | "all", string>;
  groups: Record<"device" | "os" | "browser", string>;
  labels: Record<string, string>;
  notConfiguredTitle: string;
  notConfiguredBody: string;
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
    navPrimary: "Primary navigation",
    navMobile: "Mobile navigation",

    skipToContent: "Skip to content",
    switchLanguage: "Switch language to Persian",
    switchTheme: "Switch theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    externalLink: "opens in a new tab",

    heroLines: ["EXPLORE MY", "PORTFOLIO"],
    heroMeta: "FRONT-END DEVELOPER — EST. 2023",
    heroStatement:
      "I AM PASSIONATE ABOUT CREATING WEBSITES THAT STAND OUT FROM THE CROWD.",
    heroServices: [
      "UI/UX",
      "WEB DESIGN",
      "LANDING PAGE DESIGN",
      "UI DESIGN FIGMA",
      "MOBILE APP DESIGN",
    ],
    heroTicker: [
      "FRONT-END",
      "RTL & TYPOGRAPHY",
      "DESIGN SYSTEMS",
      "ACCESSIBILITY",
      "PERFORMANCE",
      "REACT",
      "NEXT.JS",
    ],
    heroCta: "See the work",
    availability: "Available for work",

    aboutLabel: "ABOUT",
    aboutLead:
      "Hi! I'm Asghar, a Front-End Developer passionate about building clean, modern, and user-friendly web experiences.",
    aboutBody: [
      "I enjoy turning ideas and designs into functional websites, paying attention to the little details that make a difference. I'm currently focused on improving my skills in JavaScript, TypeScript, React, and Next.js, while exploring new tools and technologies along the way.",
      "For me, development is all about learning, solving problems, and getting better with every project. I enjoy taking on new challenges, experimenting with ideas, and building things that people can actually use.",
      "I'm always open to learning, collaborating, and creating something meaningful.",
    ],
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
    workRepos: "All repositories",

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
    formTitle: "OR WRITE HERE",
    formName: "NAME",
    formEmail: "EMAIL",
    formMessage: "MESSAGE",
    formSubmit: "SEND MESSAGE",
    formNote:
      "This opens your mail app with the message ready. Nothing is stored on a server.",
    formError: "Please fill in your name, email and message.",
    formEmailError: "That email address does not look right.",
    formSubject: "Message from the website",

    footerRights: "PORTFOLIO. ALL RIGHTS RESERVED",
    footerCredit: "DESIGNED & BUILT BY ASGHAR NASIRI",
    footerStats: "STATS",

    notFoundTitle: "This page could not be found",
    notFoundBody: "The address may have changed, or the page may have been removed.",
    notFoundCta: "Back to home",

    stats: {
      label: "Live",
      back: "Back to portfolio",
      title: "Visitor stats",
      lead: "Aggregate counts only. No IP addresses, raw user agents or cookies are stored.",
      total: "total visits",
      storage: "Storage",
      storageKv: "Vercel KV",
      storageFile: "local file",
      storageNone: "not configured",
      rangeLabel: "Period",
      ranges: {
        today: "Today",
        week: "7 days",
        month: "30 days",
        all: "All time",
      },
      groups: {
        device: "Devices",
        os: "Operating systems",
        browser: "Browsers",
      },
      labels: {
        mobile: "Mobile",
        tablet: "Tablet",
        desktop: "Desktop",
        other: "Other",
        ios: "iOS",
        android: "Android",
        windows: "Windows",
        macos: "macOS",
        linux: "Linux",
        chrome: "Chrome",
        safari: "Safari",
        firefox: "Firefox",
        edge: "Edge",
        samsung: "Samsung Internet",
      },
      notConfiguredTitle: "Storage is not configured.",
      notConfiguredBody:
        "Connect an Upstash Redis store to this Vercel project. Locally the counts are written to .data/stats.json.",
    },
  },

  fa: {
    metaTitle: "اصغر نصیری — توسعه‌دهنده فرانت‌اند",
    metaDescription:
      "اصغر نصیری، توسعه‌دهنده‌ی فرانت‌اند در ایران. رابط‌هایی سریع و در دسترس می‌سازم؛ با React، Next.js و TypeScript.",

    nav: {
      home: "خانه",
      about: "درباره من",
      services: "خدمات",
      projects: "پروژه‌ها",
    },
    navPrimary: "ناوبری اصلی",
    navMobile: "ناوبری موبایل",

    skipToContent: "رفتن به محتوای اصلی",
    switchLanguage: "تغییر زبان به انگلیسی",
    switchTheme: "تغییر تم",
    openMenu: "باز کردن منو",
    closeMenu: "بستن منو",
    externalLink: "در صفحه‌ی جدید باز می‌شود",

    heroLines: ["EXPLORE MY", "PORTFOLIO"],
    heroMeta: "توسعه‌دهنده فرانت‌اند — از ۲۰۲۳",
    heroStatement:
      "دوست دارم سایت‌هایی بسازم که بین بقیه به چشم بیایند.",
    heroServices: [
      "رابط کاربری",
      "طراحی وب",
      "طراحی لندینگ",
      "طراحی در فیگما",
      "طراحی اپ موبایل",
    ],
    heroTicker: [
      "FRONT-END",
      "RTL & TYPOGRAPHY",
      "DESIGN SYSTEMS",
      "ACCESSIBILITY",
      "PERFORMANCE",
      "REACT",
      "NEXT.JS",
    ],
    heroCta: "دیدن کارها",
    availability: "آماده‌ی همکاری",

    aboutLabel: "درباره",
    aboutLead:
      "سلام! من اصغرم، یک توسعه‌دهنده فرانت‌اند که به ساخت تجربه‌های وب مدرن، زیبا و کاربرپسند علاقه‌مندم.",
    aboutBody: [
      "از تبدیل ایده‌ها و طرح‌های گرافیکی به وب‌سایت‌های کاربردی لذت می‌برم و همیشه به جزئیات کوچکی که می‌توانند تفاوت بزرگی ایجاد کنند توجه دارم. در حال حاضر تمرکزم روی تقویت مهارت‌هایم در JavaScript، TypeScript، React و Next.js است و در کنار آن، ابزارها و تکنولوژی‌های جدید را نیز تجربه می‌کنم.",
      "از نظر من، برنامه‌نویسی یعنی یادگیری مداوم، حل مسئله و بهتر شدن با هر پروژه. از روبه‌رو شدن با چالش‌های جدید، آزمایش ایده‌ها و ساخت محصولاتی که واقعاً برای افراد کاربرد دارند لذت می‌برم.",
      "همیشه مشتاق یادگیری، همکاری با دیگران و خلق چیزهای ارزشمند هستم.",
    ],
    facts: [
      { value: "03", label: "اپلیکیشن منتشرشده" },
      { value: "18", label: "مسیر در بیلد" },
      { value: "100", label: "امتیاز دسترس‌پذیری" },
    ],

    workLabel: "پروژه‌های منتخب",
    workAll: "همه",
    workWeb: "وب",
    workTools: "ابزار",
    workSource: "دیدن کد",
    workRepos: "همه‌ی مخزن‌ها",

    servicesTitle: "چه کارهایی انجام می‌دهم",
    servicesLead:
      "رابط‌هایی می‌سازم ساده و کارآمد، بر اساس نیاز واقعی و با تجربه‌ای یکدست در همه‌ی صفحه‌ها.",
    services: [
      {
        index: "01",
        title: "رابط کاربری",
        body: "اول مسیر کاربر، حالت‌های مختلف صفحه و ترتیب کارها را روشن می‌کنم؛ بعد سراغ طراحی می‌روم.",
      },
      {
        index: "02",
        title: "طراحی وب",
        body: "چیدمانی می‌سازم که با محتوای واقعی و در هر اندازه‌ای جواب بدهد، نه طرحی که فقط توی فیگما خوب است.",
      },
      {
        index: "03",
        title: "طراحی لندینگ",
        body: "صفحه فرود باید یک کار را خوب انجام دهد: مخاطب بفهمد قدم بعدی چیست و صفحه هم سریع بماند.",
      },
      {
        index: "04",
        title: "طراحی در فیگما",
        body: "رنگ‌ها، فاصله‌ها و کامپوننت‌ها را در فیگما منظم می‌کنم تا بعد از تحویل هم همه‌چیز یکدست بماند.",
      },
      {
        index: "05",
        title: "طراحی اپ موبایل",
        body: "از صفحه‌ی کوچک شروع می‌کنم؛ با دکمه‌هایی که راحت لمس شوند و صفحه‌ای که روی اینترنت کند هم کار کند.",
      },
    ],

    contactLabel: "شبکه‌های اجتماعی",
    contactTitle: "آماده‌ی همکاری",
    contactLead: "همیشه برای فرصت‌های تازه و گفت‌وگو در دسترس هستم.",
    contactCta: "تماس با من",
    contactEmail: "ایمیل",
    copyEmail: "کپی ایمیل",
    copied: "کپی شد",
    formTitle: "یا همین‌جا بنویسید",
    formName: "نام",
    formEmail: "ایمیل",
    formMessage: "پیام",
    formSubmit: "ارسال پیام",
    formNote:
      "پیام در برنامه‌ی ایمیل‌تان آماده می‌شود و چیزی روی سرور ذخیره نمی‌شود.",
    formError: "لطفاً نام، ایمیل و پیام را کامل کنید.",
    formEmailError: "این نشانی ایمیل درست به نظر نمی‌رسد.",
    formSubject: "پیام از وب‌سایت",

    footerRights: "پورتفولیو. تمام حقوق محفوظ است",
    footerCredit: "طراحی و ساخت: اصغر نصیری",
    footerStats: "آمار",

    notFoundTitle: "این صفحه پیدا نشد",
    notFoundBody: "شاید نشانی عوض شده یا این صفحه دیگر وجود ندارد.",
    notFoundCta: "بازگشت به خانه",

    stats: {
      label: "خصوصی",
      back: "بازگشت به نمونه‌کار",
      title: "آمار بازدید",
      lead: "فقط شمارش تجمیعی. هیچ نشانی IP، User-Agent خام یا کوکی ذخیره نمی‌شود.",
      total: "بازدید",
      storage: "ذخیره‌سازی",
      storageKv: "Vercel KV",
      storageFile: "فایل محلی",
      storageNone: "تنظیم نشده",
      rangeLabel: "بازه",
      ranges: {
        today: "امروز",
        week: "۷ روز",
        month: "۳۰ روز",
        all: "کل",
      },
      groups: {
        device: "دستگاه‌ها",
        os: "سیستم‌عامل‌ها",
        browser: "مرورگرها",
      },
      labels: {
        mobile: "موبایل",
        tablet: "تبلت",
        desktop: "دسکتاپ",
        other: "سایر",
        ios: "iOS",
        android: "اندروید",
        windows: "ویندوز",
        macos: "macOS",
        linux: "لینوکس",
        chrome: "کروم",
        safari: "سافاری",
        firefox: "فایرفاکس",
        edge: "اج",
        samsung: "سامسونگ اینترنت",
      },
      notConfiguredTitle: "ذخیره‌سازی تنظیم نشده است.",
      notConfiguredBody:
        "یک دیتابیس Upstash Redis به پروژه‌ی Vercel وصل کن. در حالت محلی شمارش‌ها در .data/stats.json نوشته می‌شوند.",
    },
  },
};
