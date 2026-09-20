/**
 * Single source of truth for every external URL and for the package registry.
 * Never inline a GitHub, npm or author URL anywhere else — adding a third kit
 * should mean adding one entry here, not grepping for strings.
 *
 * Deliberately free of *content*: taglines and descriptions come from the
 * READMEs through the content pipeline, so they cannot drift from what npm and
 * GitHub show.
 */
import type { Locale } from "./i18n/config";

/** Owner of every repo referenced here. Exported so nothing hardcodes it. */
export const GITHUB_OWNER = "Ricwolf19";
const GITHUB_USER = GITHUB_OWNER;

export const author = {
  name: "Ricardo Tapia",
  url: "https://ricardotapia.dev",
  github: `https://github.com/${GITHUB_USER}`,
} as const;

export const site = {
  name: "thekits.dev",
  repo: `https://github.com/${GITHUB_USER}/thekits.dev`,
  /** Public OG card for pages that do not own an `opengraph-image.tsx`. */
  ogImage: "/opengraph-image",
} as const;

export type PackageId = "listkit" | "uploaderkit";

export type PackageInfo = {
  readonly id: PackageId;
  /** npm package name. Unscoped, and identical to the id and the repo name. */
  readonly npmName: string;
  readonly repo: string;
  readonly npm: string;
  /** Path to the README inside the repo, per locale. */
  readonly readme: Readonly<Record<Locale, string>>;
  /**
   * release-please tags as `<prefix><version>`, which is what lets the content
   * pipeline turn an npm version into a GitHub raw URL deterministically.
   */
  readonly tagPrefix: string;
  /** Subpaths worth advertising on the landing page. */
  readonly subpaths: readonly string[];
};

const pkg = (id: PackageId, subpaths: readonly string[]): PackageInfo => ({
  id,
  npmName: id,
  repo: `https://github.com/${GITHUB_USER}/${id}`,
  npm: `https://www.npmjs.com/package/${id}`,
  readme: {
    en: `packages/${id}/README.md`,
    es: `packages/${id}/README.es.md`,
  },
  tagPrefix: `${id}-`,
  subpaths,
});

export const PACKAGES: Readonly<Record<PackageId, PackageInfo>> = {
  listkit: pkg("listkit", [
    "listkit/next",
    "listkit/react-query",
    "listkit/react-router",
    "listkit/adapters",
    "listkit/server",
    "listkit/query",
    "listkit/sql",
    "listkit/mongo",
    "listkit/mongoose",
  ]),
  uploaderkit: pkg("uploaderkit", [
    "uploaderkit/react",
    "uploaderkit/ui",
    "uploaderkit/presets",
    "uploaderkit/server",
    "uploaderkit/server/express",
    "uploaderkit/server/next",
    "uploaderkit/adapters/s3",
    "uploaderkit/adapters/gcs",
    "uploaderkit/adapters/memory",
  ]),
};

export const PACKAGE_IDS = Object.keys(PACKAGES) as PackageId[];

export const isPackageId = (value: unknown): value is PackageId =>
  typeof value === "string" && value in PACKAGES;

/** GitHub raw URL for a README at the tag matching a published version. */
export const readmeRawUrl = (
  info: PackageInfo,
  version: string,
  locale: Locale,
): string =>
  `https://raw.githubusercontent.com/${GITHUB_USER}/${info.id}/${info.tagPrefix}${version}/${info.readme[locale]}`;

/** GitHub "edit this page" target — the default branch, not the pinned tag. */
export const readmeEditUrl = (info: PackageInfo, locale: Locale): string =>
  `${info.repo}/edit/main/${info.readme[locale]}`;

export const releasesApiUrl = (info: PackageInfo): string =>
  `https://api.github.com/repos/${GITHUB_USER}/${info.id}/releases`;

/**
 * Routes that exist as descriptors but not yet as pages.
 *
 * One flag consulted by both the sitemap and the navigation, rather than a
 * comment in each: a sitemap that lists a 404 spends crawl budget to teach
 * Google the page is broken, and a nav link to one is simply wrong. Flip a
 * value here when its route lands and both fix themselves.
 */
export const ROUTE_READY = {
  playground: true,
  releases: true,
} as const;
