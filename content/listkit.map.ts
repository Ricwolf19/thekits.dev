import type { PackageManifest } from "@/lib/content/manifest";

/**
 * listkit's README has no `##` grouping of its own — 43 `###` topics sit flat
 * under a single empty `## Usage` container — so the page boundaries are
 * invented here rather than mirrored from the source.
 */
export const listkitManifest: PackageManifest = {
  pages: [
    {
      slug: "overview",
      title: {
        en: "listkit — standardized list views for React",
        es: "listkit — vistas de lista estandarizadas para React",
      },
      description: {
        en: "What listkit gives you: table and cards views, search, advanced filters, pagination, sorting, SSR and theming from a single config object.",
        es: "Lo que listkit te da: vistas de tabla y tarjetas, búsqueda, filtros avanzados, paginación, ordenamiento, SSR y theming desde un solo objeto de configuración.",
      },
      headings: ["Features"],
    },
    {
      slug: "getting-started",
      title: { en: "Getting started", es: "Primeros pasos" },
      description: {
        en: "Install listkit, register its Tailwind v4 stylesheet and render a working list in a few lines.",
        es: "Instala listkit, registra su hoja de estilos de Tailwind v4 y renderiza una lista funcional en pocas líneas.",
      },
      headings: ["Quick Start", "Installation", "Tailwind v4 Setup"],
    },
    {
      slug: "configuration",
      title: { en: "Configuration", es: "Configuración" },
      description: {
        en: "Wire the provider once at the app root, render a list, and decide whether the config lives inline or in its own file.",
        es: "Conecta el provider una vez en la raíz de la app, renderiza una lista y decide si la configuración vive en línea o en su propio archivo.",
      },
      headings: [
        "Usage",
        "1. Wire the provider (once, at the app root)",
        "2. Render a list",
        "Organizing the config: file vs inline",
      ],
    },
    {
      slug: "filtering-and-sorting",
      title: { en: "Filtering and sorting", es: "Filtros y ordenamiento" },
      description: {
        en: "Advanced filters, default filter values, column sorting, quick filters and pinned filter chips.",
        es: "Filtros avanzados, valores por defecto, ordenamiento por columna, filtros rápidos y chips de filtro fijados.",
      },
      headings: [
        "Advanced filters",
        "Default filter values",
        "Column sorting",
        "Quick filters",
        "Pinned filter chips",
      ],
    },
    {
      slug: "export",
      title: { en: "Export", es: "Exportación" },
      description: {
        en: "CSV export out of the box, and a configurable export contract for scope, fields and column order.",
        es: "Exportación CSV lista para usar, y un contrato de exportación configurable para alcance, campos y orden de columnas.",
      },
      headings: ["CSV export", "Configurable export (scope, fields, order)"],
    },
    {
      slug: "table-and-layout",
      title: { en: "Table and layout", es: "Tabla y layout" },
      description: {
        en: "Sticky headers, density, column reorder and resize, per-column sizing and truncation, scroll affordances and the pagination bar.",
        es: "Encabezados fijos, densidad, reordenar y redimensionar columnas, tamaño y truncado por columna, indicadores de scroll y la barra de paginación.",
      },
      headings: [
        "Table & layout defaults",
        "Table UX: sticky header, density, reorder, resize",
        "Column sizing & truncation",
        "Scroll affordances",
        "Pagination bar: fixed vs sticky",
      ],
    },
    {
      slug: "actions-and-selection",
      title: { en: "Row actions and selection", es: "Acciones y selección" },
      description: {
        en: "Row action menus and quick bars, row selection, bulk actions, and selecting every result that matches the current query.",
        es: "Menús y barras rápidas de acciones por fila, selección de filas, acciones masivas y seleccionar todos los resultados que coinciden con la consulta actual.",
      },
      headings: [
        "Row actions",
        "Row selection & bulk actions",
        "Selecting every matching result",
      ],
    },
    {
      slug: "cards",
      title: { en: "Cards", es: "Tarjetas" },
      description: {
        en: "Get a cards view without writing a card, then take over rendering with custom cards or drop to a fully bare card.",
        es: "Obtén una vista de tarjetas sin escribir una tarjeta, luego toma el control con tarjetas personalizadas o baja a una tarjeta totalmente libre.",
      },
      headings: [
        "Cards without writing a card",
        "Custom cards with actions and theme",
        "Fully custom cards (`bareCard`)",
      ],
    },
    {
      slug: "data-and-backends",
      title: { en: "Data and backends", es: "Datos y backends" },
      description: {
        en: "Server-side data adapters plus ready-made list executors for PostgreSQL, MongoDB and Mongoose.",
        es: "Adaptadores de datos del lado del servidor más ejecutores de lista listos para PostgreSQL, MongoDB y Mongoose.",
      },
      headings: [
        "Async data (server-side)",
        "PostgreSQL backend (`listkit/sql`)",
        "MongoDB backend (`listkit/mongo`)",
        "Mongoose executor (`listkit/mongoose`)",
      ],
    },
    {
      slug: "ssr-and-caching",
      title: { en: "SSR and caching", es: "SSR y caché" },
      description: {
        en: "Hydrate from server-rendered data, cut Next.js boilerplate, and use the zero-dependency cache or TanStack Query.",
        es: "Hidrata desde datos renderizados en el servidor, reduce el boilerplate de Next.js y usa la caché sin dependencias o TanStack Query.",
      },
      headings: [
        "Server-side rendering (`initialData`)",
        "Less boilerplate (Next.js)",
        "Built-in cache (zero dependencies)",
        "The list id identifies the dataset, not the view",
        "Refreshing after a mutation",
        "Using with TanStack Query",
      ],
    },
    {
      slug: "examples",
      title: { en: "Complete examples", es: "Ejemplos completos" },
      description: {
        en: "Two end-to-end lists, one on the built-in cache and one on React Query, with nothing left out.",
        es: "Dos listas completas de principio a fin, una con la caché integrada y otra con React Query, sin omitir nada.",
      },
      headings: [
        "Complete example — without React Query (built-in cache)",
        "Complete example — with React Query",
      ],
    },
    {
      slug: "theming",
      title: { en: "Theming and labels", es: "Theming y textos" },
      description: {
        en: "Built-in palettes, surface tones, class-driven dark mode, and replacing every built-in string for i18n.",
        es: "Paletas integradas, tonos de superficie, modo oscuro dirigido por clase y reemplazo de cada texto integrado para i18n.",
      },
      headings: ["Theming", "Table & card tones", "Dark mode", "Labels (i18n)"],
    },
    {
      slug: "reference",
      title: { en: "Reference", es: "Referencia" },
      description: {
        en: "Subpath exports, diagnostics, keyboard shortcuts, saved view preferences, optimized images and the remaining options.",
        es: "Exports por subpath, diagnósticos, atajos de teclado, preferencias de vista guardadas, imágenes optimizadas y el resto de opciones.",
      },
      headings: [
        "Diagnostics",
        "Empty state",
        "Keyboard shortcuts",
        "Saved view preferences",
        "Optimized images (`ListImage`)",
        "Opening sort (`defaultSort`)",
        "Subpath Exports",
        "License",
      ],
    },
  ],
};
