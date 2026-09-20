import { describe, expect, it } from "vitest";

import { hreflangMap, localeAlternates, pageMetadata } from "./seo";
import { rootMetadata } from "./metadata";
import { packageSchema, personSchema, websiteSchema } from "./schema";

const docs = { kind: "docs", pkg: "listkit", slug: ["theming"] } as const;

describe("hreflangMap", () => {
  it("is reciprocal and points x-default at English", () => {
    // Google cross-checks these against the sitemap and drops the cluster when
    // the two disagree, which is why both come from one descriptor.
    const map = hreflangMap(docs);
    expect(map).toEqual({
      en: "https://thekits.dev/listkit/docs/theming",
      es: "https://thekits.dev/es/listkit/docs/theming",
      "x-default": "https://thekits.dev/listkit/docs/theming",
    });
  });

  it("does not vary with the locale being rendered", () => {
    expect(hreflangMap(docs)).toEqual(hreflangMap(docs));
  });
});

describe("localeAlternates", () => {
  it("self-canonicalizes to the locale being rendered", () => {
    expect(localeAlternates(docs, "es").canonical).toBe(
      "https://thekits.dev/es/listkit/docs/theming",
    );
    expect(localeAlternates(docs, "en").canonical).toBe(
      "https://thekits.dev/listkit/docs/theming",
    );
  });
});

describe("pageMetadata", () => {
  it("always sets its own canonical", () => {
    const meta = pageMetadata(docs, "en", { title: "T", description: "D" });
    expect(meta.alternates?.canonical).toBe(
      "https://thekits.dev/listkit/docs/theming",
    );
    expect(meta.title).toBe("T");
  });

  it("attaches the shared OG card by default", () => {
    const meta = pageMetadata(docs, "en");
    expect(meta.openGraph).toHaveProperty("images");
  });

  it("omits the shared card when the route owns an opengraph-image", () => {
    // Declaring `openGraph` in a segment drops the image Next injected from
    // `opengraph-image.tsx`; spreading the default would hide the real one.
    const meta = pageMetadata(docs, "en", { ownsOgImage: true });
    expect(meta.openGraph).not.toHaveProperty("images");
  });

  it("declares the locale pair for Open Graph", () => {
    const meta = pageMetadata(docs, "es");
    expect(meta.openGraph).toMatchObject({
      locale: "es_MX",
      alternateLocale: "en_US",
    });
  });
});

describe("rootMetadata", () => {
  it("declares no alternates", () => {
    // Inherited by every page, a root canonical would make each page
    // self-canonicalize to the home URL.
    expect(rootMetadata("en").alternates).toBeUndefined();
    expect(rootMetadata("es").alternates).toBeUndefined();
  });

  it("sets metadataBase so relative OG and canonical URLs resolve", () => {
    expect(String(rootMetadata("en").metadataBase)).toContain("thekits.dev");
  });
});

describe("schema @id anchoring", () => {
  it("keeps entity ids identical across locales", () => {
    // Different ids per locale would split one entity into two in Google's
    // knowledge graph, which is the whole reason these are stable URIs.
    const en = packageSchema("listkit", "en", {
      name: "listkit",
      description: "d",
      version: "5.0.0",
    });
    const es = packageSchema("listkit", "es", {
      name: "listkit",
      description: "d",
      version: "5.0.0",
    });
    expect(en["@id"]).toBe(es["@id"]);
    expect(en.url).not.toBe(es.url);
  });

  it("references the shared Person node rather than re-describing it", () => {
    const site = websiteSchema("en");
    expect(site.author).toEqual({ "@id": personSchema()["@id"] });
  });

  it("marks the package as free so it can qualify for software results", () => {
    const schema = packageSchema("uploaderkit", "en", {
      name: "u",
      description: "d",
      version: "2.0.0",
    });
    expect(schema.isAccessibleForFree).toBe(true);
    expect(schema.offers).toMatchObject({ price: "0" });
  });
});
