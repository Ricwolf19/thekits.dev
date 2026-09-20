import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ cacheLife: () => undefined }));

import { caseSource } from "./caseSource";

describe("caseSource", () => {
  it("returns the case's real file without the client directive", async () => {
    const source = await caseSource("listkit/HelloCase.tsx");

    expect(source.startsWith('"use client"')).toBe(false);
    expect(source).toContain("export const HelloCase");
  });

  it("trims the trailing newline so the fence closes tight", async () => {
    const source = await caseSource("listkit/HelloCase.tsx");

    expect(source).toBe(source.trimEnd());
  });

  it("refuses a path that climbs out of the cases directory", async () => {
    await expect(caseSource("../../package.json")).rejects.toThrow(
      /Refusing to read outside/,
    );
  });

  // `path.join` normalises `..`, so the traversal above is caught by any
  // guard — this is the one a bare `startsWith` lets through.
  it("refuses a sibling directory that shares the prefix", async () => {
    await expect(caseSource("../playgroundX/Case.tsx")).rejects.toThrow(
      /Refusing to read outside/,
    );
  });
});
