import { describe, expect, it } from "vitest";

import { clamp, parseReadme, rewriteLinks, scanHeadings } from "./parse";

/** Mirrors the real README shape: centered hero, badges, TOC, then content. */
const fixture = [
  '<div align="center">',
  "",
  "# demokit",
  "",
  "**A tagline for the kit.**  ",
  "More detail on the second line.",
  "",
  "[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)",
  "",
  "🌐 **English** | [🇲🇽 Español](./README.es.md)",
  "",
  "</div>",
  "",
  "---",
  "",
  "## Table of Contents",
  "",
  "- [Features](#features)",
  "",
  "## Features",
  "",
  "It does things.",
  "",
  "---",
  "",
  "## Usage",
  "",
  "```bash",
  "# peers — this is a comment, not a heading",
  "npm i demokit",
  "```",
  "",
  "### Deeper",
  "",
  "See [features](#features).",
].join("\n");

describe("scanHeadings", () => {
  it("ignores `#` lines inside fenced code blocks", () => {
    const texts = scanHeadings(fixture).map((h) => h.text);
    expect(texts).not.toContain("peers — this is a comment, not a heading");
    expect(texts).toEqual([
      "demokit",
      "Table of Contents",
      "Features",
      "Usage",
      "Deeper",
    ]);
  });

  it("produces GitHub-compatible slugs", () => {
    const slugs = scanHeadings(
      "## Scopes — the contract\n## `useUploader`",
    ).map((h) => h.slug);
    expect(slugs).toEqual(["scopes--the-contract", "useuploader"]);
  });
});

describe("parseReadme", () => {
  const parsed = parseReadme(fixture);

  it("takes the title and tagline from the hero", () => {
    expect(parsed.title).toBe("demokit");
    expect(parsed.tagline).toBe("A tagline for the kit.");
    expect(parsed.summary).toBe("More detail on the second line.");
  });

  it("drops the hero and the table of contents", () => {
    const headings = parsed.sections.map((s) => s.heading.text);
    expect(headings).toEqual(["Features", "Usage", "Deeper"]);
  });

  it("keeps fenced content inside its section and strips the trailing rule", () => {
    const features = parsed.sections.find((s) => s.heading.text === "Features");
    expect(features?.body).toBe("It does things.");
    const usage = parsed.sections.find((s) => s.heading.text === "Usage");
    expect(usage?.body).toContain("npm i demokit");
  });

  it("throws rather than emitting an empty tree when structure is missing", () => {
    expect(() => parseReadme("no headings here")).toThrow(/no H1/);
    expect(() => parseReadme("# only a title")).toThrow(/no `##` section/);
  });
});

describe("rewriteLinks", () => {
  it("rewrites cross-page anchors and relative files, leaving same-page ones", () => {
    const out = rewriteLinks(
      "See [a](#other-page) and [b](#same) and [L](./LICENSE).",
      (anchor) => (anchor === "other-page" ? "/listkit/docs/other" : null),
      (path) =>
        path === "./LICENSE" ? "https://github.com/x/y/LICENSE" : null,
    );
    expect(out).toBe(
      "See [a](/listkit/docs/other) and [b](#same) and [L](https://github.com/x/y/LICENSE).",
    );
  });
});

describe("clamp", () => {
  it("cuts on a word boundary when one is close enough to the limit", () => {
    // Last space at 13 of 14 — well past the 60% threshold, so it wins.
    expect(clamp("one two three four", 14)).toBe("one two three…");
  });

  it("cuts hard when the nearest word boundary would throw away too much", () => {
    // Last space at 7 of 12 is below 60%, so a hard cut keeps more meaning.
    expect(clamp("one two three four", 12)).toBe("one two thre…");
  });

  it("leaves short text alone", () => {
    expect(clamp("short", 160)).toBe("short");
  });
});
