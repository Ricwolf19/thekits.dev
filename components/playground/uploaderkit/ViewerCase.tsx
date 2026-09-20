"use client";

import { Eye, FileText, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { ES_LABELS } from "uploaderkit";
import { FileViewer, type ViewableFile } from "uploaderkit/ui";

import type { Locale } from "@/lib/i18n/config";

/**
 * `FileViewer` on its own, with no uploader attached.
 *
 * It is a standalone overlay: hand it a file (or a set to page through) and it
 * renders images, PDFs and the fallback for anything it cannot display inline.
 * That makes it reusable anywhere an app already has stored files — a record
 * detail, an attachments table — not only next to an upload zone.
 *
 * `resolveUrl` is the hook for authenticated reads: it runs per open, so a
 * short-lived signed URL is fetched when the viewer needs it rather than
 * embedded in the page.
 */
const FILES: ViewableFile[] = [
  {
    url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200",
    fileName: "coffee.jpg",
    mimeType: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200",
    fileName: "espresso.jpg",
    mimeType: "image/jpeg",
  },
  {
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileName: "invoice.pdf",
    mimeType: "application/pdf",
  },
];

export const ViewerCase = ({ locale }: { locale: Locale }) => {
  const [open, setOpen] = useState<ViewableFile | null>(null);
  const es = locale === "es";

  return (
    <div className="space-y-4">
      <p className="text-fd-muted-foreground text-sm">
        {es
          ? "Abre cualquiera y navega con las flechas: el visor recibe el conjunto completo."
          : "Open any of them and use the arrow keys: the viewer receives the whole set."}
      </p>

      <ul className="grid gap-2 sm:grid-cols-3">
        {FILES.map((file) => (
          <li key={file.url}>
            <button
              type="button"
              onClick={() => setOpen(file)}
              className="border-fd-border hover:border-fd-primary hover:text-fd-primary btn-lift flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm"
            >
              {file.mimeType === "application/pdf" ? (
                <FileText className="size-4 shrink-0" />
              ) : (
                <ImageIcon className="size-4 shrink-0" />
              )}
              <span className="min-w-0 flex-1 truncate font-mono text-xs">
                {file.fileName}
              </span>
              <Eye className="size-3.5 shrink-0 opacity-60" />
            </button>
          </li>
        ))}
      </ul>

      <FileViewer
        file={open}
        files={FILES}
        onClose={() => setOpen(null)}
        labels={es ? ES_LABELS : undefined}
      />
    </div>
  );
};
