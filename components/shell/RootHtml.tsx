import { SpeedInsights } from "@vercel/speed-insights/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { searchSuggestions } from "@/lib/search/suggestions";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

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
    className={cn(inter.variable, jetbrains.variable)}
    suppressHydrationWarning
  >
    <body className="flex min-h-screen flex-col antialiased">
      {/* `locales` is omitted so Fumadocs does not render its own switcher: its
          redirect assumes a locale prefix on every URL and English is
          unprefixed here. The chrome uses LocaleToggle instead. */}
      <RootProvider
        i18n={{ locale, defaultLanguage: DEFAULT_LOCALE }}
        // `links` are what the dialog shows before anything is typed — an
        // empty box with no starting point is why search felt broken.
        search={{
          links: searchSuggestions(locale),
          options: { api: "/api/search" },
        }}
      >
        {children}
      </RootProvider>
      {/* Both locale trees render this component, so mounting it once here
          covers the whole site. The /next entry reads the route from
          `useParams`, so metrics aggregate per dynamic segment rather than
          per URL — /[pkg]/docs/[[...slug]], not 44 separate rows. */}
      <SpeedInsights />
    </body>
  </html>
);
