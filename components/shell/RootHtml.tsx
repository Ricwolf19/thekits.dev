import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";

import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * There is no `app/layout.tsx`: a shared ancestor would have to hardcode one
 * `lang`. Each locale tree owns a root layout and both render this.
 * @see AGENTS.md#bilingual-routing
 */
export const RootHtml = ({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) => (
  <html
    lang={locale}
    className={cn(GeistSans.variable, GeistMono.variable)}
    suppressHydrationWarning
  >
    <body className="flex min-h-screen flex-col font-sans antialiased">
      {/* `locales` is intentionally omitted so Fumadocs does not render its own
          language switcher: its default redirect assumes a locale prefix on
          every URL, and English here is unprefixed. The switcher in the site
          chrome uses `alternatePath` instead, which derives both URLs from one
          route descriptor. */}
      <RootProvider i18n={{ locale, defaultLanguage: DEFAULT_LOCALE }}>
        {children}
      </RootProvider>
    </body>
  </html>
);
