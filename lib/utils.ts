import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution (shadcn convention). */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Absolute site URL. Used by metadata, sitemap, OG images, canonical links.
 * Tolerates a protocol-less env value (e.g. `www.thekits.dev`) by prefixing
 * `https://` so `new URL(siteUrl)` in the layout never throws at build time. */
export const siteUrl = (() => {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "https://thekits.dev")
    .trim()
    .replace(/\/$/, "");
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
})();

/** Build an absolute URL from a path (for canonical / OG / hreflang). */
export const absoluteUrl = (path = "") =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
