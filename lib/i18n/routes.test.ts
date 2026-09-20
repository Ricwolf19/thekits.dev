import { describe, expect, it } from "vitest";

import { alternatePath, routePath } from "./routes";

describe("routePath", () => {
  it("keeps English unprefixed and prefixes Spanish", () => {
    expect(routePath({ kind: "home" }, "en")).toBe("/");
    expect(routePath({ kind: "home" }, "es")).toBe("/es");
    expect(routePath({ kind: "package", pkg: "listkit" }, "en")).toBe(
      "/listkit",
    );
    expect(routePath({ kind: "package", pkg: "listkit" }, "es")).toBe(
      "/es/listkit",
    );
  });

  it("shares doc slugs across locales", () => {
    const d = { kind: "docs", pkg: "listkit", slug: ["theming"] } as const;
    expect(routePath(d, "en")).toBe("/listkit/docs/theming");
    expect(routePath(d, "es")).toBe("/es/listkit/docs/theming");
  });

  it("translates only the segments that earn it", () => {
    expect(routePath({ kind: "releases", pkg: "listkit" }, "en")).toBe(
      "/listkit/releases",
    );
    expect(routePath({ kind: "releases", pkg: "listkit" }, "es")).toBe(
      "/es/listkit/versiones",
    );
    // `playground` stays as-is: it is the loanword Spanish dev writing uses.
    expect(routePath({ kind: "playground", pkg: "listkit" }, "es")).toBe(
      "/es/listkit/playground",
    );
  });

  it("gives the sibling locale for the same descriptor", () => {
    expect(alternatePath({ kind: "package", pkg: "uploaderkit" }, "en")).toBe(
      "/es/uploaderkit",
    );
  });
});

describe("alternatePath", () => {
  it("round-trips every descriptor between locales", () => {
    const descriptors = [
      { kind: "home" },
      { kind: "package", pkg: "listkit" },
      { kind: "docs", pkg: "uploaderkit", slug: ["server"] },
      { kind: "playground", pkg: "listkit" },
      { kind: "releases", pkg: "listkit" },
    ] as const;
    for (const d of descriptors) {
      expect(alternatePath(d, "en")).toBe(routePath(d, "es"));
      expect(alternatePath(d, "es")).toBe(routePath(d, "en"));
    }
  });

  it("crosses a translated segment correctly", () => {
    // The case a pathname-prefix swap gets wrong: it would produce
    // /es/listkit/releases, which does not exist.
    expect(alternatePath({ kind: "releases", pkg: "listkit" }, "en")).toBe(
      "/es/listkit/versiones",
    );
    expect(alternatePath({ kind: "releases", pkg: "listkit" }, "es")).toBe(
      "/listkit/releases",
    );
  });
});
