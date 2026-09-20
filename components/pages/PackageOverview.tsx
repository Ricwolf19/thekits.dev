import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { ArrowRight, Github, Play } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FeatureGrid } from "@/components/layout/FeatureGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { InstallCommand } from "@/components/ui/InstallCommand";
import { NpmIcon } from "@/components/ui/NpmIcon";
import { parseFeatures } from "@/lib/content/features";
import { OVERVIEW_SLUG } from "@/lib/content/manifest";
import { getPackageContent } from "@/lib/content/fetch";
import { createT, type Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { breadcrumbSchema, packageSchema } from "@/lib/schema";
import { isPackageId, PACKAGES, type PackageId } from "@/lib/site";

/**
 * The package's front page, rendered inside the docs shell rather than as a
 * standalone landing. It carries what a landing carries — tagline, install,
 * features — and nothing the sidebar already provides, so the docs index grid
 * that used to repeat the sidebar is gone.
 */
export const PackageOverview = async ({
  pkg,
  locale,
}: {
  pkg: string;
  locale: Locale;
}) => {
  if (!isPackageId(pkg)) notFound();
  const id: PackageId = pkg;

  const content = await getPackageContent(id);
  const readme = content.readme[locale];
  const info = PACKAGES[id];
  const t = createT(locale);

  const overview = content.pages.find((p) => p.spec.slug === OVERVIEW_SLUG);
  const overviewSection = overview
    ? readme.sections[overview.indices[0]]
    : undefined;
  const features = overviewSection ? parseFeatures(overviewSection.body) : [];

  const secondary =
    "border-fd-border hover:border-fd-primary btn-lift inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium";

  const toc = [
    { title: t("landing.installTitle"), url: "#install", depth: 2 },
    { title: t("landing.featuresTitle"), url: "#features", depth: 2 },
    { title: t("landing.subpathsTitle"), url: "#entry-points", depth: 2 },
  ];

  return (
    <DocsPage toc={toc}>
      <JsonLd
        data={[
          packageSchema(id, locale, {
            name: readme.title,
            description: readme.tagline,
            version: content.version,
          }),
          breadcrumbSchema([
            { name: "thekits.dev", path: routePath({ kind: "home" }, locale) },
            { name: id, path: routePath({ kind: "package", pkg: id }, locale) },
          ]),
        ]}
      />

      <p className="text-fd-primary font-display text-sm font-medium">
        v{content.version} · {t("common.license")} · {t("common.typescript")}
      </p>
      <DocsTitle>{readme.title}</DocsTitle>
      <DocsDescription className="mb-0 text-lg">
        {readme.tagline}
      </DocsDescription>

      <DocsBody>
        <p className="text-fd-muted-foreground lead">{readme.summary}</p>

        <div className="not-prose flex flex-wrap items-center gap-3">
          <Link
            href={routePath(
              { kind: "docs", pkg: id, slug: ["getting-started"] },
              locale,
            )}
            className="bg-fd-primary text-fd-primary-foreground btn-lift hover:shadow-fd-primary/25 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium hover:shadow-lg"
          >
            {t("common.getStarted")} <ArrowRight className="size-4" />
          </Link>
          <Link
            href={routePath({ kind: "playground", pkg: id }, locale)}
            className={secondary}
          >
            <Play className="size-4" /> {t("nav.playground")}
          </Link>
          <a href={info.repo} className={secondary}>
            <Github className="size-4" /> GitHub
          </a>
          <a href={info.npm} className={secondary}>
            <NpmIcon className="size-4" /> npm
          </a>
        </div>

        <h2 id="install">{t("landing.installTitle")}</h2>
        <div className="not-prose max-w-xl">
          <InstallCommand locale={locale} pkg={info.npmName} />
        </div>

        <h2 id="features">{t("landing.featuresTitle")}</h2>
        <p className="text-fd-muted-foreground">
          {t("landing.featuresSubtitle")}
        </p>
        <div className="not-prose">
          <FeatureGrid features={features} />
        </div>

        <h2 id="entry-points">{t("landing.subpathsTitle")}</h2>
        <p className="text-fd-muted-foreground">
          {t("landing.subpathsSubtitle")}
        </p>
        <ul className="not-prose flex flex-wrap gap-2">
          {[info.npmName, ...info.subpaths].map((sub) => (
            <li
              key={sub}
              className="bg-fd-muted rounded-md px-2.5 py-1.5 font-mono text-xs"
            >
              {sub}
            </li>
          ))}
        </ul>
      </DocsBody>
    </DocsPage>
  );
};
