import type { Locale } from "@/lib/i18n";

export interface Stat {
  value: string;
  label: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Job {
  period: string;
  role: string;
  company: string;
  summary: string;
}

export interface Copy {
  metaTitle: string;
  metaDescription: string;

  navHome: string;
  navWork: string;
  navLog: string;
  navAbout: string;
  navContact: string;
  skipToContent: string;
  openMenu: string;
  closeMenu: string;
  switchLanguage: string;

  availability: string;
  heroTitle: string;
  heroLead: string;
  ctaWork: string;
  ctaContact: string;
  portraitCaption: string;
  portraitAlt: string;
  stats: Stat[];

  workEyebrow: string;
  workTitle: string;
  workLead: string;
  viewProject: string;

  logEyebrow: string;
  logTitle: string;
  logLead: string;
  logAll: string;
  logBack: string;
  readingTime: string;
  nextEntry: string;

  archiveEyebrow: string;
  archiveTitle: string;
  archiveLead: string;
  archiveAll: string;

  aboutEyebrow: string;
  aboutTitle: string;
  aboutLead: string;
  aboutBody: string[];
  skillsTitle: string;
  skills: SkillGroup[];
  experienceTitle: string;
  experience: Job[];

  contactEyebrow: string;
  contactTitle: string;
  contactLead: string;
  emailCta: string;
  socialsTitle: string;

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
  builtWith: string;

