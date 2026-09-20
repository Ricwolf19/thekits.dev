import { notFound } from "next/navigation";

import { MarkdownBody } from "@/components/mdx/MarkdownBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getPackageContent } from "@/lib/content/fetch";
import { createT, type Locale } from "@/lib/i18n/config";
import { INTL_LOCALE } from "@/lib/i18n/localeCodes";
import { routePath } from "@/lib/i18n/routes";
import { getReleases } from "@/lib/releases";
import { breadcrumbSchema } from "@/lib/schema";
import { isPackageId, PACKAGES, type PackageId } from "@/lib/site";

export const ReleasesPage = async ({
  pkg,
  locale,
}: {
  pkg: string;
  locale: Locale;
}) => {
  if (!isPackageId(pkg)) notFound();
  const id: PackageId = pkg;

  const [releases, content] = await Promise.all([
    getReleases(id),
    getPackageContent(id),
  ]);
  const t = createT(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "thekits.dev", path: routePath({ kind: "home" }, locale) },
          { name: id, path: routePath({ kind: "package", pkg: id }, locale) },
          {
            name: t("releases.title"),
            path: routePath({ kind: "releases", pkg: id }, locale),
          },
        ])}
      />

      <SiteHeader
        locale={locale}
        descriptor={{ kind: "releases", pkg: id }}
        up={{ kind: "package", pkg: id }}
        label={id}
        width="max-w-3xl"
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-24">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("releases.title")}
        </h1>
        <p className="text-fd-muted-foreground mt-3">
          {t("releases.subtitle")}
        </p>

        {releases.length === 0 ? (
          <p className="text-fd-muted-foreground mt-12">
            <a
              className="underline underline-offset-2"
              href={`${PACKAGES[id].repo}/releases`}
            >
              {t("common.viewGithub")}
            </a>
          </p>
        ) : (
          <ol className="mt-12 space-y-12">
            {releases.map((release) => (
              <li key={release.tag} id={release.version}>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h2 className="font-mono text-xl font-semibold">
                    {release.version}
                  </h2>
                  {release.version === content.version ? (
                    <span className="bg-fd-primary/10 text-fd-primary rounded px-2 py-0.5 text-xs font-medium">
                      latest
                    </span>
                  ) : null}
                  <time
                    className="text-fd-muted-foreground text-sm"
                    dateTime={release.publishedAt}
                  >
                    {t("releases.published", {
                      date: new Intl.DateTimeFormat(INTL_LOCALE[locale], {
                        dateStyle: "long",
                      }).format(new Date(release.publishedAt)),
                    })}
                  </time>
                </div>
                {release.body ? (
                  <div className="prose-fd mt-4 text-sm">
                    <MarkdownBody>{release.body}</MarkdownBody>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </main>
    </>
  );
};
