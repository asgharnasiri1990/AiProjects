import type { Localized } from "@/lib/i18n";

export const profile = {
  name: {
    en: "Asghar Nasiri",
    fa: "اصغر نصیری",
  } satisfies Localized,
  initials: "AN",
  email: "asgharnasiri1990@gmail.com",
  role: {
    en: "Front-end developer",
    fa: "توسعه‌دهنده فرانت‌اند",
  } satisfies Localized,
  location: {
    en: "Iran",
    fa: "ایران",
  } satisfies Localized,
  photo: "/images/portrait.png",
  socials: [
    { label: "GitHub", href: "https://github.com/asgharnasiri1990" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/asgharnasiri" },
  ],
};