  backToWork: string;
  projectRole: string;
  projectYear: string;
  projectStack: string;
  projectHighlights: string;
  projectTradeoff: string;
  projectResults: string;
  nextProject: string;
  previousProject: string;

  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
}

export const copy: Record<Locale, Copy> = {
  fa: {
    metaTitle: "اصغر نصیری — مهندس فرانت‌اند و طراح رابط کاربری",
    metaDescription:
      "نمونه‌کارها و تجربه‌های اصغر نصیری، مهندس فرانت‌اند و طراح رابط کاربری در تهران؛ ساخت رابط‌های سریع، در دسترس و راست‌به‌چپ.",

    navHome: "خانه",
    navWork: "نمونه‌کارها",
    navLog: "یادداشت‌ها",
    navAbout: "درباره من",
    navContact: "تماس",
    skipToContent: "رفتن به محتوای اصلی",
    openMenu: "باز کردن منو",
    closeMenu: "بستن منو",
    switchLanguage: "تغییر زبان",

    availability: "آماده همکاری در پروژه‌های منتخب",
    heroTitle: "رابط‌های وبِ آرام، سریع و انسانی می‌سازم.",
    heroLead:
      "بیش از شش سال است که محصول‌های پیچیده را به تجربه‌هایی ساده تبدیل می‌کنم؛ با تمرکز بر سیستم‌های طراحی، تایپوگرافی فارسی و رابط‌های راست‌به‌چپ.",
    ctaWork: "دیدن نمونه‌کارها",
    ctaContact: "شروع گفت‌وگو",
    portraitCaption: "تهران، ایران",
    portraitAlt: "پرتره‌ی اصغر نصیری",
    stats: [
      { value: "6+", label: "سال تجربه" },
      { value: "24", label: "محصول منتشرشده" },
      { value: "3", label: "سیستم طراحی" },
    ],

    workEyebrow: "نمونه‌کارها",
    workTitle: "کارهایی که با دقت ساخته‌ام",
    workLead:
      "گزیده‌ای از پروژه‌های محصول، سیستم طراحی و فرانت‌اند. هر کدام یک مسئله واقعی و یک راه‌حل سنجیده دارند.",
    viewProject: "مطالعه پروژه",

    logEyebrow: "یادداشت‌ها",
    logTitle: "چیزهایی که می‌نویسم",
    logLead:
      "یادداشت‌های کوتاه درباره‌ی طراحی رابط، تایپوگرافی فارسی و ساختن چیزهایی که باید کار کنند.",
    logAll: "همه‌ی یادداشت‌ها",
    logBack: "بازگشت به یادداشت‌ها",
    readingTime: "دقیقه مطالعه",
    nextEntry: "یادداشت بعدی",

    archiveEyebrow: "بایگانی",
    archiveTitle: "ساختن‌های کوچک‌تر",
    archiveLead:
      "تمرین‌ها و پروژه‌های کوچک؛ نشانه‌ی اینکه بین کارهای بزرگ‌تر هم دست از ساختن برنمی‌دارم.",
    archiveAll: "همه‌ی مخزن‌ها",

    aboutEyebrow: "درباره من",
    aboutTitle: "کمی درباره‌ی من",
    aboutLead: "طراح و توسعه‌دهنده‌ای که به جزئیات اهمیت می‌دهد.",
    aboutBody: [
      "من اصغر هستم؛ مهندس فرانت‌اند و طراح رابط کاربری. کارم را با این باور شروع کردم که بهترین رابط‌ها دیده نمی‌شوند: کاربر فقط کارش را انجام می‌دهد و می‌رود.",
      "در این سال‌ها روی فروشگاه‌های آنلاین، داشبوردهای داده و سیستم‌های طراحی کار کرده‌ام. بیش از هر چیز به تایپوگرافی، دسترس‌پذیری و جزئیات حرکت علاقه دارم و ترجیح می‌دهم پیش از نوشتن کد، مسئله را درست بفهمم.",
      "وقتی پشت کامپیوتر نیستم، کتاب می‌خوانم و درباره‌ی تایپوگرافی فارسی یادداشت می‌نویسم.",
    ],
    skillsTitle: "مهارت‌ها",
    skills: [
      {
        title: "طراحی",
        items: ["سیستم طراحی", "طراحی تعامل", "تایپوگرافی", "رابط راست‌به‌چپ"],
      },
      {
        title: "فرانت‌اند",
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "دسترس‌پذیری"],
      },
      {
        title: "ابزارها",
        items: ["Figma", "Storybook", "Vitest", "Git", "Vercel"],
      },
    ],
    experienceTitle: "تجربه",
    experience: [
      {
        period: "1402 — اکنون",
        role: "مهندس ارشد فرانت‌اند",
        company: "استودیو چهل",
        summary: "رهبری فرانت‌اند یک پلتفرم تحلیل داده و ساخت سیستم طراحی مشترک آن.",
      },
      {
        period: "1400 — 1402",
        role: "توسعه‌دهنده فرانت‌اند",
        company: "نوا دیجیتال",
        summary: "بازنویسی فروشگاه‌های دوزبانه با Next.js و بهبود سرعت و دسترس‌پذیری.",
      },
      {
        period: "1398 — 1400",
        role: "طراح و توسعه‌دهنده",
        company: "همکاری آزاد",
        summary: "همراهی استارتاپ‌های کوچک برای طراحی و ساخت اولین نسخه محصول.",
      },
    ],

    contactEyebrow: "تماس",
    contactTitle: "بیایید چیزی سنجیده بسازیم.",
    contactLead:
      "اگر پروژه‌ای دارید، یا فقط می‌خواهید درباره‌ی طراحی و فرانت‌اند گپ بزنیم، برایم بنویسید. معمولاً در دو روز کاری پاسخ می‌دهم.",
    emailCta: "ارسال ایمیل",
    socialsTitle: "شبکه‌های اجتماعی",

    formTitle: "یک پیام بنویسید",
    formName: "نام",
    formEmail: "ایمیل",
    formMessage: "پیام",
    formSubmit: "ارسال پیام",
    formNote:
      "این فرم پیام را در برنامه‌ی ایمیل شما آماده می‌کند؛ چیزی روی سرور ذخیره نمی‌شود.",
    formError: "لطفاً نام، ایمیل و پیام را کامل کنید.",
    formSubject: "پیام از وب‌سایت",
    formDirect: "یا مستقیم بنویسید:",

    footerNote: "طراحی و توسعه با دقت.",
    builtWith: "ساخته‌شده با Next.js",

    backToWork: "بازگشت به نمونه‌کارها",
    projectRole: "نقش",
    projectYear: "سال",
    projectStack: "ابزارها",
    projectHighlights: "کارهایی که انجام دادم",
    projectTradeoff: "تریدآف",
    projectResults: "نتیجه",
    nextProject: "پروژه بعدی",
    previousProject: "پروژه قبلی",

    notFoundTitle: "این صفحه پیدا نشد",
    notFoundBody: "ممکن است نشانی تغییر کرده باشد یا صفحه حذف شده باشد.",
    notFoundCta: "بازگشت به خانه",
  },

