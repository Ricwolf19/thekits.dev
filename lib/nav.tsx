import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { BookOpen, Github, LayoutGrid, Play } from "lucide-react";

import { LocaleToggle } from "@/components/shell/LocaleToggle";
import { NpmIcon } from "@/components/ui/NpmIcon";
import { PackageIcon } from "@/components/ui/PackageIcon";
import { createT, type Locale, type TFunction } from "@/lib/i18n/config";
import { routePath, type RouteDescriptor } from "@/lib/i18n/routes";
import {
  author,
  PACKAGE_IDS,
  type PackageId,
  ROUTE_READY,
  site,
} from "@/lib/site";

/** Icons for the two sections that are routes rather than generated pages. */
const SECTION_ICON = { playground: Play, releases: Github } as const;

export type PackageSection = {
  kind: keyof typeof SECTION_ICON;
  /** Stable id for a page-tree node. */
  id: string;
  name: string;
  url: string;
};

/**
 * Playground and Releases: sections of a package that are real routes, not
 * pages emitted by the docs loader. `ROUTE_READY` gates them here exactly as it
 * gates the sitemap — one unbuilt route must not be linked from either.
 * @see AGENTS.md#invariants
 */
export const packageSections = (
  pkg: PackageId,
  locale: Locale,
  t: TFunction,
): PackageSection[] =>
  (["playground", "releases"] as const)
    .filter((kind) => ROUTE_READY[kind])
    .map((kind) => ({
      kind,
      id: `${pkg}-${kind}`,
      name: t(`nav.${kind}`),
      url: routePath({ kind, pkg }, locale),
    }));

/**
 * One navigation definition for the whole site, shared by the marketing layout
 * and the package shell so the bar never changes shape between sections.
 *
 * Each package is a hover-to-open `menu` scoped to `on: "nav"`, so it never
 * renders into the sidebar/menu area. `packageLinks` adds plain `on: "menu"`
 * links for layouts that have no sidebar switcher of their own — the shell
 * passes `false`, because there the sidebar `tabs` already switch packages and
 * a second copy listed both names again right underneath it.
 *
 * The GitHub and npm icons point at the author's profiles — from the bar they
 * are "who makes this"; per-package repository links live on the package pages.
 */
export const navLinks = (
  locale: Locale,
  descriptor: RouteDescriptor,
  { packageLinks = true }: { packageLinks?: boolean } = {},
): LinkItemType[] => {
  const t = createT(locale);

  const dropdowns = PACKAGE_IDS.map((pkg): LinkItemType => ({
    type: "menu",
    on: "nav",
    text: pkg,
    icon: <PackageIcon id={pkg} />,
    url: routePath({ kind: "package", pkg }, locale),
    items: [
      {
        icon: <LayoutGrid />,
        text: t("nav.overview"),
        description: t("nav.overviewHint"),
        url: routePath({ kind: "package", pkg }, locale),
      },
      {
        icon: <BookOpen />,
        text: t("nav.docs"),
        description: t("nav.docsHint"),
        url: routePath(
          { kind: "docs", pkg, slug: ["getting-started"] },
          locale,
        ),
      },
      ...packageSections(pkg, locale, t).map((section) => {
        const Glyph = SECTION_ICON[section.kind];
        return {
          icon: <Glyph />,
          text: section.name,
          description: t(`nav.${section.kind}Hint`),
          url: section.url,
        };
      }),
    ],
  }));

  const mobileLinks = PACKAGE_IDS.map((pkg): LinkItemType => ({
    on: "menu",
    icon: <PackageIcon id={pkg} />,
    text: pkg,
    url: routePath({ kind: "package", pkg }, locale),
  }));

  return [
    ...dropdowns,
    ...(packageLinks ? mobileLinks : []),
    {
      type: "icon",
      label: t("common.viewNpm"),
      icon: <NpmIcon />,
      text: "npm",
      url: author.npm,
      secondary: true,
    },
    {
      type: "icon",
      label: t("common.viewGithub"),
      icon: <Github />,
      text: "GitHub",
      url: author.github,
      secondary: true,
    },
    {
      type: "custom",
      secondary: true,
      children: <LocaleToggle descriptor={descriptor} locale={locale} />,
    },
  ];
};

/** Nav identity, shared so the wordmark is defined once. */
export const navTitle = (
  <span className="font-display text-sm font-semibold tracking-tight">
    {site.name}
  </span>
);
