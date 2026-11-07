import type { Localized } from "@/lib/i18n";

/**
 * The single source for identity and contact details.
 *
 * Nothing here is decorative: the header, footer, metadata and contact page
 * all read from this object.
 */
export const profile = {
  name: {
    fa: "اصغر نصیری",
    en: "Asghar Nasiri",
  } satisfies Localized,
  initials: "AN",
  email: "asgharnasiri1990@gmail.com",
  role: {
    fa: "توسعه‌دهنده فرانت‌اند",
    en: "Front-end developer",
  } satisfies Localized,
  location: {
    fa: "تهران، ایران",
    en: "Tehran, Iran",
  } satisfies Localized,
  socials: [
    { label: "GitHub", href: "https://github.com/asgharnasiri1990" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/asgharnasiri" },
  ],
};
