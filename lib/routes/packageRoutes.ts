import type { Metadata } from "next";

import { getAllContent, getPackageContent } from "@/lib/content/fetch";
import { OVERVIEW_SLUG } from "@/lib/content/manifest";
import { createT, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { isPackageId, PACKAGE_IDS, type PackageId } from "@/lib/site";

/**
 * Route-segment exports shared by both locale trees, so each `page.tsx` only
 * names its locale. Not a component module — mixing component and
 * non-component exports breaks Fast Refresh.
 * @see AGENTS.md#bilingual-routing
 */
export type PackageRouteParams = { pkg: string };
export type DocsRouteParams = PackageRouteParams & { slug?: string[] };

/** Only the known packages are served, so `/es` is never read as a package. */
export const packageParams = async () => PACKAGE_IDS.map((pkg) => ({ pkg }));

/** Every docs page of every package, for both segments at once. */
export const docsParams = async () => {
  const all = await getAllContent();
  return all.flatMap((content) =>
    content.pages
      .filter((page) => page.spec.slug !== OVERVIEW_SLUG)
      .map((page) => ({ pkg: content.id, slug: [page.spec.slug] })),
  );
};

const resolvePkg = async (
  params: Promise<PackageRouteParams>,
): Promise<PackageId | null> => {
  const { pkg } = await params;
  return isPackageId(pkg) ? pkg : null;
};

/** Landing-page metadata: the package's own tagline, straight from its README. */
export const landingMetadata = async (
  params: Promise<PackageRouteParams>,
  locale: Locale,
): Promise<Metadata> => {
  const pkg = await resolvePkg(params);
  if (!pkg) return {};
  const { readme } = await getPackageContent(pkg);
  const { title, tagline, summary } = readme[locale];
  return pageMetadata({ kind: "package", pkg }, locale, {
    title: `${title} — ${tagline}`,
    description: summary || tagline,
  });
};

export const playgroundMetadata = async (
  params: Promise<PackageRouteParams>,
  locale: Locale,
): Promise<Metadata> => {
  const pkg = await resolvePkg(params);
  if (!pkg) return {};
  const t = createT(locale);
  return pageMetadata({ kind: "playground", pkg }, locale, {
    title: `${pkg} — ${t("playground.title")}`,
    description: t("playground.subtitle"),
  });
};

export const releasesMetadata = async (
  params: Promise<PackageRouteParams>,
  locale: Locale,
): Promise<Metadata> => {
  const pkg = await resolvePkg(params);
  if (!pkg) return {};
  const t = createT(locale);
  return pageMetadata({ kind: "releases", pkg }, locale, {
    title: `${pkg} — ${t("releases.title")}`,
    description: t("releases.subtitle"),
  });
};

export const docsMetadata = async (
  params: Promise<DocsRouteParams>,
  locale: Locale,
): Promise<Metadata> => {
  const { pkg, slug } = await params;
  if (!isPackageId(pkg) || !slug?.length) return {};
  const content = await getPackageContent(pkg);
  const spec = content.pages.find((p) => p.spec.slug === slug[0])?.spec;
  if (!spec) return {};
  return pageMetadata({ kind: "docs", pkg, slug }, locale, {
    title: spec.title[locale],
    description: spec.description[locale],
  });
};
