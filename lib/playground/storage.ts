import { createMemoryProvider } from "uploaderkit/adapters/memory";
import { createStorage } from "uploaderkit/server";

import { demoScopes } from "./scopes";

/**
 * In-memory provider: no bucket, no credentials, nothing persisted. Each Vercel
 * invocation has its own heap, so an upload is not readable afterwards — which
 * is why the demo shows the returned descriptor rather than a gallery.
 */
export const demoStorage = createStorage({
  scopes: demoScopes,
  provider: createMemoryProvider(),
});
