import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { MarkdownBody } from "@/components/mdx/MarkdownBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPackageContent } from "@/lib/content/fetch";
import { createT, type Locale } from "@/lib/i18n/config";
import { INTL_LOCALE } from "@/lib/i18n/localeCodes";
import { routePath } from "@/lib/i18n/routes";
import { getReleases } from "@/lib/releases";
import { breadcrumbSchema } from "@/lib/schema";
import { isPackageId, PACKAGES, type PackageId } from "@/lib/site";

/**
 * Changelog layout in the shape of daypicker.dev: a version index that stays
 * put while the notes scroll, one anchored heading per version with its date
 * and a "latest" mark, and the notes as release-please wrote them (already
 * grouped under Features / Bug Fixes headings).
 */
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
  const date = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    dateStyle: "long",
  });

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
      <DocsPage
        toc={releases.map((r) => ({
          title: `v${r.version}`,
          url: `#${r.version}`,
          depth: 2,
        }))}
      >
        <p className="text-fd-primary font-display text-sm font-medium">{id}</p>
        <DocsTitle>{t("releases.title")}</DocsTitle>
        <DocsDescription>{t("releases.subtitle")}</DocsDescription>

        <DocsBody>
          {releases.length === 0 ? (
            <a
              className="text-fd-primary inline-flex items-center gap-1.5"
              href={`${PACKAGES[id].repo}/releases`}
            >
              {t("common.viewGithub")} <ExternalLink className="size-3.5" />
            </a>
          ) : (
            <div className="not-prose">
              <ol className="divide-fd-border divide-y">
                {releases.map((r) => (
                  <li
                    key={r.tag}
                    id={r.version}
                    className="scroll-mt-24 py-10 first:pt-0"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="font-mono text-2xl font-semibold">
                        <a href={`#${r.version}`} className="hover:underline">
                          v{r.version}
                        </a>
                      </h2>
                      {r.version === content.version ? (
                        <span className="bg-fd-primary/10 text-fd-primary rounded px-2 py-0.5 text-xs font-semibold">
                          {t("common.latest")}
                        </span>
                      ) : null}
                      {r.prerelease ? (
                        <span className="bg-fd-muted rounded px-2 py-0.5 text-xs">
                          {t("common.prerelease")}
                        </span>
                      ) : null}
                      <time
                        className="text-fd-muted-foreground text-sm"
                        dateTime={r.publishedAt}
                      >
                        {t("releases.published", {
                          date: date.format(new Date(r.publishedAt)),
                        })}
                      </time>
                      <a
                        href={r.url}
                        className="text-fd-muted-foreground hover:text-fd-primary ml-auto inline-flex items-center gap-1 text-xs transition-colors"
                      >
                        GitHub <ExternalLink className="size-3" />
                      </a>
                    </div>
                    {r.body ? (
                      <div className="prose prose-sm dark:prose-invert mt-5 max-w-none">
                        <MarkdownBody>{r.body}</MarkdownBody>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </DocsBody>
      </DocsPage>
    </>
  );
};
