import { Card, Cards } from "fumadocs-ui/components/card";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  FileText,
  GitBranch,
  Github,
  Globe,
  Layers,
  Play,
} from "lucide-react";
import Link from "next/link";

import { Faq } from "@/components/layout/Faq";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { InstallCommand } from "@/components/ui/InstallCommand";
import { NpmIcon } from "@/components/ui/NpmIcon";
import { PackageIcon } from "@/components/ui/PackageIcon";
import { getAllContent } from "@/lib/content/fetch";
import { createT, type Locale } from "@/lib/i18n/config";
import { routePath } from "@/lib/i18n/routes";
import { navLinks, navTitle } from "@/lib/nav";
import { personSchema, websiteSchema } from "@/lib/schema";
import { PACKAGE_IDS, PACKAGES, site } from "@/lib/site";

const PRINCIPLES = [
  { id: "contract", icon: GitBranch },
  { id: "headless", icon: Layers },
  { id: "ssr", icon: Boxes },
  { id: "i18n", icon: Globe },
] as const;

const HOW = [
  { id: "readme", icon: FileText },
  { id: "playground", icon: Play },
  { id: "releases", icon: Github },
] as const;

const SECTION = "border-fd-border border-t";
const INNER = "mx-auto w-full max-w-6xl px-6 py-20";

export const Hub = async ({ locale }: { locale: Locale }) => {
  const t = createT(locale);
  const packages = await getAllContent();
  const [first] = PACKAGE_IDS;
  const pill =
    "border-fd-border hover:border-fd-primary hover:text-fd-primary btn-lift inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium";

  return (
    <HomeLayout
      nav={{
        title: navTitle,
        url: routePath({ kind: "home" }, locale),
        enableHoverToOpen: true,
      }}
      links={navLinks(locale, { kind: "home" })}
      themeSwitch={{ mode: "light-dark" }}
      className="flex-1"
    >
      <JsonLd data={[personSchema(), websiteSchema(locale)]} />

      <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-16">
        <p className="text-fd-primary font-display text-sm font-medium">
          {t("hub.eyebrow")}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {t("hub.title")}
        </h1>
        <p className="text-fd-muted-foreground mt-6 max-w-3xl text-lg leading-relaxed">
          {t("hub.subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={routePath({ kind: "package", pkg: first }, locale)}
            className="bg-fd-primary text-fd-primary-foreground btn-lift hover:shadow-fd-primary/25 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium hover:shadow-lg"
          >
            {t("common.getStarted")} <ArrowRight className="size-4" />
          </Link>
          {/* This site's own repository — the nav's GitHub icon is the
              author profile, this button is "the source of what you are
              looking at". */}
          <a
            href={site.repo}
            className="border-fd-border hover:border-fd-primary btn-lift inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium"
          >
            <Github className="size-4" /> {t("footer.sourceCode")}
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <p className="text-fd-muted-foreground mb-3 text-sm">
          {t("common.installWith")}
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {packages.map((c) => (
            <div key={c.id}>
              <p className="font-display text-fd-muted-foreground mb-2 text-xs">
                {c.id}
              </p>
              <InstallCommand locale={locale} pkg={PACKAGES[c.id].npmName} />
            </div>
          ))}
        </div>
      </section>

      <section className={SECTION}>
        <div className={INNER}>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("hub.kitsTitle")}
          </h2>
          <p className="text-fd-muted-foreground mt-3 max-w-2xl">
            {t("hub.kitsSubtitle")}
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {packages.map((c) => {
              const readme = c.readme[locale];
              const info = PACKAGES[c.id];
              return (
                <article
                  key={c.id}
                  className="border-fd-border hover:border-fd-primary/40 btn-lift flex flex-col rounded-xl border p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-fd-primary/10 text-fd-primary grid size-10 place-items-center rounded-lg">
                        <PackageIcon className="size-5" id={c.id} />
                      </span>
                      <h3 className="font-display text-xl font-semibold">
                        {c.id}
                      </h3>
                    </div>
                    <span className="text-fd-muted-foreground font-mono text-xs">
                      v{c.version} · {t("common.license")}
                    </span>
                  </div>
                  <p className="mt-5 text-lg font-medium">{readme.tagline}</p>
                  <p className="text-fd-muted-foreground mt-2 text-sm leading-relaxed">
                    {readme.summary}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <Link
                      href={routePath({ kind: "package", pkg: c.id }, locale)}
                      className={pill}
                    >
                      <BookOpen className="size-3.5" /> {t("nav.docs")}
                    </Link>
                    <Link
                      href={routePath(
                        { kind: "playground", pkg: c.id },
                        locale,
                      )}
                      className={pill}
                    >
                      <Play className="size-3.5" /> {t("nav.playground")}
                    </Link>
                    <a href={info.repo} className={pill}>
                      <Github className="size-3.5" /> GitHub
                    </a>
                    <a href={info.npm} className={pill}>
                      <NpmIcon className="size-3.5" /> npm
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={SECTION}>
        <div className={INNER}>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("hub.principlesTitle")}
          </h2>
          <Cards className="mt-10">
            {PRINCIPLES.map(({ id, icon: Icon }) => (
              <Card
                key={id}
                icon={<Icon />}
                title={t(`hub.principle.${id}.title`)}
                description={t(`hub.principle.${id}.body`)}
                className="h-full"
              />
            ))}
          </Cards>
        </div>
      </section>

      <section className={SECTION}>
        <div className={INNER}>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("hub.howTitle")}
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {HOW.map(({ id, icon: Icon }, i) => (
              <li key={id} className="flex gap-4">
                <span className="bg-fd-primary/10 text-fd-primary grid size-9 shrink-0 place-items-center rounded-lg">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="font-display text-fd-muted-foreground text-xs">
                    0{i + 1}
                  </p>
                  <h3 className="mt-1 font-semibold">
                    {t(`hub.how.${id}.title`)}
                  </h3>
                  <p className="text-fd-muted-foreground mt-2 text-sm leading-relaxed">
                    {t(`hub.how.${id}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={SECTION} id="faq">
        <div className="mx-auto w-full max-w-3xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("faq.title")}
          </h2>
          <p className="text-fd-muted-foreground mt-3">{t("faq.subtitle")}</p>
          <div className="mt-8">
            <Faq locale={locale} />
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} width="max-w-6xl" />
    </HomeLayout>
  );
};
