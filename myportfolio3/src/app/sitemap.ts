import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  return [
    {
      url: `${base}/en`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/fa`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
