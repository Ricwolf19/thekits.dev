import { describe, expect, it } from "vitest";

import { assemblePage, buildAnchorIndex } from "./assemble";
import type { PackageContent } from "./fetch";
import type { ParsedReadme, Section } from "./parse";
import { buildFiles } from "./source";

const section = (level: number, text: string, body = ""): Section => ({
  heading: {
    level,
    text,
    slug: text
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/^-|-$/g, ""),
    line: 1,
  },
  body,
});

const readme = (sections: Section[]): ParsedReadme => ({
  title: "listkit",
  tagline: "t",
  summary: "s",
  sections,
});

/** Two pages; the second links back into the first, which is the case that breaks. */
const en = readme([
  section(3, "Advanced filters", "See [sorting](#column-sorting)."),
  section(4, "Default filter values", "Defaults."),
  section(3, "Column sorting", "Sorting, and the [license](./LICENSE)."),
]);
const es = readme([
  section(
    3,
    "Filtros avanzados",
    "Ver [ordenamiento](#ordenamiento-por-columna).",
  ),
  section(4, "Valores por defecto", "Defaults."),
  section(3, "Ordenamiento por columna", "Orden, y la [licencia](./LICENSE)."),
]);

const pages = [
  {
    spec: {
      slug: "filtering",
      title: { en: "Filtering", es: "Filtros" },
      description: { en: "d", es: "d" },
      headings: ["Advanced filters", "Default filter values"],
    },
    indices: [0, 1],
  },
  {
    spec: {
      slug: "sorting",
      title: { en: "Sorting", es: "Ordenamiento" },
      description: { en: "d", es: "d" },
      headings: ["Column sorting"],
    },
    indices: [2],
  },
];

const content: PackageContent = {
  id: "listkit",
  version: "5.0.0",
  publishedAt: "2026-09-13T20:45:31Z",
  readme: { en, es },
  pages,
};

describe("assemblePage", () => {
  const anchors = buildAnchorIndex(pages, en);

  it("shifts the shallowest owned heading to h2 and the rest with it", () => {
    // Page owns an h3 + h4; as a standalone page they must read h2 + h3.
    const out = assemblePage(en, [0, 1], {
      pkg: "listkit",
      locale: "en",
      anchors,
      pageSlug: "filtering",
    });
    expect(out).toContain("## Advanced filters");
    expect(out).toContain("### Default filter values");
    expect(out).not.toContain("#### ");
  });

  it("rewrites an anchor that now lives on another page", () => {
    const out = assemblePage(en, [0, 1], {
      pkg: "listkit",
      locale: "en",
      anchors,
      pageSlug: "filtering",
    });
    expect(out).toContain("[sorting](/listkit/docs/sorting#column-sorting)");
  });

  it("keeps a same-page anchor relative", () => {
    const self = buildAnchorIndex(
      [{ ...pages[0], spec: { ...pages[0].spec, slug: "filtering" } }],
      en,
    );
    const out = assemblePage(
      readme([section(3, "A", "see [b](#b)"), section(3, "B", "")]),
      [0, 1],
      { pkg: "listkit", locale: "en", anchors: self, pageSlug: "filtering" },
    );
    expect(out).toContain("[b](#b)");
  });

  it("sends relative repo links to GitHub", () => {
    const out = assemblePage(en, [2], {
      pkg: "listkit",
      locale: "en",
      anchors,
      pageSlug: "sorting",
    });
    expect(out).toContain(
      "[license](https://github.com/Ricwolf19/listkit/blob/main/LICENSE)",
    );
  });

  it("prefixes cross-page links with /es in the Spanish tree", () => {
    const esAnchors = buildAnchorIndex(pages, es);
    const out = assemblePage(es, [0, 1], {
      pkg: "listkit",
      locale: "es",
      anchors: esAnchors,
      pageSlug: "filtering",
    });
    expect(out).toContain(
      "(/es/listkit/docs/sorting#ordenamiento-por-columna)",
    );
  });
});

describe("buildFiles", () => {
  const files = buildFiles(content);

  it("emits one page per slug per locale, with the locale in the filename", () => {
    const paths = files.filter((f) => f.type === "page").map((f) => f.path);
    expect(paths).toEqual([
      "filtering.en.md",
      "sorting.en.md",
      "filtering.es.md",
      "sorting.es.md",
    ]);
  });

  it("carries localized titles onto the pages", () => {
    const esPage = files.find((f) => f.path === "filtering.es.md");
    expect(esPage?.data.title).toBe("Filtros");
  });

  it("isolates each package's sidebar and fixes page order", () => {
    const meta = files.filter((f) => f.type === "meta");
    expect(meta.map((m) => m.path)).toEqual(["meta.en.json", "meta.es.json"]);
    expect(meta[0].data).toMatchObject({
      root: true,
      pages: ["filtering", "sorting"],
    });
  });
});
