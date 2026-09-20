import { describe, expect, it } from "vitest";

import { listkitManifest } from "@/content/listkit.map";
import { uploaderkitManifest } from "@/content/uploaderkit.map";
import { OVERVIEW_SLUG } from "@/lib/content/manifest";
import { PACKAGE_IDS, type PackageId } from "@/lib/site";

import { searchSuggestions } from "./suggestions";

const MANIFESTS: Record<PackageId, { pages: readonly { slug: string }[] }> = {
  listkit: listkitManifest,
  uploaderkit: uploaderkitManifest,
};

describe("searchSuggestions", () => {
  it("offers the same four entry points for every package", () => {
    const suggestions = searchSuggestions("en");

    expect(suggestions).toHaveLength(PACKAGE_IDS.length * 4);
  });

  it("only links docs slugs the manifest actually emits", () => {
    // The whole point of the dialog's default state is that it works before a
    // query. A slug that drifted out of the manifest ships a 404 there.
    for (const locale of ["en", "es"] as const) {
      for (const [, url] of searchSuggestions(locale)) {
        const match = url.match(/\/(listkit|uploaderkit)\/docs\/(.+)$/);
        if (!match) continue;
        const [, pkg, slug] = match;
        const slugs = MANIFESTS[pkg as PackageId].pages
          .map((page) => page.slug)
          .filter((s) => s !== OVERVIEW_SLUG);
        expect(slugs).toContain(slug);
      }
    }
  });

  it("builds Spanish URLs under /es with the translated segment", () => {
    const urls = searchSuggestions("es").map(([, url]) => url);

    expect(urls.every((url) => url.startsWith("/es/"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/versiones"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/releases"))).toBe(false);
  });

  it("points the overview at /<pkg>, never at the docs tree", () => {
    // The overview is not an emitted docs page; a suggestion aimed at
    // /<pkg>/docs/overview would 404.
    const urls = searchSuggestions("en").map(([, url]) => url);

    expect(urls).toContain("/listkit");
    expect(urls.some((url) => url.includes(`/docs/${OVERVIEW_SLUG}`))).toBe(
      false,
    );
  });

  it("labels every suggestion with its package", () => {
    for (const [label] of searchSuggestions("en")) {
      expect(PACKAGE_IDS.some((pkg) => label.startsWith(pkg))).toBe(true);
    }
  });
});
