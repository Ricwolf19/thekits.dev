import { describe, expect, it } from "vitest";

import {
  assertParity,
  resolveManifest,
  type PackageManifest,
} from "./manifest";
import type { ParsedReadme, Section } from "./parse";

const section = (level: number, text: string): Section => ({
  heading: {
    level,
    text,
    slug: text.toLowerCase().replace(/\s+/g, "-"),
    line: 1,
  },
  body: `body of ${text}`,
});

const readme = (...sections: Section[]): ParsedReadme => ({
  title: "demokit",
  tagline: "A kit.",
  summary: "",
  sections,
});

const en = readme(
  section(2, "Features"),
  section(2, "Quick Start"),
  section(3, "Deeper"),
);

const page = (slug: string, headings: string[]) => ({
  slug,
  title: { en: slug, es: slug },
  description: { en: "", es: "" },
  headings,
});

describe("resolveManifest", () => {
  it("resolves heading names to section indices in render order", () => {
    const manifest: PackageManifest = {
      pages: [page("a", ["Features"]), page("b", ["Quick Start", "Deeper"])],
    };
    const resolved = resolveManifest("demokit", manifest, en);
    expect(resolved.map((p) => p.indices)).toEqual([[0], [1, 2]]);
  });

  it("fails when a README heading is on no page", () => {
    // The drift that matters: a section added upstream would otherwise vanish.
    expect(() =>
      resolveManifest("demokit", { pages: [page("a", ["Features"])] }, en),
    ).toThrow(/not on any page: Quick Start, Deeper/);
  });

  it("fails when a page claims a heading that no longer exists", () => {
    expect(() =>
      resolveManifest("demokit", { pages: [page("a", ["Renamed"])] }, en),
    ).toThrow(/claims heading "Renamed", which is not in the README/);
  });

  it("fails when two pages claim the same heading", () => {
    const manifest: PackageManifest = {
      pages: [
        page("a", ["Features", "Quick Start"]),
        page("b", ["Features", "Deeper"]),
      ],
    };
    expect(() => resolveManifest("demokit", manifest, en)).toThrow(
      /claimed by both "a" and "b"/,
    );
  });

  it("fails on duplicate page slugs", () => {
    const manifest: PackageManifest = {
      pages: [
        page("same", ["Features"]),
        page("same", ["Quick Start", "Deeper"]),
      ],
    };
    expect(() => resolveManifest("demokit", manifest, en)).toThrow(
      /duplicate page slug "same"/,
    );
  });

  it("fails when the README itself has ambiguous duplicate headings", () => {
    const dupes = readme(section(2, "Setup"), section(3, "Setup"));
    expect(() =>
      resolveManifest("demokit", { pages: [page("a", ["Setup"])] }, dupes),
    ).toThrow(/duplicate headings/);
  });
});

describe("assertParity", () => {
  it("accepts translations that keep the same shape", () => {
    const es = readme(
      section(2, "Características"),
      section(2, "Inicio rápido"),
      section(3, "Más a fondo"),
    );
    expect(() => assertParity("demokit", en, es)).not.toThrow();
  });

  it("fails when a translation is missing a section", () => {
    const es = readme(
      section(2, "Características"),
      section(2, "Inicio rápido"),
    );
    expect(() => assertParity("demokit", en, es)).toThrow(
      /has 3 sections but README\.es\.md has 2/,
    );
  });

  it("fails when heading depth diverges, which would shift every later page", () => {
    const es = readme(
      section(2, "Características"),
      section(3, "Inicio rápido"),
      section(3, "Más a fondo"),
    );
    expect(() => assertParity("demokit", en, es)).toThrow(
      /heading depth diverges at section 1/,
    );
  });
});
