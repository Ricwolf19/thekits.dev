import type { I18nConfig } from "fumadocs-core/i18n";
import { loader, type StaticSource } from "fumadocs-core/source";
import { cache } from "react";

import { DEFAULT_LOCALE, type Locale, LOCALES } from "../i18n/config";
import { routePath } from "../i18n/routes";
import type { PackageId } from "../site";
import { assemblePage, buildAnchorIndex } from "./assemble";
import { getPackageContent, type PackageContent } from "./fetch";

/**
 * Virtual files, not a content directory — pages are assembled in memory.
 *
 * `hideLocale` is unset on purpose: it would unprefix English for free, but via
 * `NextResponse.rewrite`, and avoiding middleware is the point. `url()` gets
 * the same URLs with no request-time work.
 * @see AGENTS.md#bilingual-routing
 */
export const i18nConfig: I18nConfig<Locale> = {
  languages: [...LOCALES],
  defaultLanguage: DEFAULT_LOCALE,
  // Locale is encoded in the virtual filename: `configuration.es.md`.
  parser: "dot",
};

export type DocPageData = {
  title: string;
  description: string;
  /** Assembled markdown, already heading-shifted and link-rewritten. */
  content: string;
};

/** Ties the loader's inferred page/meta types to ours, so `page.data.content`
 * is typed at the call site instead of widening to Fumadocs' base `PageData`. */
type DocSourceConfig = { pageData: DocPageData; metaData: DocMetaData };

type DocMetaData = {
  title?: string;
  root?: boolean;
  pages?: string[];
};

/** Exported for tests: pure over already-parsed content, no Next, no network. */
export const buildFiles = (content: PackageContent) => {
  const files: (
    | { type: "page"; path: string; slugs: string[]; data: DocPageData }
    | { type: "meta"; path: string; data: DocMetaData }
  )[] = [];

  for (const locale of LOCALES) {
    const readme = content.readme[locale];
    const anchors = buildAnchorIndex(content.pages, readme);

    for (const { spec, indices } of content.pages) {
      files.push({
        type: "page",
        path: `${spec.slug}.${locale}.md`,
        slugs: [spec.slug],
        data: {
          title: spec.title[locale],
          description: spec.description[locale],
          content: assemblePage(readme, indices, {
            pkg: content.id,
            locale,
            anchors,
            pageSlug: spec.slug,
          }),
        },
      });
    }

    // `root: true` keeps one package's sidebar from listing the other's pages;
    // `pages` fixes the order, which otherwise falls back to alphabetical.
    files.push({
      type: "meta",
      path: `meta.${locale}.json`,
      data: {
        title: content.id,
        root: true,
        pages: content.pages.map((page) => page.spec.slug),
      },
    });
  }

  return files;
};

const build = (content: PackageContent) => {
  const source: StaticSource<DocSourceConfig> = { files: buildFiles(content) };
  return loader({
    source,
    baseUrl: routePath({ kind: "docs", pkg: content.id }, DEFAULT_LOCALE),
    i18n: i18nConfig,
    url: (slugs, locale) =>
      routePath(
        { kind: "docs", pkg: content.id, slug: slugs },
        (locale as Locale | undefined) ?? DEFAULT_LOCALE,
      ),
  });
};

/** `cache()` so one render reuses one page tree. */
export const getDocsSource = cache(async (pkg: PackageId) =>
  build(await getPackageContent(pkg)),
);

export type DocsSource = Awaited<ReturnType<typeof getDocsSource>>;
