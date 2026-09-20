import { createT, type Locale } from "@/lib/i18n/config";
import { author } from "@/lib/site";

/** Byline footer, shared by the hub and the package landings. */
export const SiteFooter = ({
  locale,
  width = "max-w-5xl",
}: {
  locale: Locale;
  width?: string;
}) => {
  const t = createT(locale);
  return (
    <footer
      className={`border-fd-border text-fd-muted-foreground mx-auto w-full ${width} border-t px-6 py-8 text-sm`}
    >
      {t("footer.builtBy", { author: author.name })}{" "}
      <a className="underline underline-offset-2" href={author.url}>
        {author.url.replace("https://", "")}
      </a>
    </footer>
  );
};
