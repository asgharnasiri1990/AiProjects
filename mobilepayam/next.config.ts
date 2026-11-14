import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Catalog/admin state lives in localStorage on the client, so pages are
  // rendered per request rather than through Cache Components.
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
    // Product imagery is local and already sized; skip the optimizer.
    unoptimized: true,
  },
  async rewrites() {
    // Browsers still probe /favicon.ico even when app/icon.svg is present.
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
};

export default nextConfig;
