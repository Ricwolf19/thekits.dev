import { Accordion, Accordions } from "fumadocs-ui/components/accordion";

import { JsonLd } from "@/components/seo/JsonLd";
import { createT, type Locale } from "@/lib/i18n/config";

/** Question ids; copy lives in the dictionaries under `faq.<id>.q|a`. */
const IDS = [
  "origin",
  "why",
  "production",
  "contribute",
  "together",
  "stack",
] as const;

/**
 * FAQ with `FAQPage` structured data. Google only honours the markup when the
 * answers are visible on the page, which they are — the accordion collapses
 * them, it does not remove them.
 */
export const Faq = ({ locale }: { locale: Locale }) => {
  const t = createT(locale);
  const items = IDS.map((id) => ({
    id,
    q: t(`faq.${id}.q`),
    a: t(`faq.${id}.a`),
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: locale,
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <Accordions type="single">
        {items.map((item) => (
          <Accordion key={item.id} id={item.id} title={item.q}>
            <p className="text-fd-muted-foreground leading-relaxed">{item.a}</p>
          </Accordion>
        ))}
      </Accordions>
    </>
  );
};
