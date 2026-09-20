import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { ListSkeleton } from "listkit/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DemoCase } from "@/components/playground/DemoCase";
import { CardsCase } from "@/components/playground/listkit/CardsCase";
import { FiltersCase } from "@/components/playground/listkit/FiltersCase";
import { HelloCase } from "@/components/playground/listkit/HelloCase";
import { PrimitivesCase } from "@/components/playground/listkit/PrimitivesCase";
import { SelectionCase } from "@/components/playground/listkit/SelectionCase";
import { AvatarCase } from "@/components/playground/uploaderkit/AvatarCase";
import { BasicCase } from "@/components/playground/uploaderkit/BasicCase";
import { GalleryCase } from "@/components/playground/uploaderkit/GalleryCase";
import { HeadlessCase } from "@/components/playground/uploaderkit/HeadlessCase";
import { MultipleCase } from "@/components/playground/uploaderkit/MultipleCase";
import { RetryCase } from "@/components/playground/uploaderkit/RetryCase";
import { ServerCase } from "@/components/playground/uploaderkit/ServerCase";
import { ValidationCase } from "@/components/playground/uploaderkit/ValidationCase";
import { ViewerCase } from "@/components/playground/uploaderkit/ViewerCase";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPackageContent } from "@/lib/content/fetch";
import { createT, type Locale, type TranslationKey } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { breadcrumbSchema } from "@/lib/schema";
import { isPackageId, PACKAGES, type PackageId } from "@/lib/site";

const LK = "listkit";
const UK = "uploaderkit";

/** The list reads its state from the URL (request data), so under PPR it sits
 * behind a boundary and the prose above still prerenders. */
const List = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ListSkeleton rows={6} columns={4} />}>
    {children}
  </Suspense>
);

/**
 * The ids the dictionary actually carries copy for. Deriving them from
 * `TranslationKey` means a case with no `playground.case.<id>.*` entry is a
 * type error here rather than a raw key rendered to the reader.
 */
type CaseId<K = TranslationKey> = K extends `playground.case.${infer Id}.title`
  ? Id
  : never;

type Case = {
  id: CaseId;
  file: string;
  /** @see DemoCase */
  bare?: boolean;
  render: (locale: Locale) => React.ReactNode;
};

const CASES: Record<PackageId, Case[]> = {
  listkit: [
    {
      id: "hello",
      bare: true,
      file: `${LK}/HelloCase.tsx`,
      render: (l) => (
        <List>
          <HelloCase locale={l} />
        </List>
      ),
    },
    {
      id: "filters",
      bare: true,
      file: `${LK}/FiltersCase.tsx`,
      render: (l) => (
        <List>
          <FiltersCase locale={l} />
        </List>
      ),
    },
    {
      id: "cards",
      bare: true,
      file: `${LK}/CardsCase.tsx`,
      render: (l) => (
        <List>
          <CardsCase locale={l} />
        </List>
      ),
    },
    {
      id: "selection",
      bare: true,
      file: `${LK}/SelectionCase.tsx`,
      render: (l) => (
        <List>
          <SelectionCase locale={l} />
        </List>
      ),
    },
    {
      id: "primitives",
      bare: true,
      file: `${LK}/PrimitivesCase.tsx`,
      render: (l) => <PrimitivesCase locale={l} />,
    },
  ],
  uploaderkit: [
    {
      id: "basic",
      file: `${UK}/BasicCase.tsx`,
      render: (l) => <BasicCase locale={l} />,
    },
    {
      id: "multiple",
      file: `${UK}/MultipleCase.tsx`,
      render: (l) => <MultipleCase locale={l} />,
    },
    {
      id: "avatar",
      file: `${UK}/AvatarCase.tsx`,
      render: (l) => <AvatarCase locale={l} />,
    },
    {
      id: "gallery",
      file: `${UK}/GalleryCase.tsx`,
      render: (l) => <GalleryCase locale={l} />,
    },
    {
      id: "validation",
      file: `${UK}/ValidationCase.tsx`,
      render: (l) => <ValidationCase locale={l} />,
    },
    {
      id: "retry",
      file: `${UK}/RetryCase.tsx`,
      render: (l) => <RetryCase locale={l} />,
    },
    {
      id: "viewer",
      file: `${UK}/ViewerCase.tsx`,
      render: (l) => <ViewerCase locale={l} />,
    },
    {
      id: "headless",
      file: `${UK}/HeadlessCase.tsx`,
      render: () => <HeadlessCase />,
    },
    {
      id: "server",
      file: `${UK}/ServerCase.tsx`,
      render: (l) => <ServerCase locale={l} />,
    },
  ],
};

export const PlaygroundPage = async ({
  pkg,
  locale,
}: {
  pkg: string;
  locale: Locale;
}) => {
  if (!isPackageId(pkg)) notFound();
  const id: PackageId = pkg;
  const content = await getPackageContent(id);
  const t = createT(locale);
  const cases = CASES[id];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "thekits.dev", path: routePath({ kind: "home" }, locale) },
          { name: id, path: routePath({ kind: "package", pkg: id }, locale) },
          {
            name: t("playground.title"),
            path: routePath({ kind: "playground", pkg: id }, locale),
          },
        ])}
      />

      <DocsPage
        toc={cases.map((c) => ({
          title: t(`playground.case.${c.id}.title`),
          url: `#${c.id}`,
          depth: 2,
        }))}
      >
        <p className="text-fd-primary font-display text-sm font-medium">
          {PACKAGES[id].npmName}@{content.version}
        </p>
        <DocsTitle>{t("playground.title")}</DocsTitle>
        <DocsDescription>{t("playground.subtitle")}</DocsDescription>

        <DocsBody>
          <div className="not-prose space-y-16">
            {cases.map((c) => (
              <DemoCase
                key={c.id}
                locale={locale}
                id={c.id}
                title={t(`playground.case.${c.id}.title`)}
                description={t(`playground.case.${c.id}.description`)}
                file={c.file}
                bare={c.bare}
              >
                {c.render(locale)}
              </DemoCase>
            ))}
          </div>
        </DocsBody>
      </DocsPage>
    </>
  );
};
