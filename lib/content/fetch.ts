import { cacheLife } from "next/cache";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { listkitManifest } from "@/content/listkit.map";
import { uploaderkitManifest } from "@/content/uploaderkit.map";

import type { Locale } from "../i18n/config";
import { PACKAGES, type PackageId, readmeRawUrl } from "../site";
import {
  assertParity,
  type PackageManifest,
  resolveManifest,
  type ResolvedPage,
} from "./manifest";
import { parseReadme, type ParsedReadme } from "./parse";

const MANIFESTS: Record<PackageId, PackageManifest> = {
  listkit: listkitManifest,
  uploaderkit: uploaderkitManifest,
};

export type PackageContent = {
  readonly id: PackageId;
  /** The published version the docs describe. */
  readonly version: string;
  /**
   * When that version was published. Used as the sitemap's `<lastmod>`: the
   * READMEs carry no dates, and "when the package last shipped" is the honest
   * answer for content generated from them. Build time would claim every page
   * changed on every deploy.
   */
  readonly publishedAt: string;
  readonly readme: Readonly<Record<Locale, ParsedReadme>>;
  readonly pages: readonly ResolvedPage[];
};

/**
 * Points the loader at checked-out sibling repos instead of the network.
 *
 * Needed for more than offline work: a README change is only fetchable once
 * release-please cuts a release, so documenting an unreleased section is
 * impossible without this. Set it to the directory holding the package repos
 * (e.g. `/Users/me/Dev`) and the loader reads `<root>/<pkg>/packages/<pkg>/…`.
 *
 * Redirects where the prose comes from and nothing else: the version is still
 * resolved from npm. Faking it broke every comparison against it.
 */
const LOCAL_ROOT = process.env.CONTENT_LOCAL_ROOT;

const fetchText = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `[content] GET ${url} → ${response.status} ${response.statusText}. Refusing to build a partial docs tree.`,
    );
  }
  return response.text();
};

/** The version npm serves as `latest`, and when it shipped. */
const fetchRelease = async (
  id: PackageId,
): Promise<{ version: string; publishedAt: string }> => {
  const url = `https://registry.npmjs.org/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`[content] GET ${url} → ${response.status}`);
  }
  const body = (await response.json()) as {
    "dist-tags"?: { latest?: string };
    time?: Record<string, string>;
  };
  const version = body["dist-tags"]?.latest;
  if (!version) {
    throw new Error(`[content] ${id} has no dist-tags.latest on npm.`);
  }
  return {
    version,
    publishedAt: body.time?.[version] ?? new Date().toISOString(),
  };
};

const readLocal = (id: PackageId, locale: Locale): Promise<string> =>
  readFile(path.join(LOCAL_ROOT!, id, PACKAGES[id].readme[locale]), "utf8");

/**
 * npm is asked only for the version. Its packument has a `readme` field, but it
 * truncates at 65,536 bytes — listkit's README is 88,687, so that copy stops
 * mid-sentence. GitHub raw at the release tag is complete and still pinned.
 */
export const getPackageContent = async (
  id: PackageId,
): Promise<PackageContent> => {
  "use cache";
  cacheLife("max");

  const info = PACKAGES[id];
  const release = await fetchRelease(id);
  const { version } = release;

  const [enRaw, esRaw] = await Promise.all(
    (["en", "es"] as const).map((locale) =>
      LOCAL_ROOT
        ? readLocal(id, locale)
        : fetchText(readmeRawUrl(info, version, locale)),
    ),
  );

  const en = parseReadme(enRaw);
  const es = parseReadme(esRaw);

  try {
    assertParity(id, en, es);
  } catch (error) {
    // Usually a stale *published* pair rather than a bad translation.
    if (LOCAL_ROOT) throw error;
    throw new Error(
      `${(error as Error).message}\n\n` +
        `This read ${id}@${version} from its release tag. If the fix is already ` +
        `committed but unreleased, either cut a release or set CONTENT_LOCAL_ROOT ` +
        `to the directory holding the package repos to build from disk.`,
      { cause: error },
    );
  }

  return {
    id,
    version,
    publishedAt: release.publishedAt,
    readme: { en, es },
    pages: resolveManifest(id, MANIFESTS[id], en),
  };
};

/** Every package's content, for the sitemap and the hub. */
export const getAllContent = async (): Promise<PackageContent[]> => {
  "use cache";
  cacheLife("max");
  return Promise.all(
    (Object.keys(PACKAGES) as PackageId[]).map(getPackageContent),
  );
};
