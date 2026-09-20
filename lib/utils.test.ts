import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `siteUrl` is computed once at module load from the environment, so each case
 * re-imports the module with a different value. These guard two defects that
 * are invisible in a build and only an assertion catches: a canonical pointing
 * at a host that redirects, and a URL with a doubled slash.
 */
const withEnv = async (value: string | undefined) => {
  vi.resetModules();
  if (value === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = value;
  return import("./utils");
};

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  vi.resetModules();
});

describe("siteUrl", () => {
  const cases: [string, string, string][] = [
    ["strips a trailing slash", "https://thekits.dev/", "https://thekits.dev"],
    ["coerces a protocol-less value", "thekits.dev", "https://thekits.dev"],
    [
      "trims surrounding whitespace",
      "  https://thekits.dev  ",
      "https://thekits.dev",
    ],
    [
      "leaves a valid value alone",
      "http://localhost:3000",
      "http://localhost:3000",
    ],
  ];

  it.each(cases)("%s", async (_name, input, expected) => {
    const { siteUrl } = await withEnv(input);
    expect(siteUrl).toBe(expected);
  });

  it("never throws when handed to new URL()", async () => {
    // `metadataBase: new URL(siteUrl)` runs at build; a bad env value there
    // fails the whole build rather than one page.
    const { siteUrl } = await withEnv("www.thekits.dev");
    expect(() => new URL(siteUrl)).not.toThrow();
  });

  it("has no trailing slash and no www on the canonical host", async () => {
    const { siteUrl } = await withEnv(undefined);
    expect(siteUrl.endsWith("/")).toBe(false);
    expect(new URL(siteUrl).host.startsWith("www.")).toBe(false);
  });
});

describe("absoluteUrl", () => {
  it("joins with exactly one slash, given or not", async () => {
    const { absoluteUrl } = await withEnv("https://thekits.dev");
    expect(absoluteUrl("/listkit")).toBe("https://thekits.dev/listkit");
    expect(absoluteUrl("listkit")).toBe("https://thekits.dev/listkit");
  });

  it("returns the bare origin for an empty path", async () => {
    const { absoluteUrl } = await withEnv("https://thekits.dev");
    expect(absoluteUrl("")).toBe("https://thekits.dev/");
  });
});
