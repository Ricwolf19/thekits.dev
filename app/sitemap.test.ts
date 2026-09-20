import { beforeEach, describe, expect, it, vi } from "vitest";

// `cacheLife` throws outside a Next cache scope; the `"use cache"` directive
// itself is inert in a plain module, so stubbing this is enough to call the
// sitemap directly.
vi.mock("next/cache", () => ({ cacheLife: () => undefined }));

const page = (slug: string) => ({
  spec: {
    slug,
    title: { en: slug, es: slug },
    description: { en: "", es: "" },
    headings: [],
  },
  indices: [0],
});

vi.mock("@/lib/content/fetch", () => ({
  getAllContent: async () => [
    {
      id: "listkit",
      version: "5.0.0",
      publishedAt: "2026-09-13T20:45:31Z",
      readme: {},
      pages: [page("overview"), page("getting-started")],
    },
    {
      id: "uploaderkit",
      version: "2.0.0",
      publishedAt: "2026-08-14T10:00:00Z",
      readme: {},
      pages: [page("overview")],
    },
  ],
}));

const load = async () => (await import("./sitemap")).default();

describe("sitemap", () => {
  beforeEach(() => vi.resetModules());

  it("submits every URL in both languages", async () => {
    const entries = await load();
    const { ROUTE_READY } = await import("@/lib/site");
    // Counted from the fixture: 1 hub, plus per package a landing, its doc
    // pages, and whichever of playground/releases is switched on.
    const extras =
      (ROUTE_READY.playground ? 1 : 0) + (ROUTE_READY.releases ? 1 : 0);
    const pages = 1 + (1 + 2 + extras) + (1 + 1 + extras);
    expect(entries).toHaveLength(pages * 2);

    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://thekits.dev/listkit/docs/overview");
    expect(urls).toContain("https://thekits.dev/es/listkit/docs/overview");
  });

  it("emits no duplicate locations", async () => {
    const urls = (await load()).map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("uses absolute production URLs only", async () => {
    for (const entry of await load()) {
      expect(entry.url).toMatch(/^https:\/\/thekits\.dev(\/|$)/);
    }
  });

  it("makes every hreflang alternate a submitted URL of its own", async () => {
    // Google drops a cluster whose alternates are not themselves submitted.
    const entries = await load();
    const urls = new Set(entries.map((e) => e.url));
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {};
      expect(urls.has(String(languages.en))).toBe(true);
      expect(urls.has(String(languages.es))).toBe(true);
      expect(languages["x-default"]).toBe(languages.en);
    }
  });

  it("translates the releases segment in the Spanish tree", async () => {
    const urls = (await load()).map((e) => e.url);
    expect(urls).toContain("https://thekits.dev/listkit/releases");
    expect(urls).toContain("https://thekits.dev/es/listkit/versiones");
  });

  it("omits routes that have no page yet", async () => {
    // ROUTE_READY.playground is the gate; a sitemap that lists a 404 spends
    // crawl budget teaching Google the page is broken.
    const { ROUTE_READY } = await import("@/lib/site");
    const urls = (await load()).map((e) => e.url);
    const hasPlayground = urls.some((u) => u.includes("/playground"));
    expect(hasPlayground).toBe(ROUTE_READY.playground);
  });

  it("dates docs from the release they were generated from", async () => {
    const entries = await load();
    const doc = entries.find((e) => e.url.endsWith("/listkit/docs/overview"));
    expect(doc?.lastModified).toEqual(new Date("2026-09-13T20:45:31Z"));
  });
});
