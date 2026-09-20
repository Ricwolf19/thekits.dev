/**
 * Server-rendered JSON-LD. Emits a <script type="application/ld+json"> so search
 * engines get structured data in the initial HTML (no client JS needed).
 * Accepts an array so one tag can carry e.g. TechArticle + BreadcrumbList.
 */
export const JsonLd = ({ data }: { data: object | object[] }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
