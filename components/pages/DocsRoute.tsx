import { redirect } from "next/navigation";

import { DocsArticle } from "@/components/pages/DocsArticle";
import type { Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import type { DocsRouteParams } from "@/lib/routes/packageRoutes";
import { isPackageId } from "@/lib/site";

export const DocsRoute = async ({
  params,
  locale,
}: {
  params: Promise<DocsRouteParams>;
  locale: Locale;
}) => {
  const { pkg, slug } = await params;
  if (!isPackageId(pkg)) redirect(routePath({ kind: "home" }, locale));

  // The docs root has no page of its own; send it to the overview rather than
  // serving a duplicate of that page at two URLs.
  if (!slug?.length) {
    redirect(routePath({ kind: "docs", pkg, slug: ["overview"] }, locale));
  }

  return <DocsArticle pkg={pkg} locale={locale} slug={slug} />;
};
