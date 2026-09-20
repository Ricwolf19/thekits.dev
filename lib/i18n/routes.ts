import type { PackageId } from "../site";
import type { Locale } from "./config";

/**
 * Descriptor-driven rather than a literal EN/ES path map: both locales come
 * from one descriptor, so a canonical and its alternate cannot disagree.
 * English is at the root, Spanish under `/es`.
 * @see AGENTS.md#bilingual-routing
 */
export type RouteDescriptor =
  | { kind: "home" }
  | { kind: "package"; pkg: PackageId }
  | { kind: "docs"; pkg: PackageId; slug?: readonly string[] }
  | { kind: "playground"; pkg: PackageId }
  | { kind: "releases"; pkg: PackageId };

/** `docs` and `playground` stay English: the loanwords Spanish devs use. */
const SEGMENT = {
  docs: { en: "docs", es: "docs" },
  playground: { en: "playground", es: "playground" },
  releases: { en: "releases", es: "versiones" },
} as const satisfies Record<string, Record<Locale, string>>;

/** Prefix a locale-agnostic path. English is unprefixed. */
export const localePath = (locale: Locale, path = ""): string =>
  locale === "en" ? path || "/" : `/es${path}`;

export const routePath = (d: RouteDescriptor, locale: Locale): string => {
  switch (d.kind) {
    case "home":
      return localePath(locale);
    case "package":
      return localePath(locale, `/${d.pkg}`);
    case "docs": {
      const tail = d.slug?.length ? `/${d.slug.join("/")}` : "";
      return localePath(locale, `/${d.pkg}/${SEGMENT.docs[locale]}${tail}`);
    }
    case "playground":
      return localePath(locale, `/${d.pkg}/${SEGMENT.playground[locale]}`);
    case "releases":
      return localePath(locale, `/${d.pkg}/${SEGMENT.releases[locale]}`);
  }
};

/** The sibling-language URL for the language switcher. */
export const alternatePath = (d: RouteDescriptor, current: Locale): string =>
  routePath(d, current === "en" ? "es" : "en");
