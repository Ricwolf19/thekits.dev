import type { Locale } from "../i18n/config";
import { routePath } from "../i18n/routes";
import { PACKAGES, type PackageId } from "../site";
import type { ResolvedPage } from "./manifest";
import { type ParsedReadme, rewriteLinks, type Section } from "./parse";

/**
 * Turns resolved README sections into a page's markdown: normalises heading
 * depth and repoints links that only worked while one document held them all.
 * @see AGENTS.md#readme-docs-pipeline
 */

/** README anchor → the page slug that now owns that section. */
export type AnchorIndex = ReadonlyMap<string, string>;

/** Built per locale: translated headings slug differently. */
export const buildAnchorIndex = (
  pages: readonly ResolvedPage[],
  readme: ParsedReadme,
): AnchorIndex => {
  const index = new Map<string, string>();
  for (const { spec, indices } of pages) {
    for (const i of indices) {
      index.set(readme.sections[i].heading.slug, spec.slug);
    }
  }
  return index;
};

/**
 * How far to move a page's headings so its shallowest becomes `h2` (the page
 * title is the `h1`). Shared by the renderer and the table of contents: if the
 * two computed it separately and drifted, the rewritten `#fragment` links would
 * point at ids that no longer exist — silently.
 */
const headingShift = (sections: readonly Section[]): number =>
  2 - Math.min(...sections.map((s) => s.heading.level));

const shiftHeadings = (sections: readonly Section[]): string => {
  const shift = headingShift(sections);
  return sections
    .map((section) => {
      const level = Math.min(6, Math.max(2, section.heading.level + shift));
      const hashes = "#".repeat(level);
      const heading = `${hashes} ${section.heading.text}`;
      return section.body ? `${heading}\n\n${section.body}` : heading;
    })
    .join("\n\n");
};

export type AssembleContext = {
  readonly pkg: PackageId;
  readonly locale: Locale;
  readonly anchors: AnchorIndex;
  /** Slug of the page being assembled, so its own anchors stay relative. */
  readonly pageSlug: string;
};

const docsUrl = (pkg: PackageId, locale: Locale, page: string): string =>
  routePath({ kind: "docs", pkg, slug: [page] }, locale);

export const assemblePage = (
  readme: ParsedReadme,
  indices: readonly number[],
  ctx: AssembleContext,
): string => {
  const sections = indices.map((i) => readme.sections[i]);
  const markdown = shiftHeadings(sections);
  const info = PACKAGES[ctx.pkg];

  return rewriteLinks(
    markdown,
    (anchor) => {
      const owner = ctx.anchors.get(anchor);
      // Unknown anchors are left alone rather than guessed at: the heading may
      // live in the stripped hero or table of contents.
      if (!owner) return null;
      if (owner === ctx.pageSlug) return null;
      return `${docsUrl(ctx.pkg, ctx.locale, owner)}#${anchor}`;
    },
    (path) => {
      if (path === "./LICENSE") return `${info.repo}/blob/main/LICENSE`;
      // The cross-language link should stay on this site, not bounce to GitHub.
      if (path === "./README.es.md")
        return docsUrl(ctx.pkg, "es", ctx.pageSlug);
      if (path === "./README.md") return docsUrl(ctx.pkg, "en", ctx.pageSlug);
      if (path.startsWith("./"))
        return `${info.repo}/blob/main/${path.slice(2)}`;
      return null;
    },
  );
};

/**
 * Reuses each section's stored slug rather than re-slugging: duplicate heading
 * text is already rejected, so this stays identical to the anchors
 * `buildAnchorIndex` publishes in cross-page links.
 */
export const pageToc = (
  readme: ParsedReadme,
  indices: readonly number[],
): { level: number; text: string; slug: string }[] => {
  const sections = indices.map((i) => readme.sections[i]);
  const shift = headingShift(sections);
  return sections.map((section) => ({
    level: Math.min(6, Math.max(2, section.heading.level + shift)),
    text: section.heading.text,
    slug: section.heading.slug,
  }));
};