  en: {
    metaTitle: "Asghar Nasiri — Front-end engineer & interface designer",
    metaDescription:
      "Selected work and experience of Asghar Nasiri, a front-end engineer and interface designer in Tehran building fast, accessible, RTL-first products.",

    navHome: "Home",
    navWork: "Work",
    navLog: "Log",
    navAbout: "About",
    navContact: "Contact",
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguage: "Switch language",

    availability: "Available for select projects",
    heroTitle: "I build calm, fast interfaces for the web.",
    heroLead:
      "For more than six years I have turned complex products into simple experiences, with a focus on design systems, Persian typography and right-to-left interfaces.",
    ctaWork: "See selected work",
    ctaContact: "Start a conversation",
    portraitCaption: "Tehran, Iran",
    portraitAlt: "Portrait of Asghar Nasiri",
    stats: [
      { value: "6+", label: "Years of experience" },
      { value: "24", label: "Products shipped" },
      { value: "3", label: "Design systems" },
    ],

    workEyebrow: "Selected work",
    workTitle: "Work I have built carefully",
    workLead:
      "A short selection of product, design system and front-end projects. Each one starts with a real problem and ends with a considered answer.",
    viewProject: "Read the case study",

    logEyebrow: "Field log",
    logTitle: "Notes from the work",
    logLead:
      "Short notes on interface design, Persian typography and building things that have to work.",
    logAll: "All entries",
    logBack: "Back to the log",
    readingTime: "min read",
    nextEntry: "Next entry",

    archiveEyebrow: "Archive",
    archiveTitle: "Smaller builds",
    archiveLead:
      "Practice repos and experiments — proof I keep building between the bigger things.",
    archiveAll: "All repositories",

    aboutEyebrow: "About",
    aboutTitle: "A little about me",
    aboutLead: "A designer and developer who cares about the details.",
    aboutBody: [
      "I am Asghar, a front-end engineer and interface designer. I started with the belief that the best interfaces disappear: people finish what they came to do and move on.",
      "Since then I have worked on storefronts, data dashboards and design systems. I care most about typography, accessibility and the small details of motion, and I would rather understand the problem properly before writing any code.",
      "When I am away from the keyboard I read, and write notes about Persian typography.",
    ],
    skillsTitle: "Skills",
    skills: [
      {
        title: "Design",
        items: ["Design systems", "Interaction design", "Typography", "RTL interfaces"],
      },
      {
        title: "Front-end",
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Accessibility"],
      },
      {
        title: "Tooling",
        items: ["Figma", "Storybook", "Vitest", "Git", "Vercel"],
      },
    ],
    experienceTitle: "Experience",
    experience: [
      {
        period: "2023 — Now",
        role: "Senior Front-end Engineer",
        company: "Studio Chehel",
        summary: "Led the front-end of an analytics platform and built its shared design system.",
      },
      {
        period: "2021 — 2023",
        role: "Front-end Developer",
        company: "Nova Digital",
        summary: "Rebuilt bilingual storefronts on Next.js and improved speed and accessibility.",
      },
      {
        period: "2019 — 2021",
        role: "Designer & Developer",
        company: "Freelance",
        summary: "Helped small startups design and ship the first version of their product.",
      },
    ],

    contactEyebrow: "Contact",
    contactTitle: "Let's build something considered.",
    contactLead:
      "If you have a project, or just want to talk about design and front-end, write to me. I usually reply within two working days.",
    emailCta: "Send an email",
    socialsTitle: "Elsewhere",

    formTitle: "Send a note",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formSubmit: "Send message",
    formNote:
      "This opens your mail app with the message ready. Nothing is stored on a server.",
    formError: "Please fill in your name, email and message.",
    formSubject: "Message from the website",
    formDirect: "Or write directly:",

    footerNote: "Designed and built with care.",
    builtWith: "Built with Next.js",

    backToWork: "Back to work",
    projectRole: "Role",
    projectYear: "Year",
    projectStack: "Stack",
    projectHighlights: "What I did",
    projectTradeoff: "Trade-off",
    projectResults: "Results",
    nextProject: "Next project",
    previousProject: "Previous project",

    notFoundTitle: "This page could not be found",
    notFoundBody: "The address may have changed, or the page may have been removed.",
    notFoundCta: "Back to home",
  },
};
