import Link from "next/link";

import { LocaleToggle } from "@/components/shell/LocaleToggle";
import type { Locale } from "@/lib/i18n/config";
import { routePath, type RouteDescriptor } from "@/lib/i18n/routes";
import { site } from "@/lib/site";

/**
 * Site chrome: a wordmark that walks one level up, and the language switcher.
 *
 * `descriptor` is the page's own route so the switcher lands on its translation
 * rather than the home page. `up` overrides the wordmark target for pages nested
 * under a package.
 */
export const SiteHeader = ({
  locale,
  descriptor,
  up,
  label = site.name,
  width = "max-w-5xl",
}: {
  locale: Locale;
  descriptor: RouteDescriptor;
  up?: RouteDescriptor;
  label?: string;
  width?: string;
}) => (
  <header
    className={`mx-auto flex w-full ${width} items-center justify-between px-6 py-6`}
  >
    <Link
      href={routePath(up ?? { kind: "home" }, locale)}
      className="font-mono text-sm font-medium"
    >
      {label}
    </Link>
    <LocaleToggle descriptor={descriptor} locale={locale} />
  </header>
);
