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
    expect(demoScopes.names).toEqual([
      "demo-image",
      "demo-document",
      "demo-avatar",
      "demo-strict-pdf",
    ]);
    expect(demoScopes.has("demo-image")).toBe(true);
    expect(demoScopes.has("nope")).toBe(false);
  });

  it("gives every scope a key no other scope's key is a prefix of", () => {
    // uploaderkit rejects overlapping prefixes at import time; this pins the
    // same rule on full keys, since `demo-avatar` is a single-file key with no
    // filename and has no "folder" to compare.
    const file = {
      name: "f.png",
      size: 1,
      type: "image/png",
      arrayBuffer: async () => new ArrayBuffer(1),
    };
    const keys = demoScopes.names.map((name) =>
      demoScopes.get(name).path("entity", file),
    );
    expect(new Set(keys).size).toBe(keys.length);
    for (const a of keys) {
      for (const b of keys) {
        if (a !== b) expect(a.startsWith(`${b}/`)).toBe(false);
      }
    }
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
