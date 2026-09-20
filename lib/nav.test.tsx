import { describe, expect, it } from "vitest";

import { createT } from "./i18n/config";
import { navLinks, packageSections } from "./nav";
import { author, PACKAGE_IDS, ROUTE_READY } from "./site";

/** `on` decides where an item renders: "nav" = the top bar, "menu" = the
 * sidebar/mobile menu, absent = both. */
const on = (item: { on?: string }) => item.on;

describe("navLinks", () => {
  it("omits the package links when the layout has its own switcher", () => {
    // The regression: these rendered in the docs sidebar directly under
    // Fumadocs' own package combobox, listing both names a second time.
    const links = navLinks("en", { kind: "home" }, { packageLinks: false });
    expect(links.filter((l) => on(l) === "menu")).toHaveLength(0);
  });

  it("includes them for layouts with no switcher of their own", () => {
    const links = navLinks("en", { kind: "home" });
    expect(links.filter((l) => on(l) === "menu")).toHaveLength(
      PACKAGE_IDS.length,
    );
  });

  it("scopes every package dropdown to the top bar", () => {
    // An unscoped `menu` item is also rendered into the sidebar — that is what
    // produced the duplicate in the first place.
    const menus = navLinks("en", { kind: "home" }).filter(
      (l) => l.type === "menu",
    );
    expect(menus).toHaveLength(PACKAGE_IDS.length);
    for (const menu of menus) expect(on(menu)).toBe("nav");
  });

  it("gives each package the same four sections", () => {
    const menus = navLinks("en", { kind: "home" }).filter(
      (l) => l.type === "menu",
    );
    for (const menu of menus) {
      const urls = (menu as { items: { url: string }[] }).items.map(
        (i) => i.url,
      );
      expect(urls).toHaveLength(4);
      expect(urls.some((u) => u.includes("/docs/"))).toBe(true);
      expect(urls.some((u) => u.endsWith("/playground"))).toBe(true);
      expect(urls.some((u) => u.endsWith("/releases"))).toBe(true);
    }
  });

  it("builds Spanish URLs under /es, including the translated segment", () => {
    const menus = navLinks("es", { kind: "home" }).filter(
      (l) => l.type === "menu",
    );
    const urls = menus.flatMap((m) =>
      (m as { items: { url: string }[] }).items.map((i) => i.url),
    );
    expect(urls.every((u) => u.startsWith("/es/"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/versiones"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/releases"))).toBe(false);
  });

  it("points the icons at the author profiles, not at a repository", () => {
    // From the bar these mean "who makes this"; per-package repo links live on
    // the package pages.
    const icons = navLinks("en", { kind: "home" }).filter(
      (l) => l.type === "icon",
    ) as { url: string }[];
    expect(icons.map((i) => i.url).sort()).toEqual(
      [author.github, author.npm].sort(),
    );
    for (const icon of icons) {
      expect(icon.url).not.toMatch(/\/(listkit|uploaderkit|thekits\.dev)$/);
    }
  });
});

describe("packageSections", () => {
  const t = createT("en");

  it("offers only the routes ROUTE_READY says are built", () => {
    // The regression: the sidebar and the nav dropdown appended playground and
    // releases unconditionally while the sitemap still honoured the flag, so
    // the one switch AGENTS.md promises gates "the sitemap and the nav
    // together" only gated half of it.
    const kinds = packageSections("listkit", "en", t).map((s) => s.kind);
    const expected = (["playground", "releases"] as const).filter(
      (kind) => ROUTE_READY[kind],
    );

    expect(kinds).toEqual(expected);
  });

  it("gives each node an id unique to its package", () => {
    const ids = PACKAGE_IDS.flatMap((pkg) =>
      packageSections(pkg, "en", t).map((s) => s.id),
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("builds the Spanish releases URL as /versiones", () => {
    const releases = packageSections("listkit", "es", t).find(
      (s) => s.kind === "releases",
    );

    expect(releases?.url).toBe("/es/listkit/versiones");
  });
});
