import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product stock/prices and the session cookie must be read per request,
  // so we use classic dynamic rendering instead of Cache Components.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Product images are remote SVGs from the practice API; skip optimization.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "practice.amirm.me",
      },
    ],
  },
};

export default nextConfig;
