import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";

import { MarkdownBody } from "@/components/mdx/MarkdownBody";
import { pageToc } from "@/lib/content/assemble";
import { getPackageContent } from "@/lib/content/fetch";
import { getDocsSource } from "@/lib/content/source";
import type { Locale } from "@/lib/i18n/config";
import type { PackageId } from "@/lib/site";

export const DocsArticle = async ({
  pkg,
  locale,
  slug,
}: {
  pkg: PackageId;
  locale: Locale;
  slug?: string[];
}) => {
  const [source, content] = await Promise.all([
    getDocsSource(pkg),
    getPackageContent(pkg),
  ]);

  const page = source.getPage(slug ?? [], locale);
  if (!page) notFound();

  const resolved = content.pages.find((p) => p.spec.slug === page.slugs[0]);
  const toc = resolved
    ? pageToc(content.readme[locale], resolved.indices).map((h) => ({
        title: h.text,
        url: `#${h.slug}`,
        depth: h.level,
      }))
    : [];

  return (
    <DocsPage toc={toc} full={false}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MarkdownBody>{page.data.content}</MarkdownBody>
      </DocsBody>
    </DocsPage>
  );
};
