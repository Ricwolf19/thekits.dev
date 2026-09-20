import type { Locale } from "./config";

/** BCP 47 per locale. Open Graph wants underscores, `Intl` wants hyphens. */
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_MX" };
export const INTL_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-MX" };
