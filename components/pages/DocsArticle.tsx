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
import { createT, type Locale } from "@/lib/i18n/config";
import {
  GITHUB_OWNER,
  PACKAGES,
  type PackageId,
  readmeEditUrl,
} from "@/lib/site";

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

  const t = createT(locale);

  return (
    <DocsPage
      toc={toc}
      editOnGithub={{
        // Points at the default branch, not the pinned release tag: a reader
        // fixing a typo should edit what ships next, not a frozen snapshot.
        owner: GITHUB_OWNER,
        repo: pkg,
        sha: "main",
        path: PACKAGES[pkg].readme[locale],
      }}
      full={false}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MarkdownBody>{page.data.content}</MarkdownBody>
      </DocsBody>
      <p className="text-fd-muted-foreground mt-12 border-t pt-6 text-sm">
        {t("docs.generatedFrom", { version: content.version })}{" "}
        <a
          className="underline underline-offset-2"
          href={readmeEditUrl(PACKAGES[pkg], locale)}
        >
          {t("docs.editOnGithub")}
        </a>
      </p>
    </DocsPage>
  );
};
