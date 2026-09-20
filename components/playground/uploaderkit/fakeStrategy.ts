import type { StoredFile } from "uploaderkit";
import type { UploadStrategy } from "uploaderkit/react";

export type FakeStrategyOptions = {
  /** Total simulated duration, ms. */
  duration?: number;
  /** Reject every upload with this message. */
  failWith?: string;
  /** Fail the first N attempts per file, then succeed. */
  failTimes?: number;
};

/**
 * A simulated transport, ported from the package's own playground: ticks
 * progress, honours abort, and answers a `StoredFile` the way the real router
 * would. It lets the gallery show retries and rejections without a server.
 */
export const createFakeStrategy = ({
  duration = 1600,
  failWith,
  failTimes = 0,
}: FakeStrategyOptions = {}): UploadStrategy => {
  const attempts = new Map<string, number>();

  return (file, scope, entityId, { onProgress, signal }) =>
    new Promise<StoredFile>((resolve, reject) => {
      const started = Date.now();
      const attempt = (attempts.get(file.name) ?? 0) + 1;
      attempts.set(file.name, attempt);

      const timer = setInterval(() => {
        onProgress(
          Math.min(99, Math.round(((Date.now() - started) / duration) * 100)),
        );
        if (Date.now() - started < duration) return;
        clearInterval(timer);
        if (failWith) return reject(new Error(failWith));
        if (attempt <= failTimes)
          return reject(new Error(`Network failed (attempt ${attempt})`));
        resolve({
          key: `${scope}/${entityId}/${file.name}`,
          url: URL.createObjectURL(file),
          scope,
          entityId,
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
          uploadedAt: Date.now(),
        });
      }, 120);

      signal.addEventListener("abort", () => {
        clearInterval(timer);
        const error = new Error("Upload cancelled");
        error.name = "AbortError";
        reject(error);
      });
    });
};
