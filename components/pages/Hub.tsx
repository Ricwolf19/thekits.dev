import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllContent } from "@/lib/content/fetch";
import { createT, type Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { personSchema, websiteSchema } from "@/lib/schema";
import { PACKAGES } from "@/lib/site";

export const Hub = async ({ locale }: { locale: Locale }) => {
  const t = createT(locale);
  const packages = await getAllContent();

  return (
    <>
      <JsonLd data={[personSchema(), websiteSchema(locale)]} />

      <SiteHeader locale={locale} descriptor={{ kind: "home" }} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {t("hub.title")}
        </h1>
        <p className="text-fd-muted-foreground mt-6 max-w-2xl text-lg">
          {t("hub.subtitle")}
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {packages.map((content) => {
            const readme = content.readme[locale];
            return (
              <Link
                key={content.id}
                href={routePath({ kind: "package", pkg: content.id }, locale)}
                className="group border-fd-border hover:border-fd-foreground/30 rounded-xl border p-6 transition-colors"
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="font-mono text-xl font-medium">
                    {content.id}
                  </h2>
                  <span className="text-fd-muted-foreground font-mono text-xs">
                    v{content.version}
                  </span>
                </div>
                <p className="mt-3 font-medium">{readme.tagline}</p>
                <p className="text-fd-muted-foreground mt-2 text-sm">
                  {readme.summary}
                </p>
                <p className="text-fd-muted-foreground mt-4 font-mono text-xs">
                  npm i {PACKAGES[content.id].npmName}
                </p>
              </Link>
            );
          })}
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
};
