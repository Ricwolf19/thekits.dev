import type { Metadata } from "next";

import { type Locale } from "./i18n/config";
import { OG_LOCALE } from "./i18n/localeCodes";
import { routePath, type RouteDescriptor } from "./i18n/routes";
import { site } from "./site";
import { absoluteUrl } from "./utils";

/**
 * Language-only codes so Spanish speakers outside Mexico still match. Must stay
 * identical to the sitemap's alternates — Google drops the cluster when they
 * disagree, which is why both come from one descriptor.
 */
export const hreflangMap = (d: RouteDescriptor): Record<string, string> => ({
  en: absoluteUrl(routePath(d, "en")),
  es: absoluteUrl(routePath(d, "es")),
  "x-default": absoluteUrl(routePath(d, "en")),
});

/**
 * Every page must set its own: inherited from the root layout, a canonical
 * would point every page at the home URL.
 */
export const localeAlternates = (
  d: RouteDescriptor,
  locale: Locale,
): NonNullable<Metadata["alternates"]> => ({
  canonical: absoluteUrl(routePath(d, locale)),
  languages: hreflangMap(d),
});

/**
 * The site-wide Open Graph card, stated explicitly because declaring
 * `openGraph` in a segment drops the image Next injected from
 * `opengraph-image.tsx`. Routes that own an `opengraph-image.tsx` must NOT
 * spread this.
 */
export const defaultOgImage = {
  url: absoluteUrl(site.ogImage),
  width: 1200,
  height: 630,
  alt: "thekits.dev — open-source TypeScript kits for React apps",
} as const;

/**
 * Omit title/description to keep the layout defaults. `ownsOgImage` opts out of
 * the shared card for routes shipping their own `opengraph-image.tsx`.
 */
export const pageMetadata = (
  d: RouteDescriptor,
  locale: Locale,
  meta?: {
    title?: string;
    description?: string;
    ownsOgImage?: boolean;
  },
): Metadata => ({
  ...(meta?.title ? { title: meta.title } : {}),
  ...(meta?.description ? { description: meta.description } : {}),
  alternates: localeAlternates(d, locale),
  openGraph: {
    url: absoluteUrl(routePath(d, locale)),
    locale: OG_LOCALE[locale],
    alternateLocale: OG_LOCALE[locale === "en" ? "es" : "en"],
    ...(meta?.ownsOgImage ? {} : { images: [defaultOgImage] }),
    ...(meta?.title ? { title: meta.title } : {}),
    ...(meta?.description ? { description: meta.description } : {}),
  },
});
