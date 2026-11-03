import type { Localized } from "@/lib/i18n";

export interface ArchiveItem {
  name: string;
  year: string;
  stack: string[];
  href: string;
  description: Localized;
}

/**
 * Real repositories from github.com/asgharnasiri1990 — practice work and
 * smaller builds. Add an entry when a new repo is worth showing.
 */
export const archive: ArchiveItem[] = [
  {
    name: "AiProjects",
    year: "2026",
    stack: ["Next.js", "TypeScript"],
    href: "https://github.com/asgharnasiri1990/AiProjects",
    description: {
      fa: "سه اپلیکیشن مستقل Next.js در یک مخزن: یک فروشگاه، ردیاب پرواز و همین نمونه‌کار.",
      en: "Three independent Next.js apps in one repo: a storefront, a flight tracker and this portfolio.",
    },
  },
  {
    name: "Term4Next-Js",
    year: "2026",
    stack: ["Next.js", "TypeScript"],
    href: "https://github.com/asgharnasiri1990/Term4Next-Js",
    description: {
      fa: "تمرین‌های Next.js و TypeScript در ترم چهارم دوره‌ی وب.",
      en: "Next.js and TypeScript exercises from the fourth term of a web bootcamp.",
    },
  },
  {
    name: "Term4Tailwind",
    year: "2026",
    stack: ["Tailwind CSS", "TypeScript"],
    href: "https://github.com/asgharnasiri1990/Term4Tailwind",
    description: {
      fa: "شروع کار با Tailwind CSS در کنار TypeScript.",
      en: "Getting started with Tailwind CSS alongside TypeScript.",
    },
  },
  {
    name: "Term4React",
    year: "2026",
    stack: ["React", "JavaScript"],
    href: "https://github.com/asgharnasiri1990/Term4React",
    description: {
      fa: "تمرین‌ها و کامپوننت‌های React در ترم چهارم.",
      en: "React exercises and components from the fourth term.",
    },
  },
  {
    name: "term3",
    year: "2025",
    stack: ["JavaScript", "Node.js"],
    href: "https://github.com/asgharnasiri1990/term3",
    description: {
      fa: "تمرین‌های JavaScript و Node.js در ترم سوم بوت‌کمپ.",
      en: "JavaScript and Node.js exercises from the third term of the bootcamp.",
    },
  },
  {
    name: "python",
    year: "2026",
    stack: ["Python"],
    href: "https://github.com/asgharnasiri1990/python",
    description: {
      fa: "تمرین‌های پایتون؛ از مبانی زبان تا حل مسئله.",
      en: "Python exercises, from language fundamentals to problem solving.",
    },
  },
];
