"use client";

import { useState } from "react";
import { ES_LABELS, type StoredFile } from "uploaderkit";
import { createXhrUploadStrategy } from "uploaderkit/react";
import { Uploader } from "uploaderkit/ui";

import type { Locale } from "@/lib/i18n/config";
import { demoScopes } from "@/lib/playground/scopes";

const COPY = {
  en: {
    imageLabel: "Product image",
    imageHint:
      "PNG, JPG or WebP up to 2 MB. Downscaled to 1280px before upload.",
    docLabel: "Invoice PDF",
    docHint: "PDF only, up to 2 MB, two files max.",
    result: "What the server returned",
    empty: "Nothing uploaded yet. The panel fills with the stored descriptor.",
    note: "Stored in memory and discarded immediately — nothing is persisted.",
    failed: "Upload rejected",
  },
  es: {
    imageLabel: "Imagen de producto",
    imageHint: "PNG, JPG o WebP hasta 2 MB. Se reduce a 1280px antes de subir.",
    docLabel: "Factura en PDF",
    docHint: "Solo PDF, hasta 2 MB, máximo dos archivos.",
    result: "Lo que devolvió el servidor",
    empty: "Nada subido aún. El panel se llena con el descriptor almacenado.",
    note: "Se guarda en memoria y se descarta de inmediato — nada se persiste.",
    failed: "Subida rechazada",
  },
} as const;

/**
 * The one case that posts to the real route handler, backed by the package's
 * in-memory provider; every other case uses `createFakeStrategy`. Each upload is a self-contained
 * round trip: the result panel shows the descriptor the server returned rather
 * than a persistent gallery, because on serverless nothing survives the
 * invocation and a gallery would look broken.
 */
export const ServerCase = ({ locale }: { locale: Locale }) => {
  const t = COPY[locale];
  const [stored, setStored] = useState<StoredFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const strategy = createXhrUploadStrategy({
    endpoint: "/api/playground/storage",
  });

  const common = {
    scopes: demoScopes,
    entityId: "demo",
    strategy,
    labels: locale === "es" ? ES_LABELS : undefined,
    onUploaded: (files: StoredFile[]) => {
      setError(null);
      setStored((prev) => [...files, ...prev].slice(0, 6));
    },
    onError: setError,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-8">
        <Uploader
          {...common}
          scope="demo-image"
          label={t.imageLabel}
          description={t.imageHint}
        />
        <Uploader
          {...common}
          scope="demo-document"
          label={t.docLabel}
          description={t.docHint}
          multiple
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold">{t.result}</h3>
        {error ? (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {t.failed}: {error}
          </p>
        ) : null}
        {stored.length === 0 ? (
          <p className="text-fd-muted-foreground mt-3 text-sm">{t.empty}</p>
        ) : (
          <pre className="bg-fd-muted mt-3 max-h-96 overflow-auto rounded-lg p-4 text-xs">
            {JSON.stringify(stored, null, 2)}
          </pre>
        )}
        <p className="text-fd-muted-foreground mt-4 text-xs">{t.note}</p>
      </div>
    </div>
  );
};
