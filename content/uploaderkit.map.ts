import type { PackageManifest } from "@/lib/content/manifest";

/**
 * uploaderkit's README is already grouped by architectural layer, so its `##`
 * groups map almost one-to-one onto pages. Only the labels/theming pair is
 * regrouped, because both are about replacing what the components render
 * rather than about the UI components themselves.
 */
export const uploaderkitManifest: PackageManifest = {
  pages: [
    {
      slug: "overview",
      title: {
        en: "uploaderkit — one upload contract for every provider",
        es: "uploaderkit — un contrato de subida para cada proveedor",
      },
      description: {
        en: "What uploaderkit gives you: a scope registry, validation that runs identically on client and server, a headless React uploader and a server storage service.",
        es: "Lo que uploaderkit te da: un registro de scopes, validación que corre idéntica en cliente y servidor, un uploader headless para React y un servicio de almacenamiento en el servidor.",
      },
      headings: ["Features"],
    },
    {
      slug: "getting-started",
      title: { en: "Getting started", es: "Primeros pasos" },
      description: {
        en: "Install uploaderkit, register its Tailwind v4 stylesheet and run a working upload end to end.",
        es: "Instala uploaderkit, registra su hoja de estilos de Tailwind v4 y ejecuta una subida completa de principio a fin.",
      },
      headings: ["Quick Start", "Installation", "Tailwind v4 Setup"],
    },
    {
      slug: "scopes",
      title: { en: "Scopes — the contract", es: "Scopes — el contrato" },
      description: {
        en: "Declare once where a file goes, who may read it, how big it may be and what it replaces. Both sides validate against the same definition.",
        es: "Declara una vez a dónde va un archivo, quién puede leerlo, qué tamaño admite y qué reemplaza. Ambos lados validan contra la misma definición.",
      },
      headings: [
        "Scopes — the contract",
        "Defining scopes",
        "Replace — never leave a dead file",
      ],
    },
    {
      slug: "client",
      title: { en: "Client", es: "Cliente" },
      description: {
        en: "The headless useUploader hook: progress, abort, retry with backoff, concurrency caps, compression, renaming, validation and named slots.",
        es: "El hook headless useUploader: progreso, cancelación, reintentos con backoff, límite de concurrencia, compresión, renombrado, validación y slots con nombre.",
      },
      headings: [
        "Client",
        "`useUploader`",
        "Upload trigger — `select` vs `manual`",
        "Retry and concurrency",
        "Renaming on the way in",
        "Safe file names",
        "Upload strategies",
        "Validation",
        "Image compression",
        "Named slots (`useSlottedUploader`)",
      ],
    },
    {
      slug: "ui-components",
      title: { en: "UI components", es: "Componentes de UI" },
      description: {
        en: "The optional component layer: Uploader, SlottedUploader, confirmations, file preview, reading stored files, drop-to-replace, or none of it at all.",
        es: "La capa opcional de componentes: Uploader, SlottedUploader, confirmaciones, vista previa, lectura de archivos almacenados, soltar para reemplazar, o nada de ello.",
      },
      headings: [
        "UI components",
        "`Uploader`",
        "`SlottedUploader`",
        "Confirmations",
        "File preview (`FileViewer`)",
        "Reading a stored file",
        "Drop to replace",
        "Going fully headless",
      ],
    },
    {
      slug: "theming-and-labels",
      title: { en: "Theming and labels", es: "Theming y textos" },
      description: {
        en: "Rebrand through CSS variables alone, and replace every user-facing string — including the ones the components do not render.",
        es: "Cambia la marca solo con variables CSS y reemplaza cada texto visible — incluidos los que los componentes no renderizan.",
      },
      headings: [
        "Labels — every string is replaceable",
        "The copy reaches further than the components",
        "Theming",
      ],
    },
    {
      slug: "presets",
      title: { en: "Presets", es: "Presets" },
      description: {
        en: "Ready-made uploaders for the shapes that keep recurring: avatars, galleries and whole-window drop targets.",
        es: "Uploaders listos para las formas que se repiten: avatares, galerías y zonas de arrastre que cubren toda la ventana.",
      },
      headings: ["Presets"],
    },
    {
      slug: "server",
      title: { en: "Server", es: "Servidor" },
      description: {
        en: "createStorage, what an upload replaced, streaming reads, the Express and Next.js App Router routers, and at-rest encryption.",
        es: "createStorage, qué reemplazó una subida, lecturas en streaming, los routers de Express y Next.js App Router, y cifrado en reposo.",
      },
      headings: [
        "Server",
        "`createStorage`",
        "What an upload replaced",
        "Streaming reads",
        "Express",
        "Next.js App Router",
        "Encryption",
      ],
    },
    {
      slug: "storage-providers",
      title: { en: "Storage providers", es: "Proveedores de almacenamiento" },
      description: {
        en: "S3, Google Cloud Storage, R2 and an in-memory adapter behind one interface — swap the provider without touching a scope.",
        es: "S3, Google Cloud Storage, R2 y un adaptador en memoria tras una sola interfaz — cambia de proveedor sin tocar un scope.",
      },
      headings: ["Storage providers"],
    },
    {
      slug: "reference",
      title: { en: "Reference", es: "Referencia" },
      description: {
        en: "Subpath exports and the tiered error messages uploaderkit surfaces to developers versus to users.",
        es: "Exports por subpath y los mensajes de error por niveles que uploaderkit muestra a desarrolladores frente a usuarios.",
      },
      headings: ["Developer feedback", "Subpath Exports", "License"],
    },
  ],
};
