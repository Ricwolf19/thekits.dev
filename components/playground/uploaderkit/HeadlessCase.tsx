"use client";

import { useRef } from "react";
import { formatFileSize } from "uploaderkit";
import { useUploader } from "uploaderkit/react";

import { demoScopes } from "@/lib/playground/scopes";

import { createFakeStrategy } from "./fakeStrategy";

const strategy = createFakeStrategy({ duration: 2200 });

/** No shipped UI: the hook drives a fully custom interface — manual `upload()`,
 * a per-file progress ring and an abort button. */
export const HeadlessCase = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploader = useUploader({
    scopes: demoScopes,
    scope: "demo-image",
    entityId: "headless",
    strategy,
    multiple: true,
    uploadOn: "manual",
  });
  const btn = "rounded-full px-4 py-2 text-sm font-medium";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={uploader.accept}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void uploader.addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`${btn} bg-[#0e7490] text-white hover:bg-[#155e75]`}
        >
          Choose images
        </button>
        <button
          type="button"
          onClick={() => void uploader.upload()}
          disabled={uploader.isUploading || uploader.files.length === 0}
          className={`${btn} border border-[#0e7490] text-[#0e7490] disabled:opacity-40`}
        >
          Upload all
        </button>
        {uploader.isUploading && (
          <button
            type="button"
            onClick={() => uploader.abort()}
            className="text-sm text-red-600 hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
      <ul className="space-y-1">
        {uploader.files.map((file) => (
          <li
            key={file.id}
            className="flex items-center gap-3 rounded-lg bg-cyan-50 px-3 py-2 text-sm"
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
              style={{
                background: `conic-gradient(#0e7490 ${file.progress * 3.6}deg, #cffafe 0deg)`,
              }}
            >
              {file.status === "success" ? "✓" : file.progress}
            </span>
            <span className="min-w-0 flex-1 truncate">{file.file.name}</span>
            <span className="text-xs text-gray-500">
              {formatFileSize(file.file.size)}
            </span>
            <button
              type="button"
              onClick={() => uploader.removeFile(file.id)}
              className="text-xs text-gray-400 hover:text-red-600"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
