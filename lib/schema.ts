import { createT, type Locale } from "./i18n/config";
import { routePath } from "./i18n/routes";
import { author, PACKAGES, type PackageId, site } from "./site";
import { absoluteUrl } from "./utils";

/**
 * Stable `@id` anchors. Every schema references the same Person and WebSite
 * nodes by `@id` instead of re-describing them, so Google merges them into one
 * entity across pages and locales rather than treating each page's copy as a
 * separate thing. Changing these URIs resets that consolidation.
 */
export const PERSON_ID = absoluteUrl("/#person");
export const WEBSITE_ID = absoluteUrl("/#website");

const personRef = { "@id": PERSON_ID };

export const personSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: author.name,
  url: author.url,
  sameAs: [author.github, author.url],
});

export const websiteSchema = (locale: Locale) => {
  const t = createT(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: absoluteUrl(routePath({ kind: "home" }, locale)),
    description: t("hub.subtitle"),
    inLanguage: locale,
    author: personRef,
    publisher: personRef,
  };
};

/**
 * A package landing page. `SoftwareApplication` (rather than `SoftwareSourceCode`)
 * is what Google's library/app result treatments key off, and the free
 * `offers` node is what marks it as genuinely free rather than unpriced.
 */
export const packageSchema = (
  pkg: PackageId,
  locale: Locale,
  meta: { name: string; description: string; version: string },
) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": absoluteUrl(`${routePath({ kind: "package", pkg }, "en")}#software`),
  name: meta.name,
  description: meta.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  softwareVersion: meta.version,
  url: absoluteUrl(routePath({ kind: "package", pkg }, locale)),
  codeRepository: PACKAGES[pkg].repo,
  downloadUrl: PACKAGES[pkg].npm,
  license: "https://opensource.org/licenses/MIT",
  programmingLanguage: "TypeScript",
  isAccessibleForFree: true,
  inLanguage: locale,
  author: personRef,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
});

export const techArticleSchema = (
  pkg: PackageId,
  locale: Locale,
  meta: { title: string; description: string; slug: string; version: string },
) => ({
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: meta.title,
  description: meta.description,
  inLanguage: locale,
  isAccessibleForFree: true,
  author: personRef,
  publisher: personRef,
  about: {
    "@id": absoluteUrl(`${routePath({ kind: "package", pkg }, "en")}#software`),
  },
  mainEntityOfPage: absoluteUrl(
    routePath({ kind: "docs", pkg, slug: [meta.slug] }, locale),
  ),
  version: meta.version,
});

export const breadcrumbSchema = (
  items: readonly { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
