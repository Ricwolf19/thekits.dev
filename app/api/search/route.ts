import { createI18nSearchAPI } from "fumadocs-core/search/server";

import { i18nConfig } from "@/lib/content/source";
import { buildSearchIndexes } from "@/lib/search";

/**
 * Search over every page in both languages.
 *
 * Indexes are built from the same generated content the pages render, so a
 * result can never point at a section that is not on the page. `indexes` is a
 * function: it runs once at build and the route is otherwise static.
 */
export const { GET } = createI18nSearchAPI("advanced", {
  i18n: i18nConfig,
  indexes: async () => buildSearchIndexes(),
});
