import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";

import { getAllContent } from "@/lib/content/fetch";
import { OVERVIEW_SLUG } from "@/lib/content/manifest";
import { ROUTE_READY } from "@/lib/site";
import { hreflangMap } from "@/lib/seo";
import { routePath, type RouteDescriptor } from "@/lib/i18n/routes";
import { absoluteUrl } from "@/lib/utils";

type Entry = MetadataRoute.Sitemap[number];

/**
 * One `<url>` per language, each carrying the full reciprocal alternate set:
 * Google expects every version submitted on its own, not merely referenced.
 * Uses the same `hreflangMap` as the pages, so the two cannot disagree.
 */
const entry = (
  descriptor: RouteDescriptor,
  priority: number,
  changeFrequency: Entry["changeFrequency"],
  lastModified: Date,
): Entry[] => {
  const languages = hreflangMap(descriptor);
  return (["en", "es"] as const).map((locale) => ({
    url: absoluteUrl(routePath(descriptor, locale)),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
};

// Cached at build rather than rendered per request: a cold start exactly when
// Google fetches the sitemap would serve a 5xx, and a request-time `now` makes
// every <lastmod> claim the page changed this second.
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  "use cache";
  cacheLife("max");

  const packages = await getAllContent();
  const now = new Date();

  return [
    ...entry({ kind: "home" }, 1, "weekly", now),
    ...packages.flatMap((content) => {
      const pkg = content.id;
      // Docs are generated from the README of a published release, so the
      // release date is their real last-modified.
      const released = new Date(content.publishedAt);
      return [
        ...entry({ kind: "package", pkg }, 0.9, "weekly", released),
        ...(ROUTE_READY.playground
          ? entry({ kind: "playground", pkg }, 0.6, "monthly", now)
          : []),
        ...(ROUTE_READY.releases
          ? entry({ kind: "releases", pkg }, 0.5, "weekly", released)
          : []),
        ...content.pages
          .filter((page) => page.spec.slug !== OVERVIEW_SLUG)
          .flatMap((page) =>
            entry(
              { kind: "docs", pkg, slug: [page.spec.slug] },
              0.7,
              "monthly",
              released,
            ),
          ),
      ];
    }),
  ];
};

export default sitemap;
