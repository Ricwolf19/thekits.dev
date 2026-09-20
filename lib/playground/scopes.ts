import { defineScopes, MB } from "uploaderkit";

/**
 * Imported by both the client and the route handler — one definition, validated
 * on both sides. Caps are small because the endpoint is public and open.
 */
export const demoScopes = defineScopes({
  "demo-image": {
    // Own folder per scope: sharing `demo/<id>` made a replace here sweep the
    // documents, which uploaderkit rejects at import time.
    path: (id, file) => `demo/${id}/images/${file.name}`,
    visibility: "public",
    accept: ["png", "jpg", "jpeg", "webp"],
    maxBytes: 2 * MB,
    category: "image",
    compress: { maxWidth: 1280, quality: 0.8 },
  },
  "demo-document": {
    path: (id, file) => `demo/${id}/docs/${file.name}`,
    visibility: "private",
    accept: ["pdf"],
    maxBytes: 2 * MB,
    maxFiles: 2,
    category: "pdf",
  },
});
