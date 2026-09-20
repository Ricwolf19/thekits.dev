"use client";

import { useState } from "react";
import { ES_LABELS } from "uploaderkit";
import { Uploader } from "uploaderkit/ui";

import type { Locale } from "@/lib/i18n/config";
import { demoScopes } from "@/lib/playground/scopes";

import { ResultPanel, Split } from "./_shared";
import { createFakeStrategy } from "./fakeStrategy";

const ok = createFakeStrategy();
const failing = createFakeStrategy({
  duration: 900,
  failWith: "The server rejected the file",
});

/** Wrong extension, oversized file and a spoofed signature are caught before a
 * byte leaves; toggle the checkbox to see a server that answers an error too. */
export const ValidationCase = ({ locale }: { locale: Locale }) => {
  const [serverFails, setServerFails] = useState(false);
  const [rejections, setRejections] = useState<string[]>([]);
  const es = locale === "es";
  return (
    <Split
      main={
        <>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={serverFails}
              onChange={(e) => setServerFails(e.target.checked)}
            />
            {es
              ? "Simular rechazo del servidor"
              : "Simulate a server rejection"}
          </label>
          <Uploader
            scopes={demoScopes}
            scope="demo-strict-pdf"
            entityId="validation"
            strategy={serverFails ? failing : ok}
            label={es ? "PDF estricto" : "Strict PDF"}
            description={
              es
                ? ".pdf · máximo 1 MB · firma binaria verificada"
                : ".pdf · up to 1 MB · binary signature verified"
            }
            labels={es ? ES_LABELS : undefined}
            onError={(message) => setRejections((prev) => [...prev, message])}
          />
        </>
      }
      aside={
        rejections.length > 0 ? (
          <ResultPanel label="onError" data={rejections} />
        ) : undefined
      }
    />
  );
};
