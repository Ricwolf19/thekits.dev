"use client";

import { useState } from "react";
import { ES_LABELS, type StoredFile } from "uploaderkit";
import { Uploader } from "uploaderkit/ui";

import type { Locale } from "@/lib/i18n/config";
import { demoScopes } from "@/lib/playground/scopes";

import { ResultPanel, Split } from "./_shared";
import { createFakeStrategy } from "./fakeStrategy";

const strategy = createFakeStrategy();

/** One zone, one file. The default everything: validate → upload → done. */
export const BasicCase = ({ locale }: { locale: Locale }) => {
  const [saved, setSaved] = useState<StoredFile[]>([]);
  return (
    <Split
      main={
        <Uploader
          scopes={demoScopes}
          scope="demo-document"
          entityId="basic"
          strategy={strategy}
          label={locale === "es" ? "Documento" : "Document"}
          shortcut="mod+u"
          labels={locale === "es" ? ES_LABELS : undefined}
          onUploaded={(stored) => setSaved((prev) => [...prev, ...stored])}
        />
      }
      aside={
        saved.length > 0 ? (
          <ResultPanel label="StoredFile" data={saved.at(-1)} />
        ) : undefined
      }
    />
  );
};
