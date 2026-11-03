import type { Localized } from "@/lib/i18n";

/**
 * Profile — the single source for the name, monogram and contact details.
 */
export const profile = {
  name: {
    fa: "اصغر نصیری",
    en: "Asghar Nasiri",
  } satisfies Localized,
  initials: "AN",
  email: "asgharnasiri1990@gmail.com",
  photo: "/images/portrait.webp",
  socials: [
    { label: "GitHub", href: "https://github.com/asgharnasiri1990" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/asgharnasiri" },
  ],
};
