import { describe, expect, it } from "vitest";

import { demoScopes } from "./scopes";

const MAX = 2 * 1024 * 1024;

/**
 * uploaderkit validates scope definitions at import time, so importing this
 * module is itself the assertion. It already caught a real defect: both demo
 * scopes once wrote under `demo/<id>`, which meant replacing the image would
 * have swept the documents with it.
 */
describe("demo scopes", () => {
  it("imports without throwing and registers both scopes", () => {
    expect(demoScopes.names).toEqual(["demo-image", "demo-document"]);
    expect(demoScopes.has("demo-image")).toBe(true);
    expect(demoScopes.has("nope")).toBe(false);
  });

  it("gives each scope its own folder so a replace cannot cross scopes", () => {
    const file = {
      name: "f.png",
      size: 1,
      type: "image/png",
      arrayBuffer: async () => new ArrayBuffer(1),
    };
    const dirs = demoScopes.names.map((name) =>
      demoScopes
        .get(name)
        .path("entity", file)
        .replace(/[^/]+$/, ""),
    );
    expect(dirs).toEqual(["demo/entity/images/", "demo/entity/docs/"]);
    // Neither prefix may contain the other, which is what uploaderkit rejects.
    expect(dirs[0].startsWith(dirs[1])).toBe(false);
    expect(dirs[1].startsWith(dirs[0])).toBe(false);
  });

  it("caps size on every scope, since the demo endpoint is unauthenticated", () => {
    for (const name of demoScopes.names) {
      const scope = demoScopes.get(name);
      expect(scope.maxBytes).toBeGreaterThan(0);
      expect(scope.maxBytes).toBeLessThanOrEqual(MAX);
    }
  });

  it("restricts uploads to an explicit extension list", () => {
    // An open `accept` on a public endpoint is the whole risk here.
    for (const name of demoScopes.names) {
      expect(demoScopes.get(name).accept?.length).toBeGreaterThan(0);
    }
  });
});
