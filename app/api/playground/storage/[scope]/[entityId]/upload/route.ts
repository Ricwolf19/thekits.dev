import { createNextStorageHandlers } from "uploaderkit/server/next";

import { demoStorage } from "@/lib/playground/storage";

/**
 * Deliberately unauthenticated: nothing is persisted and there are no
 * credentials, so the exposure is invocation volume, not data. Volume is an
 * edge concern — a limiter here still pays for the invocation it rejects.
 * @see AGENTS.md#playground-upload-endpoint
 */
const handlers = createNextStorageHandlers(demoStorage);

export const POST = handlers.upload;
