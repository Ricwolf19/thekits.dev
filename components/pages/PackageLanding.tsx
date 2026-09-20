import Link from "next/link";
import { notFound } from "next/navigation";

import { DocsIndexGrid } from "@/components/layout/DocsIndexGrid";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MarkdownBody } from "@/components/mdx/MarkdownBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPackageContent } from "@/lib/content/fetch";
import { createT, type Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { breadcrumbSchema, packageSchema } from "@/lib/schema";
import { isPackageId, PACKAGES, type PackageId } from "@/lib/site";

export const PackageLanding = async ({
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

  // The Features section, rendered as-is. It is the package's own pitch and
  // already maintained; rewriting it here would create a second copy to drift.
  const features = content.pages.find((p) => p.spec.slug === "overview");
  const featureBody = features ? readme.sections[features.indices[0]].body : "";

  return (
    <>
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

      <SiteHeader locale={locale} descriptor={{ kind: "package", pkg: id }} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24">
        <p className="text-fd-muted-foreground font-mono text-sm">
          v{content.version} · MIT
        </p>
        <h1 className="mt-3 font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
          {readme.title}
        </h1>
        <p className="mt-5 max-w-3xl text-xl font-medium text-balance">
          {readme.tagline}
        </p>
        <p className="text-fd-muted-foreground mt-3 max-w-3xl text-lg">
          {readme.summary}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={routePath(
              { kind: "docs", pkg: id, slug: ["getting-started"] },
              locale,
            )}
            className="bg-fd-foreground text-fd-background rounded-lg px-4 py-2 text-sm font-medium"
          >
            {t("common.getStarted")}
          </Link>
          <a
            href={info.repo}
            className="border-fd-border rounded-lg border px-4 py-2 text-sm font-medium"
          >
            {t("common.viewGithub")}
          </a>
          <a
            href={info.npm}
            className="border-fd-border rounded-lg border px-4 py-2 text-sm font-medium"
          >
            {t("common.viewNpm")}
          </a>
        </div>

        <pre className="bg-fd-muted mt-8 w-fit rounded-lg px-4 py-3 font-mono text-sm">
          npm install {info.npmName}
        </pre>

        <section className="prose-fd mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold">{readme.title}</h2>
          <MarkdownBody>{featureBody}</MarkdownBody>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">{t("nav.docs")}</h2>
          <DocsIndexGrid pkg={id} locale={locale} pages={content.pages} />
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
};
