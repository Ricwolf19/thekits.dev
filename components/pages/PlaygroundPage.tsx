import { ListSkeleton } from "listkit/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ListkitDemo } from "@/components/playground/listkit/ListkitDemo";
import { UploaderDemo } from "@/components/playground/uploaderkit/UploaderDemo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getPackageContent } from "@/lib/content/fetch";
import { createT, type Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { breadcrumbSchema } from "@/lib/schema";
import { isPackageId, PACKAGES, type PackageId } from "@/lib/site";

const NOTE = {
  en: "Everything below runs the version published on npm, imported the same way your app would.",
  es: "Todo lo de abajo corre la versión publicada en npm, importada igual que en tu app.",
} as const;

export const PlaygroundPage = async ({
  pkg,
  locale,
}: {
  pkg: string;
  locale: Locale;
}) => {
  if (!isPackageId(pkg)) notFound();
  const id: PackageId = pkg;

  const content = await getPackageContent(id);
  const t = createT(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "thekits.dev", path: routePath({ kind: "home" }, locale) },
          { name: id, path: routePath({ kind: "package", pkg: id }, locale) },
          {
            name: t("playground.title"),
            path: routePath({ kind: "playground", pkg: id }, locale),
          },
        ])}
      />

      <SiteHeader
        locale={locale}
        descriptor={{ kind: "playground", pkg: id }}
        up={{ kind: "package", pkg: id }}
        label={id}
        width="max-w-6xl"
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("playground.title")}
        </h1>
        <p className="text-fd-muted-foreground mt-3 max-w-2xl">
          {t("playground.subtitle")} {NOTE[locale]}
        </p>
        <p className="text-fd-muted-foreground mt-2 font-mono text-xs">
          {PACKAGES[id].npmName}@{content.version}
        </p>

        {/* The list reads its state from the URL, which is request data. Under
            PPR that has to sit behind a boundary so the prose and metadata above
            — the part that ranks — still prerender as a static shell.
            `ListSkeleton` comes from `listkit/server`: the main entry pulls
            client context and would crash the RSC render. */}
        <div className="mt-12">
          {id === "listkit" ? (
            <Suspense fallback={<ListSkeleton rows={8} columns={5} />}>
              <ListkitDemo locale={locale} />
            </Suspense>
          ) : (
            <UploaderDemo locale={locale} />
          )}
        </div>
      </main>
    </>
  );
};
