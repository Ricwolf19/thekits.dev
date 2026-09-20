"use client";

import { useState } from "react";
import { ES_LABELS, type StoredFile } from "uploaderkit";
import { Uploader } from "uploaderkit/ui";

import type { Locale } from "@/lib/i18n/config";
import { demoScopes } from "@/lib/playground/scopes";

import { ResultPanel, Split } from "./_shared";
import { createFakeStrategy } from "./fakeStrategy";

const strategy = createFakeStrategy({ duration: 2600 });

/** Many files: batch progress, per-file abort, a `maxFiles` cap, and the
 * stored list living outside the uploader. */
export const MultipleCase = ({ locale }: { locale: Locale }) => {
  const [saved, setSaved] = useState<StoredFile[]>([]);
  return (
    <Split
      main={
        <Uploader
          scopes={demoScopes}
          scope="demo-image"
          entityId="multi"
          strategy={strategy}
          multiple
          maxFiles={4}
          label={locale === "es" ? "Imágenes (máximo 4)" : "Images (up to 4)"}
          labels={locale === "es" ? ES_LABELS : undefined}
          stored={saved}
          onRemoveStored={(file) =>
            setSaved((prev) => prev.filter((f) => f.key !== file.key))
          }
          onUploaded={(stored) => setSaved((prev) => [...prev, ...stored])}
        />
      }
      aside={
        saved.length > 0 ? (
          <ResultPanel
            label={`StoredFile[] · ${saved.length}`}
            data={saved.map((f) => f.key)}
          />
        ) : undefined
      }
    />
  );
};
