import type { Localized } from "@/lib/i18n";

export const profile = {
  name: {
    en: "Asghar Nasiri",
    fa: "اصغر نصیری",
  } satisfies Localized,
  email: "asgharnasiri1990@gmail.com",
  role: {
    en: "Front-end developer",
    fa: "توسعه‌دهنده فرانت‌اند",
  } satisfies Localized,
  location: {
    en: "Iran",
    fa: "ایران",
  } satisfies Localized,
  photo: "/images/avatar.jpg",
  socials: [
    { label: "GitHub", href: "https://github.com/asgharnasiri1990" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/asgharnasiri" },
    { label: "Instagram", href: "https://www.instagram.com/asghar.nasiri" },
  ],
};
