import { cacheLife } from "next/cache";

import { PACKAGES, type PackageId, releasesApiUrl } from "./site";

export type Release = {
  readonly version: string;
  readonly tag: string;
  readonly publishedAt: string;
  readonly url: string;
  /** Release notes, markdown, as release-please wrote them. */
  readonly body: string;
  readonly prerelease: boolean;
};

type GitHubRelease = {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
};

/**
 * Newest first. Unauthenticated GitHub API (60 req/hour per IP), hence cached;
 * `"hours"` not `"max"` because releases appear without a redeploy.
 *
 * Returns `[]` rather than throwing: a rate-limited revalidation should not take
 * the route down over a supplementary feed.
 */
export const getReleases = async (pkg: PackageId): Promise<Release[]> => {
  "use cache";
  cacheLife("hours");

  const response = await fetch(
    `${releasesApiUrl(PACKAGES[pkg])}?per_page=100`,
    {
      headers: { accept: "application/vnd.github+json" },
    },
  );
  if (!response.ok) return [];

  const releases = (await response.json()) as GitHubRelease[];
  const prefix = PACKAGES[pkg].tagPrefix;

  return releases
    .filter((release) => !release.draft && release.tag_name.startsWith(prefix))
    .map((release) => ({
      version: release.tag_name.slice(prefix.length),
      tag: release.tag_name,
      publishedAt: release.published_at ?? "",
      url: release.html_url,
      body: (release.body ?? "").trim(),
      prerelease: release.prerelease,
    }))
    .filter((release) => release.publishedAt !== "");
};
