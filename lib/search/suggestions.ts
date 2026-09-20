import { createT, type Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { packageSections } from "@/lib/nav";
import { PACKAGE_IDS } from "@/lib/site";

/**
 * Shown in the search dialog before a query is typed. Without them the box
 * opens empty, which reads as "search is broken" rather than "type something".
 *
 * Playground and Releases come from `packageSections`, so an unbuilt route is
 * absent here for the same reason it is absent from the sitemap and the nav.
 */
export const searchSuggestions = (locale: Locale): [string, string][] => {
  const t = createT(locale);
  return PACKAGE_IDS.flatMap((pkg): [string, string][] => [
    [
      `${pkg} — ${t("nav.overview")}`,
      routePath({ kind: "package", pkg }, locale),
    ],
    [
      `${pkg} — ${t("common.getStarted")}`,
      routePath({ kind: "docs", pkg, slug: ["getting-started"] }, locale),
    ],
    ...packageSections(pkg, locale, t).map((section): [string, string] => [
      `${pkg} — ${section.name}`,
      section.url,
    ]),
  ]);
};
