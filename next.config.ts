import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  // Enables `use cache` / `cacheTag` / `cacheLife`, makes PPR the default (a
  // static shell streams immediately while dynamic content fills in), and lets
  // React keep component state across client navigations via <Activity>.
  // The sitemap and the README content loader both depend on `use cache`.
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tree-shake big barrel imports for smaller client bundles (better INP/LCP).
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ];
    // HSTS only in production: with includeSubDomains+preload, dev would pin
    // localhost to HTTPS for 2 years and break every http:// dev server.
    if (process.env.NODE_ENV === "production") {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
