import type { Metadata } from "next";
import { HomeView } from "./home-view";

export const metadata: Metadata = {
  title: "خرید موبایل و لوازم جانبی اصل",
  description:
    "آیفون، سامسونگ، شیائومی، ساعت هوشمند، ایرپاد و لوازم جانبی اورجینال با ضمانت اصالت و ارسال سریع.",
};

export default function HomePage() {
  return <HomeView />;
}
