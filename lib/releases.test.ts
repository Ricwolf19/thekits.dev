import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ cacheLife: () => undefined }));

import { getReleases } from "./releases";

const release = (over: Record<string, unknown> = {}) => ({
  tag_name: "listkit-5.0.0",
  html_url: "https://github.com/Ricwolf19/listkit/releases/tag/listkit-5.0.0",
  published_at: "2026-09-13T20:45:31Z",
  body: "### Features\n\n* something",
  draft: false,
  prerelease: false,
  ...over,
});

const respondWith = (body: unknown, ok = true) =>
  vi.stubGlobal("fetch", async () => ({
    ok,
    status: ok ? 200 : 403,
    json: async () => body,
  }));

afterEach(() => vi.unstubAllGlobals());

describe("getReleases", () => {
  it("strips the release-please tag prefix to get the version", async () => {
    respondWith([release()]);
    const [first] = await getReleases("listkit");
    expect(first.version).toBe("5.0.0");
    expect(first.tag).toBe("listkit-5.0.0");
  });

  it("ignores tags belonging to another package in the same repo", async () => {
    respondWith([release(), release({ tag_name: "someotherthing-1.0.0" })]);
    expect(await getReleases("listkit")).toHaveLength(1);
  });

  it("drops drafts", async () => {
    respondWith([release({ draft: true })]);
    expect(await getReleases("listkit")).toEqual([]);
  });

  it("drops releases with no publish date, which would render an invalid time", async () => {
    respondWith([release({ published_at: null })]);
    expect(await getReleases("listkit")).toEqual([]);
  });

  it("keeps prereleases but flags them", async () => {
    respondWith([release({ prerelease: true })]);
    const [first] = await getReleases("listkit");
    expect(first.prerelease).toBe(true);
  });

  it("returns nothing rather than throwing when GitHub refuses", async () => {
    // A rate-limited revalidation must not take the route down: the release
    // feed is supplementary, the docs carry the value.
    respondWith({ message: "rate limited" }, false);
    expect(await getReleases("listkit")).toEqual([]);
  });

  it("normalizes a missing body to an empty string", async () => {
    respondWith([release({ body: null })]);
    const [first] = await getReleases("listkit");
    expect(first.body).toBe("");
  });
});
