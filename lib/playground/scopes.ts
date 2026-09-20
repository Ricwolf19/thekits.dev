import { defineScopes, MB } from "uploaderkit";

/**
 * Imported by both the client and the route handler — one definition, validated
 * on both sides. Caps are small because the server endpoint is public and open.
 * Every scope gets its own folder: sharing a prefix makes a replace in one
 * sweep the other, which uploaderkit rejects at import time.
 */
export const demoScopes = defineScopes({
  "demo-image": {
    path: (id, file) => `demo/${id}/images/${file.name}`,
    visibility: "public",
    accept: ["png", "jpg", "jpeg", "webp"],
    maxBytes: 2 * MB,
    category: "image",
    maxFiles: 8,
  },
  "demo-document": {
    path: (id, file) => `demo/${id}/docs/${file.name}`,
    visibility: "private",
    accept: ["pdf"],
    maxBytes: 2 * MB,
    maxFiles: 2,
    category: "pdf",
  },
  "demo-avatar": {
    path: (id) => `demo/${id}/avatar`,
    visibility: "public",
    accept: ["png", "jpg", "jpeg", "webp"],
    maxBytes: 2 * MB,
    category: "image",
    compress: { maxWidth: 512, quality: 0.75 },
  },
  "demo-strict-pdf": {
    path: (id, file) => `demo/${id}/strict/${file.name}`,
    visibility: "private",
    accept: ["pdf"],
    maxBytes: 1 * MB,
    category: "pdf",
  },
});
