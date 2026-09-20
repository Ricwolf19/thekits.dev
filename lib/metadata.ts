import type { Metadata, Viewport } from "next";

import { createT, type Locale } from "./i18n/config";
import { author, site } from "./site";
import { siteUrl } from "./utils";

const KEYWORDS = [
  "react table library",
  "react list view",
  "react file upload",
  "headless upload react",
  "typescript react library",
  "tailwind v4 components",
  "nextjs data table",
  "listkit",
  "uploaderkit",
];

/**
 * Root metadata for one locale tree.
 *
 * Deliberately declares no `alternates`: inherited by every page, a root
 * canonical makes each page self-canonicalize to the home URL. Pages set their
 * own through `pageMetadata`.
 */
export const rootMetadata = (locale: Locale): Metadata => {
  const t = createT(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${site.name} — ${t("hub.title")}`,
      template: `%s · ${site.name}`,
    },
    description: t("hub.subtitle"),
    applicationName: site.name,
    authors: [{ name: author.name, url: author.url }],
    creator: author.name,
    publisher: author.name,
    keywords: KEYWORDS,
    category: "technology",
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${site.name} — ${t("hub.title")}`,
      description: t("hub.subtitle"),
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${t("hub.title")}`,
      description: t("hub.subtitle"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    manifest: "/manifest.webmanifest",
  };
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};
