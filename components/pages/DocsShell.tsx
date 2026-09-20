import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { Github, Play } from "lucide-react";
import type { ReactNode } from "react";

import { PackageIcon } from "@/components/ui/PackageIcon";
import { getDocsSource } from "@/lib/content/source";
import { createT, type Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { navLinks, navTitle, packageSections } from "@/lib/nav";
import { PACKAGE_IDS, type PackageId } from "@/lib/site";

const SECTION_ICON: Record<string, ReactNode> = {
  playground: <Play className="size-4" />,
  releases: <Github className="size-4" />,
};

/**
 * The single shell every package page renders inside — overview, docs,
 * playground and releases alike. One chrome, one persistent sidebar, so a
 * reader never loses the navigation by moving between sections.
 *
 * The **notebook** layout, not `docs`: `docs` collapses the nav into the
 * sidebar, which left the site nav, search and theme toggle stranded at the
 * bottom of a scrolling column and different from the hub's bar. `nav.mode:
 * "top"` keeps one persistent bar across the top on every page.
 *
 * The package switcher is the sidebar `tabs` and nothing else: both packages
 * are always listed, and picking one swaps the sidebar to that package's pages
 * without hiding the other.
 */
export const DocsShell = async ({
  pkg,
  locale,
  children,
}: {
  pkg: PackageId;
  locale: Locale;
  children: ReactNode;
}) => {
  const source = await getDocsSource(pkg);
  const t = createT(locale);
  const tree = source.getPageTree(locale);

  // Playground and Releases are real routes, not generated pages, so they are
  // appended to the tree rather than emitted by the loader. Keeping them in the
  // sidebar is the point: they are sections of the package, not a detour.
  const sections = packageSections(pkg, locale, t);
  const withSections = {
    ...tree,
    children: [
      ...tree.children,
      ...(sections.length
        ? [{ type: "separator" as const, $id: `${pkg}-sections` }]
        : []),
      ...sections.map((section) => ({
        type: "page" as const,
        $id: section.id,
        name: section.name,
        url: section.url,
        icon: SECTION_ICON[section.kind],
      })),
    ],
  };

  return (
    <DocsLayout
      tree={withSections}
      nav={{
        title: navTitle,
        url: routePath({ kind: "home" }, locale),
        mode: "top",
      }}
      tabMode="sidebar"
      links={navLinks(
        locale,
        { kind: "package", pkg },
        { packageLinks: false },
      )}
      sidebar={{
        // No `description`: it repeated the title verbatim, which on a phone
        // meant the switcher read "listkit / listkit" twice over.
        tabs: PACKAGE_IDS.map((id) => ({
          title: id,
          url: routePath({ kind: "package", pkg: id }, locale),
          icon: <PackageIcon id={id} />,
        })),
      }}
      themeSwitch={{ mode: "light-dark" }}
    >
      {children}
    </DocsLayout>
  );
};
