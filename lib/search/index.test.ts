import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ cacheLife: () => undefined }));

import { pageMarkdown, plain, structure, tocFromMarkdown } from "./index";

describe("plain", () => {
  const cases: [string, string, string][] = [
    [
      "drops fenced code entirely",
      "before\n```ts\nconst x = 1\n```\nafter",
      "before after",
    ],
    ["drops table rows", "intro\n| a | b |\n| - | - |\nafter", "intro after"],
    [
      "unwraps inline code",
      "use `defineListConfig` here",
      "use defineListConfig here",
    ],
    [
      "keeps link text and drops the URL",
      "see [the docs](https://x.test)",
      "see the docs",
    ],
    ["keeps image alt text", "![a diagram](/x.png)", "a diagram"],
    [
      "strips emphasis and heading marks",
      "## **bold** and _thin_",
      "bold and thin",
    ],
    ["collapses whitespace", "a\n\n\n   b", "a b"],
  ];

  it.each(cases)("%s", (_name, input, expected) => {
    expect(plain(input)).toBe(expected);
  });
});

describe("structure", () => {
  it("does not read a `#` inside a fenced block as a heading", () => {
    // The trap that already bit the README parser: both packages ship
    // `# peers` inside a bash fence.
    const { headings } = structure("## Real\n\n```bash\n# peers\nnpm i x\n```");
    expect(headings.map((h) => h.content)).toEqual(["Real"]);
  });

  it("handles tilde fences too", () => {
    const { headings } = structure("## Real\n\n~~~\n# not a heading\n~~~");
    expect(headings.map((h) => h.content)).toEqual(["Real"]);
  });

  it("emits one content entry per heading, keyed by its slug", () => {
    const { headings, contents } = structure(
      "## First\n\nalpha\n\n### Second\n\nbeta",
    );
    expect(headings).toEqual([
      { id: "first", content: "First" },
      { id: "second", content: "Second" },
    ]);
    expect(contents).toEqual([
      { heading: "first", content: "alpha" },
      { heading: "second", content: "beta" },
    ]);
  });

  it("keeps prose that appears before the first heading", () => {
    const { contents } = structure("lead paragraph\n\n## After\n\nbody");
    expect(contents[0]).toEqual({
      heading: undefined,
      content: "lead paragraph",
    });
  });

  it("slugs like github-slugger, so anchors match the rendered ids", () => {
    const { headings } = structure("## Table & card tones\n\n## `useUploader`");
    expect(headings.map((h) => h.id)).toEqual([
      "table--card-tones",
      "useuploader",
    ]);
  });

  it("ignores h1 and h5, which are not section anchors", () => {
    const { headings } = structure("# Title\n\n## Section\n\n##### Deep");
    expect(headings.map((h) => h.content)).toEqual(["Section"]);
  });
});

describe("pageMarkdown", () => {
  it("restores each section at its own heading depth", () => {
    const sections = [
      { heading: { level: 3, text: "Alpha" }, body: "a" },
      { heading: { level: 4, text: "Beta" }, body: "b" },
    ];
    expect(pageMarkdown(sections, [0, 1])).toBe(
      "### Alpha\n\na\n\n#### Beta\n\nb",
    );
  });
});

describe("tocFromMarkdown", () => {
  it("takes h2 and h3 only, as anchors with their depth", () => {
    expect(tocFromMarkdown("# One\n## Two\n### Three\n#### Four")).toEqual([
      { title: "Two", url: "#two", depth: 2 },
      { title: "Three", url: "#three", depth: 3 },
    ]);
  });
});

describe("buildSearchIndexes", () => {
  const section = (level: number, text: string, body: string) => ({
    heading: { level, text, slug: text.toLowerCase(), line: 1 },
    body,
  });
  const readme = {
    title: "listkit",
    tagline: "t",
    summary: "s",
    sections: [section(2, "Features", "alpha"), section(2, "Setup", "beta")],
  };
  const page = (slug: string, index: number) => ({
    spec: {
      slug,
      title: { en: slug, es: slug },
      description: { en: "d", es: "d" },
      headings: [],
    },
    indices: [index],
  });

  const load = async () => {
    vi.resetModules();
    vi.doMock("@/lib/content/fetch", () => ({
      loadAllContent: async () => [
        {
          id: "listkit",
          version: "5.0.0",
          publishedAt: "2026-09-13T00:00:00Z",
          readme: { en: readme, es: readme },
          pages: [page("overview", 0), page("setup", 1)],
        },
      ],
    }));
    return (await import("./index")).buildSearchIndexes();
  };

  it("serves the overview at the package URL, never under /docs", async () => {
    // `/listkit/docs/overview` does not exist; a result pointing there 404s.
    const urls = (await load()).map((i) => i.url);
    expect(urls).toContain("/listkit");
    expect(urls.some((u) => u.endsWith("/docs/overview"))).toBe(false);
  });

  it("keeps ordinary docs pages under /docs", async () => {
    expect((await load()).map((i) => i.url)).toContain("/listkit/docs/setup");
  });

  it("indexes both locales", async () => {
    const urls = (await load()).map((i) => i.url);
    expect(urls).toContain("/es/listkit/docs/setup");
    expect(urls.filter((u) => u.startsWith("/es")).length).toBeGreaterThan(0);
  });

  it("indexes the hub, so the project name finds something", async () => {
    expect((await load()).some((i) => i.url === "/")).toBe(true);
  });

  it("only indexes sections that have a page", async () => {
    // Every entry must resolve to a route; an index of pages that do not exist
    // is worse than no search at all.
    const { ROUTE_READY } = await import("@/lib/site");
    const urls = (await load()).map((i) => i.url);
    expect(urls.some((u) => u.endsWith("/playground"))).toBe(
      ROUTE_READY.playground,
    );
    expect(urls.some((u) => u.endsWith("/releases"))).toBe(
      ROUTE_READY.releases,
    );
  });
});
