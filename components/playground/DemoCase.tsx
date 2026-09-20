import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type { ReactNode } from "react";

import { MarkdownBody } from "@/components/mdx/MarkdownBody";
import { createT, type Locale } from "@/lib/i18n/config";
import { caseSource } from "@/lib/playground/caseSource";

/**
 * One gallery entry: title, one-line intent, then Preview / Source tabs.
 *
 * The preview is rendered flush inside the tab panel. Both packages draw their
 * own bordered surface, so wrapping them in a second card produced a box inside
 * a box; `bare` opts a case out of the panel padding entirely.
 *
 * The panel scrolls horizontally rather than clipping: a data table beside a
 * result panel is legitimately wider than a phone, and cutting it off loses
 * content with no way to reach it.
 *
 * Previews follow the site theme rather than being pinned to light.
 * @see AGENTS.md#playground-gallery
 */
export const DemoCase = async ({
  locale,
  id,
  title,
  description,
  file,
  bare = false,
  children,
}: {
  locale: Locale;
  id: string;
  title: string;
  description: string;
  /** Path relative to `components/playground`, read at build. */
  file: string;
  /** The case already draws its own surface — do not add padding around it. */
  bare?: boolean;
  children: ReactNode;
}) => {
  const t = createT(locale);
  const source = await caseSource(file);
  const lang = file.endsWith(".tsx") ? "tsx" : "ts";

  return (
    <section id={id} className="scroll-mt-24">
      <h2 id={`${id}-heading`} className="text-xl font-semibold">
        {title}
      </h2>
      <p className="text-fd-muted-foreground mt-1 max-w-2xl text-sm">
        {description}
      </p>

      <Tabs
        items={[t("playground.preview"), t("playground.source")]}
        className="mt-4"
      >
        {/* forceMount on both: an inactive Radix panel is never rendered, and a
            Server Component child that never renders is never refetched on the
            client either — the Source tab would open empty. */}
        <Tab value={t("playground.preview")} forceMount>
          <div
            className={`overflow-x-auto ${bare ? "" : "p-1 sm:p-2"}`}
            // A horizontally scrollable region must be focusable to be
            // reachable by keyboard.
            tabIndex={0}
            role="group"
            aria-label={title}
          >
            {children}
          </div>
        </Tab>
        <Tab value={t("playground.source")} forceMount>
          <MarkdownBody>{`\`\`\`${lang} title="${file.split("/").pop()}"\n${source}\n\`\`\``}</MarkdownBody>
        </Tab>
      </Tabs>
    </section>
  );
};
