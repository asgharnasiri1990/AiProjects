import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is static; no request-time data is read.
  cacheComponents: false,
  // The root layout lives in [locale], so a global 404 needs its own document.
  experimental: {
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
