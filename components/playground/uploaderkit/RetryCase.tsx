"use client";

import { useMemo, useState } from "react";
import { ES_LABELS } from "uploaderkit";
import { Uploader } from "uploaderkit/ui";

import type { Locale } from "@/lib/i18n/config";
import { demoScopes } from "@/lib/playground/scopes";

import { Split } from "./_shared";
import { createFakeStrategy } from "./fakeStrategy";

/** A flaky network fails the first two attempts per file. With retry the
 * hook absorbs both behind exponential backoff; `concurrency: 2` queues the
 * rest. Remounting on toggle resets the attempt counters. */
export const RetryCase = ({ locale }: { locale: Locale }) => {
  const [withRetry, setWithRetry] = useState(true);
  const strategy = useMemo(
    () => createFakeStrategy({ duration: 700, failTimes: 2 }),
    [],
  );
  const es = locale === "es";
  return (
    <Split
      main={
        <>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-sm text-gray-700">
            <input
              type="checkbox"
              checked={withRetry}
              onChange={(e) => setWithRetry(e.target.checked)}
            />
            retry: {"{ attempts: 3, backoffMs: 400 }"}
          </label>
          <Uploader
            key={String(withRetry)}
            scopes={demoScopes}
            scope="demo-image"
            entityId="retry"
            strategy={strategy}
            multiple
            concurrency={2}
            {...(withRetry ? { retry: { attempts: 3, backoffMs: 400 } } : {})}
            label={
              es
                ? "Imágenes sobre una red inestable"
                : "Images over a flaky network"
            }
            description={
              es
                ? "Suelta varias — máximo 2 en vuelo"
                : "Drop several — at most 2 in flight"
            }
            labels={es ? ES_LABELS : undefined}
          />
        </>
      }
    />
  );
};
