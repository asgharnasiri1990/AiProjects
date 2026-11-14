"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { HeroSlider } from "@/components/hero-slider";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <SiteHeader />
      {isHome ? <HeroSlider /> : null}
      <div className="flex-1">{children}</div>
    </>
  );
}
