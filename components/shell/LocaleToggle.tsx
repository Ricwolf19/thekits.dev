import Link from "next/link";

import { createT, type Locale } from "@/lib/i18n/config";
import { alternatePath, type RouteDescriptor } from "@/lib/i18n/routes";

/**
 * Takes the route descriptor, not the pathname: swapping an `/es` prefix cannot
 * know `releases` is `versiones`, so it 404s on any translated segment.
 */
export const LocaleToggle = ({
  descriptor,
  locale,
}: {
  descriptor: RouteDescriptor;
  locale: Locale;
}) => {
  const other: Locale = locale === "en" ? "es" : "en";
  const t = createT(locale);

  return (
    <Link
      href={alternatePath(descriptor, locale)}
      // Crosses root layouts, so it is a document navigation either way.
      prefetch={false}
      hrefLang={other}
      aria-label={t("lang.switch")}
      className="text-fd-muted-foreground hover:text-fd-foreground text-sm font-medium transition-colors"
    >
      {other === "es" ? "ES" : "EN"}
    </Link>
  );
};
