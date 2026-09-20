import Link from "next/link";

import type { ResolvedPage } from "@/lib/content/manifest";
import type { Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import type { PackageId } from "@/lib/site";

/** The card grid linking every generated docs page for one package. */
export const DocsIndexGrid = ({
  pkg,
  locale,
  pages,
}: {
  pkg: PackageId;
  locale: Locale;
  pages: readonly ResolvedPage[];
}) => (
  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
    {pages.map(({ spec }) => (
      <li key={spec.slug}>
        <Link
          href={routePath({ kind: "docs", pkg, slug: [spec.slug] }, locale)}
          className="border-fd-border hover:border-fd-foreground/30 block rounded-lg border p-4 transition-colors"
        >
          <span className="font-medium">{spec.title[locale]}</span>
          <span className="text-fd-muted-foreground mt-1 block text-sm">
            {spec.description[locale]}
          </span>
        </Link>
      </li>
    ))}
  </ul>
);
