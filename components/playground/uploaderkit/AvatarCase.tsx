"use client";

import { useState } from "react";
import { ES_LABELS } from "uploaderkit";
import { AvatarUploader } from "uploaderkit/presets";

import type { Locale } from "@/lib/i18n/config";
import { demoScopes } from "@/lib/playground/scopes";

import { ResultPanel, Split } from "./_shared";
import { createFakeStrategy } from "./fakeStrategy";

const strategy = createFakeStrategy({ duration: 2200 });

/** The avatar recipe as one component: the picture is the control, a drop
 * lands on it, a ring closes while it uploads. */
export const AvatarCase = ({ locale }: { locale: Locale }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);
  return (
    <Split
      main={
        <div className="flex items-center gap-5">
          <AvatarUploader
            scopes={demoScopes}
            scope="demo-avatar"
            entityId="user-42"
            strategy={strategy}
            src={url}
            fallback="RT"
            size={96}
            labels={locale === "es" ? ES_LABELS : undefined}
            onUploaded={(stored) => {
              setUrl(stored.url);
              setKey(stored.key);
            }}
            onRemove={() => {
              setUrl(null);
              setKey(null);
            }}
          />
          <div>
            <p className="text-sm font-medium text-gray-800">Ricardo Tapia</p>
            <p className="text-xs text-gray-500">
              {locale === "es"
                ? "Toca la foto o suelta una imagen encima"
                : "Click the picture or drop an image on it"}
            </p>
          </div>
        </div>
      }
      aside={
        key ? <ResultPanel label="StoredFile.key" data={key} /> : undefined
      }
    />
  );
};
