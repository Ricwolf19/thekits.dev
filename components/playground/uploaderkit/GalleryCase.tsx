"use client";

import { useState } from "react";
import { ES_LABELS, type StoredFile } from "uploaderkit";
import { GalleryUploader } from "uploaderkit/presets";

import type { Locale } from "@/lib/i18n/config";
import { demoScopes } from "@/lib/playground/scopes";

import { ResultPanel, Split } from "./_shared";
import { createFakeStrategy } from "./fakeStrategy";

const strategy = createFakeStrategy({ duration: 1800 });

/** Tiles from each file's own preview, hover actions, the add tile as the
 * dropzone, and a full-screen viewer over the whole set. */
export const GalleryCase = ({ locale }: { locale: Locale }) => {
  const [stored, setStored] = useState<StoredFile[]>([]);
  return (
    <Split
      main={
        <GalleryUploader
          scopes={demoScopes}
          scope="demo-image"
          entityId="gallery"
          strategy={strategy}
          stored={stored}
          labels={locale === "es" ? ES_LABELS : undefined}
          onUploaded={(files) => setStored((cur) => [...cur, ...files])}
          onRemoveStored={(file) =>
            setStored((cur) => cur.filter((f) => f.key !== file.key))
          }
        />
      }
      aside={
        stored.length > 0 ? (
          <ResultPanel
            label={`StoredFile[] · ${stored.length}`}
            data={stored.map((f) => f.key)}
          />
        ) : undefined
      }
    />
  );
};
