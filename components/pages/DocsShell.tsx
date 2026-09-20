import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

import { LocaleToggle } from "@/components/shell/LocaleToggle";
import { getDocsSource } from "@/lib/content/source";
import { createT, type Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { PACKAGES, type PackageId, ROUTE_READY } from "@/lib/site";

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

  return (
    <DocsLayout
      tree={source.getPageTree(locale)}
      nav={{ title: pkg, url: routePath({ kind: "package", pkg }, locale) }}
      githubUrl={PACKAGES[pkg].repo}
      links={[
        ...(ROUTE_READY.playground
          ? [
              {
                text: t("nav.playground"),
                url: routePath({ kind: "playground", pkg }, locale),
              },
            ]
          : []),
        ...(ROUTE_READY.releases
          ? [
              {
                text: t("nav.releases"),
                url: routePath({ kind: "releases", pkg }, locale),
              },
            ]
          : []),
        {
          type: "custom",
          children: (
            <LocaleToggle descriptor={{ kind: "docs", pkg }} locale={locale} />
          ),
          secondary: true,
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
};
