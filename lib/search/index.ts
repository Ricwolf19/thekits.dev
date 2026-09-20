import type { StructuredData } from "fumadocs-core/mdx-plugins";
import GithubSlugger from "github-slugger";

import { loadAllContent } from "@/lib/content/fetch";
import { OVERVIEW_SLUG } from "@/lib/content/manifest";
import { scanHeadings } from "@/lib/content/parse";
import { createT, LOCALES } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { PACKAGES, ROUTE_READY } from "@/lib/site";

export type SearchIndex = {
  id: string;
  title: string;
  description?: string;
  url: string;
  locale: string;
  structuredData: StructuredData;
};

/**
 * Markdown stripped to prose: fences and tables are noise in a search snippet
 * and drown the sentence that actually matched.
 *
 * Exported because it and `structure` carry this module's real complexity, and
 * the only other way in is `buildSearchIndexes`, which needs the content loader
 * mocked — testing six chained regexes through that would assert the mock.
 */
export const plain = (markdown: string): string =>
  markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^\s*\|.*$/gm, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_>#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Splits a page's markdown into one entry per heading, so a hit lands on the
 * section rather than the top of a 2,000-word page. Fence-aware for the same
 * reason the parser is: both READMEs contain `#` comments inside bash blocks.
 */
export const structure = (markdown: string): StructuredData => {
  const headings: StructuredData["headings"] = [];
  const contents: StructuredData["contents"] = [];
  const slugger = new GithubSlugger();

  let current: string | undefined;
  let buffer: string[] = [];
  const flush = () => {
    const text = plain(buffer.join("\n"));
    if (text) contents.push({ heading: current, content: text });
    buffer = [];
  };

  let fence: string | null = null;
  for (const line of markdown.split("\n")) {
    const open = /^\s*(```|~~~)/.exec(line);
    if (fence) {
      if (open && line.trim().startsWith(fence)) fence = null;
      buffer.push(line);
      continue;
    }
    if (open) {
      fence = open[1];
      buffer.push(line);
      continue;
    }
    const heading = /^(#{2,4})\s+(.+?)\s*#*$/.exec(line);
    if (!heading) {
      buffer.push(line);
      continue;
    }
    flush();
    const content = heading[2].trim();
    const id = slugger.slug(content);
    headings.push({ id, content });
    current = id;
  }
  flush();

  return { headings, contents };
};

/** The markdown a docs page renders, reassembled from its claimed sections. */
export const pageMarkdown = (
  sections: readonly {
    heading: { level: number; text: string };
    body: string;
  }[],
  indices: readonly number[],
): string =>
  indices
    .map((i) => {
      const section = sections[i];
      return `${"#".repeat(section.heading.level)} ${section.heading.text}\n\n${section.body}`;
    })
    .join("\n\n");

/**
 * Every page on the site, in both locales: the generated docs plus the routes
 * that are not generated (overview, playground, releases, the hub). A search
 * that only covers the docs tree misses half the site and reads as broken.
 */
export const buildSearchIndexes = async (): Promise<SearchIndex[]> => {
  const packages = await loadAllContent();
  const indexes: SearchIndex[] = [];

  for (const locale of LOCALES) {
    const t = createT(locale);

    for (const content of packages) {
      const pkg = content.id;
      const readme = content.readme[locale];

      for (const { spec, indices } of content.pages) {
        const isOverview = spec.slug === OVERVIEW_SLUG;
        indexes.push({
          id: `${pkg}-${spec.slug}-${locale}`,
          title: spec.title[locale],
          description: spec.description[locale],
          url: isOverview
            ? routePath({ kind: "package", pkg }, locale)
            : routePath({ kind: "docs", pkg, slug: [spec.slug] }, locale),
          locale,
          structuredData: structure(pageMarkdown(readme.sections, indices)),
        });
      }

      const extras = [
        {
          ready: ROUTE_READY.playground,
          id: `${pkg}-playground-${locale}`,
          title: t("playground.title"),
          body: t("playground.subtitle"),
          url: routePath({ kind: "playground", pkg }, locale),
        },
        {
          ready: ROUTE_READY.releases,
          id: `${pkg}-releases-${locale}`,
          title: t("releases.title"),
          body: t("releases.subtitle"),
          url: routePath({ kind: "releases", pkg }, locale),
        },
      ];

      for (const extra of extras) {
        if (!extra.ready) continue;
        indexes.push({
          id: extra.id,
          title: `${pkg} — ${extra.title}`,
          description: PACKAGES[pkg].npmName,
          url: extra.url,
          locale,
          structuredData: {
            headings: [],
            contents: [{ heading: undefined, content: extra.body }],
          },
        });
      }
    }

    indexes.push({
      id: `home-${locale}`,
      title: t("hub.title"),
      description: t("hub.subtitle"),
      url: routePath({ kind: "home" }, locale),
      locale,
      structuredData: {
        headings: [],
        contents: [
          {
            heading: undefined,
            content: `${t("hub.eyebrow")} ${t("hub.subtitle")}`,
          },
        ],
      },
    });
  }

  return indexes;
};

/** Headings of a markdown body, for a page's own table of contents. */
export const tocFromMarkdown = (markdown: string) =>
  scanHeadings(markdown)
    .filter((heading) => heading.level >= 2 && heading.level <= 3)
    .map((heading) => ({
      title: heading.text,
      url: `#${heading.slug}`,
      depth: heading.level,
    }));
