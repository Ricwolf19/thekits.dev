import type { Locale } from "../i18n/config";
import type { ParsedReadme } from "./parse";

/**
 * Sections are claimed by English heading text, not index: an index-based
 * manifest keeps validating after an upstream insertion while silently shifting
 * every later page. Spanish resolves positionally from the same indices, which
 * is why parity is asserted first.
 * @see AGENTS.md#readme-docs-pipeline
 */
export type PageSpec = {
  /** URL slug, shared by both locales. */
  readonly slug: string;
  readonly title: Readonly<Record<Locale, string>>;
  readonly description: Readonly<Record<Locale, string>>;
  /** English heading texts owned by this page, in render order. */
  readonly headings: readonly string[];
};

/**
 * The page whose body the package's own route renders. It stays in the
 * manifest so its README heading is still claimed by the parity checks, but it
 * is not emitted as a docs page — otherwise the same Features section would
 * live at two URLs.
 */
export const OVERVIEW_SLUG = "overview";

export type PackageManifest = {
  readonly pages: readonly PageSpec[];
};

export type ResolvedPage = {
  readonly spec: PageSpec;
  /** Indices into `ParsedReadme.sections`, in render order. */
  readonly indices: readonly number[];
};

export class ManifestError extends Error {
  constructor(pkg: string, detail: string) {
    super(`[content:${pkg}] ${detail}`);
    this.name = "ManifestError";
  }
}

/** Throws rather than degrading: a silently incomplete docs tree is worse. */
export const resolveManifest = (
  pkg: string,
  manifest: PackageManifest,
  en: ParsedReadme,
): ResolvedPage[] => {
  const byHeading = new Map<string, number>();
  const duplicates: string[] = [];
  en.sections.forEach((section, index) => {
    const key = section.heading.text;
    if (byHeading.has(key)) duplicates.push(key);
    else byHeading.set(key, index);
  });

  if (duplicates.length > 0) {
    throw new ManifestError(
      pkg,
      `README has duplicate headings, so they cannot be claimed unambiguously: ${duplicates.join(", ")}`,
    );
  }

  const claimed = new Map<number, string>();
  const resolved: ResolvedPage[] = manifest.pages.map((spec) => {
    const indices = spec.headings.map((heading) => {
      const index = byHeading.get(heading);
      if (index === undefined) {
        throw new ManifestError(
          pkg,
          `page "${spec.slug}" claims heading "${heading}", which is not in the README. Was it renamed upstream?`,
        );
      }
      const owner = claimed.get(index);
      if (owner) {
        throw new ManifestError(
          pkg,
          `heading "${heading}" is claimed by both "${owner}" and "${spec.slug}".`,
        );
      }
      claimed.set(index, spec.slug);
      return index;
    });
    return { spec, indices };
  });

  const unclaimed = en.sections
    .map((section, index) => ({ section, index }))
    .filter(({ index }) => !claimed.has(index))
    .map(({ section }) => section.heading.text);

  if (unclaimed.length > 0) {
    throw new ManifestError(
      pkg,
      `${unclaimed.length} README heading(s) are not on any page: ${unclaimed.join(", ")}. Add them to the manifest or the docs will silently omit them.`,
    );
  }

  const slugs = new Set<string>();
  for (const { spec } of resolved) {
    if (slugs.has(spec.slug)) {
      throw new ManifestError(pkg, `duplicate page slug "${spec.slug}".`);
    }
    slugs.add(spec.slug);
  }

  return resolved;
};

/** Positional matching means shape must match before anything is assembled. */
export const assertParity = (
  pkg: string,
  en: ParsedReadme,
  es: ParsedReadme,
): void => {
  if (en.sections.length !== es.sections.length) {
    throw new ManifestError(
      pkg,
      `README.md has ${en.sections.length} sections but README.es.md has ${es.sections.length}. Spanish sections are matched positionally, so the two files must stay structurally identical.`,
    );
  }
  for (let i = 0; i < en.sections.length; i += 1) {
    const a = en.sections[i].heading;
    const b = es.sections[i].heading;
    if (a.level !== b.level) {
      throw new ManifestError(
        pkg,
        `heading depth diverges at section ${i}: EN "${a.text}" is h${a.level}, ES "${b.text}" is h${b.level}.`,
      );
    }
  }
};
