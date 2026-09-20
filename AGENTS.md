# AGENTS.md

## 1. What this is

`thekits.dev` — the documentation site for two published npm packages, `listkit`
and `uploaderkit`. Next 16 App Router, React 19, Tailwind v4, Fumadocs for the
docs shell, deployed on Vercel.

It does not hold a copy of the documentation. Every docs page is **generated at
build time from the packages' published READMEs**, in English and Spanish, so
npm, GitHub and this site cannot disagree. See
[README](./README.md) for the reader-facing overview.

## 2. How to work here

Read before writing. Make the smallest change that works. Match the surrounding
style. Run the gates before claiming done. Respect the invariants in §8 — most
of them encode a failure that already happened once.

Adding documentation is **not** done here: edit the package's README, then add
the new section to that package's manifest in `content/`. The build tells you if
you forgot.

## 3. Layout

```
app/
  (en)/                 English tree, unprefixed. Its own root layout.
    [pkg]/layout.tsx    The docs shell — wraps overview, docs, playground, releases
  es/                   Spanish tree under /es. Its own root layout.
  api/playground/       Upload route for the uploaderkit demo (see §5)
  sitemap.ts robots.ts  Hand-rolled; Fumadocs ships no SEO layer
components/
  layout/               SiteFooter, FeatureGrid, Faq
  pages/                Locale-aware page bodies, one per route kind
  playground/           DemoCase shell + one file per gallery case
  ui/                   InstallCommand (pm tabs + copy), NpmIcon, PackageIcon
  mdx/ seo/ shell/      Renderer, JSON-LD, html shell + locale toggle
content/
  listkit.map.ts        README section → docs page manifests
  uploaderkit.map.ts
lib/
  content/              The generation pipeline (§5)
  i18n/                 Dictionaries, descriptor routing, locale codes
  routes/               Route-segment exports shared by both trees
  playground/           Demo scopes, in-memory storage, caseSource
  nav.tsx               One nav definition, shared by both layouts
  search/               Index builder + dialog suggestions
  seo.ts schema.ts site.ts releases.ts metadata.ts utils.ts
```

## 4. Commands

| Command                   | What it does                                        |
| ------------------------- | --------------------------------------------------- |
| `bun dev`                 | Dev server. Needs `CONTENT_LOCAL_ROOT` (see §9)     |
| `bun run build`           | Production build. Fetches READMEs from release tags |
| `bun run test`            | Vitest                                              |
| `bun run typecheck`       | `tsc --noEmit`                                      |
| `bun run lint` / `format` | eslint / prettier check                             |
| `bun run content:check`   | Can the _published_ packages build the docs?        |
| `bun run verify`          | format, lint, typecheck, test, build — what CI runs |

## 5. Patterns & architecture

Fumadocs owns the docs shell (page tree, sidebar, search, TOC, Shiki). This repo
owns the entire SEO layer, ported from `metri.info` and `ricardotapia.dev`.

### README docs pipeline

`lib/content/` turns two published READMEs into 23 manifest sections × 2
locales. Two of them are the overviews, which render at `/<pkg>` instead of as
docs pages, so 21 docs pages are emitted per locale.

- **Source is GitHub raw at the release tag**, resolved from npm's
  `dist-tags.latest`. npm is asked only for the version: its packument carries a
  `readme` field that **truncates at 65,536 bytes**, and listkit's README is
  88,687, so that copy stops mid-sentence.
- **Structure is positional, not title-based**, so it works on
  `## Tabla de contenidos`. Everything before the first `##` is hero chrome; the
  first `##` section is the hand-written TOC and is dropped.
- **Headings are scanned outside fenced code only.** Both READMEs contain
  `# peers` inside a bash fence.
- **Pages claim sections by English heading text, never by index.** An
  index-based manifest keeps validating after an upstream insertion while
  silently shifting every later page's content.
- **Spanish resolves positionally** from the same indices, because translated
  heading text cannot be the join key. Parity is asserted first.

The build fails, by design, on any of: a README heading no page claims, a page
claiming a heading that no longer exists, two pages claiming one heading, a
duplicate page slug, or an EN/ES structural mismatch.

### Bilingual routing

Explicit EN/ES route trees — `app/(en)` and `app/es` — with **no `[locale]`
segment, no middleware and no next-intl**. That is what keeps every page
statically generated. There is no `app/layout.tsx`: a shared ancestor would have
to hardcode one `lang`, so each tree owns a root layout and both render
`components/shell/RootHtml.tsx`.

Routing is **descriptor-driven** (`lib/i18n/routes.ts`): a page passes one
`RouteDescriptor` and both locale URLs are derived from it, so a canonical and
its hreflang alternate cannot disagree. `app/sitemap.ts` uses the same
`hreflangMap` the pages use.

Only `releases` → `versiones` is translated. `docs` and `playground` stay
English — the loanwords Spanish technical writing uses. Doc slugs are shared
across locales.

### One shell per package

Every package route renders inside `DocsShell` (`app/**/[pkg]/layout.tsx`):
overview, docs, playground and releases share one chrome and one persistent
sidebar, so navigation is never lost by moving between sections. Playground and
Releases are appended to the page tree as `type: "page"` nodes — they are real
routes, not generated pages, but they are sections of the package, not a detour.

`lib/nav.tsx` defines the bar once and both `HomeLayout` (hub) and `DocsLayout`
(packages) consume it, so the chrome never changes shape. Each package is a
hover-to-open `menu` scoped to `on: "nav"`, paired with an `on: "menu"` plain
link so small screens still reach both packages. Inside the shell the switcher
is the sidebar's own `tabs` — exactly one control for that job.

**The overview lives at `/<pkg>`, never at `/<pkg>/docs/overview`.** Its README
section is still claimed by the manifest so the parity checks cover it, but
`OVERVIEW_SLUG` is filtered out of the emitted docs pages, the static params and
the sitemap. Rendering it in both places would put one README section at two
URLs.

### Search

`app/api/search/route.ts` serves `createI18nSearchAPI("advanced", …)` over
indexes built in `lib/search/index.ts` from the same generated content the pages
render, so a result can never point at a section that is not on the page. It
covers the generated docs **and** the routes that are not generated — overview,
playground, releases, the hub — because a search that only sees the docs tree
reads as broken.

Pages are split one entry per heading, so a hit deep-links to the section rather
than the top of a 2,000-word page. `lib/search/suggestions.ts` fills the dialog
before anything is typed.

The index builder calls `loadAllContent`, the **uncached** loader: `"use cache"`
is only valid inside the App Router's work store and the route builds its index
at module init, outside it.

### Playground gallery

`components/pages/PlaygroundPage.tsx` renders a curated set of cases per
package (5 listkit, 9 uploaderkit), each through `DemoCase`: a Preview / Source
tab pair. Source is the case's **real file**, read at build by
`lib/playground/caseSource.ts` and highlighted through the docs pipeline — a
hand-maintained snippet would drift. The reader is statically scoped to
`components/playground`, which is what keeps Next's file tracer from bundling
the whole project.

Cases that draw their own bordered surface set `bare`, so `DemoCase` adds no
padding — every listkit case does, and without it the preview was a box inside a
box. The panel scrolls horizontally rather than clipping: a data table beside a
result panel is legitimately wider than a phone. Result panels sit beside the
demo only from `@3xl` up; below that they stack, because a fixed two-column
split squeezed both halves unreadable on a phone.

Previews follow the site theme. listkit ships additive `dark:` variants and
registers `@custom-variant dark` itself. uploaderkit ships **no** `dark:` rules
at all but is driven entirely by `--color-ui-*`, which its README documents as
the rebrand surface — `app/global.css` redeclares those under `.dark` to give it
a dark mode. An earlier forced-light island is gone.

uploaderkit cases use `createFakeStrategy` (ported from the package's own
playground): a simulated transport that ticks progress, honours abort and can
fail on demand, so retry and validation are demonstrable without a server.
Exactly one case (`ServerCase`) posts to the real route handler below.

A case's **title and one-line description** live in `lib/i18n/{en,es}.ts` under
`playground.case.*` — they are site chrome, rendered by `DemoCase`, and
`PlaygroundPage` derives its `CaseId` from those keys so a case with no copy is
a type error.

Copy **inside** a demo — column headers, filter labels, result text — stays in a
local `COPY` map in the case file. This is the one place the `lib/i18n`
convention is deliberately not followed: the Source tab shows the file verbatim,
and a reader copying it should get readable strings, not `t()` calls against a
dictionary they do not have.

Non-docs pages build a real `toc` (playground from its case list, releases from
its versions, overview from its sections) instead of passing `full`, so the
right rail matches every other page.

### Design tokens

Accent is the portfolio's cyan: `--color-fd-primary` `#0e7490` light /
`#06b6d4` dark, overriding Fumadocs' neutral in `app/global.css`. A base layer
gives every control `cursor: pointer` (browsers default `<button>` to `default`,
which reads as disabled beside a real link) and `.btn-lift` supplies the shared
hover lift, disabled under `prefers-reduced-motion`. Fonts are
Inter for running text and JetBrains Mono for headings, labels and code, via
`next/font/google` in `RootHtml`. Icons are lucide-react; npm has no lucide
glyph, so `components/ui/NpmIcon.tsx` is the one hand-drawn SVG. reactbits Pro
was considered and not used: it is a paid library and Fumadocs' `Card`,
`CodeBlock`, `Tabs` and `Steps` cover the same needs.

### Playground upload endpoint

`app/api/playground/storage/[scope]/[entityId]/upload` is **deliberately
unauthenticated**. The provider is in-memory so nothing survives the invocation,
there are no credentials and no bucket, and the scopes cap size and extension on
both sides. It is not a data-exposure surface.

The exposure is invocation volume. An app-level limiter cannot fix that — the
function must already be running to reject a request — so that control belongs
at Vercel's edge (WAF / rate limiting, configured per project), not in this code.

## 6. Conventions

Two-space indent, double quotes, semicolons, prettier-enforced. `type` over
`interface`, always. Arrow functions, no classes. Shared components carry a
short doc comment so they are findable. Comments explain _why_; anything that
narrates what the code says gets deleted.

`null` means "deliberately empty"; `undefined` means "absent". The link
resolvers in `lib/content/parse.ts` return `null` for "leave this alone".

## 7. Release and deploy

Vercel, on push to `main`. `NEXT_PUBLIC_SITE_URL` must be the apex
(`https://thekits.dev`) — canonicals pointing at a host that redirects waste
every signal. Optional: `NEXT_PUBLIC_GA_ID`, `GOOGLE_SITE_VERIFICATION`.

## 8. Invariants (do not break without flagging)

| Rule                                                         | Why                                                                                                                                        | Instead                                |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `cacheComponents: true` stays on                             | `"use cache"` in `app/sitemap.ts`, `lib/content/fetch.ts` and `components/mdx/MarkdownBody.tsx` depends on it                              | —                                      |
| Never add `dynamicParams`                                    | Incompatible with `cacheComponents`; the build fails                                                                                       | Guard with `isPackageId` in the layout |
| `MarkdownBody` stays a Cache Component                       | Shiki reads the clock, which `cacheComponents` forbids outside a cache scope                                                               | —                                      |
| Root layouts declare no `alternates`                         | Inherited, a canonical points every page at the home URL                                                                                   | `pageMetadata` per page                |
| Heading shift is computed once (`headingShift`)              | Two copies drifting makes rewritten `#fragment` links point at ids that do not exist — silently                                            | —                                      |
| Anchors use `github-slugger` (`rehype-slug`)                 | The cross-page anchor index was built with it; another slugger breaks every rewritten link                                                 | —                                      |
| `ListSkeleton` imports from `listkit/server`                 | The main entry pulls client context and crashes the RSC render                                                                             | —                                      |
| Routes not yet built stay `false` in `ROUTE_READY`           | It gates the sitemap _and_ the nav together; a sitemap listing a 404 spends crawl budget teaching Google the page is broken                | Flip the flag when the route lands     |
| No new locale URL built by string surgery                    | A prefix swap cannot know `releases` is `versiones`; it 404s                                                                               | `routePath` / `alternatePath`          |
| Fumadocs CSS imports unprefixed                              | `prefix()` namespaces the theme's own utilities and breaks them                                                                            | —                                      |
| `DemoCase` tabs carry `forceMount`                           | An inactive Radix panel is never rendered, and a Server Component child that never renders is never refetched — the Source tab opens empty | —                                      |
| Nav package menus carry `on: "nav"`                          | An unscoped item also renders into the mobile sidebar, under the sidebar's own switcher, listing both names twice                          | Pair with an `on: "menu"` link         |
| Sidebar `tabs` carry no `description`                        | It repeated the title verbatim, so the switcher read the package name twice                                                                | —                                      |
| Demo splits use `@container`, never `lg:`/`xl:`              | Viewport breakpoints match window width, but these render in a narrow shell column — the panel split early and clipped off the edge        | `@3xl:` on an `@container` parent      |
| The overview is not an emitted docs page                     | It would put one README section at `/<pkg>` and `/<pkg>/docs/overview`                                                                     | Filter on `OVERVIEW_SLUG`              |
| `InstallCommand` keeps local state                           | Fumadocs' `CodeBlockTabs` with a shared `groupId` syncs every block on the page, so switching one switched the other                       | —                                      |
| uploaderkit's `--color-ui-*` have `.dark` values             | It ships no `dark:` rules; without the overrides it is dark text on white under the dark theme                                             | —                                      |
| Search indexes use `loadAllContent`                          | `"use cache"` is invalid at module init, where the search route builds its index                                                           | —                                      |
| Nav GitHub/npm point at the author profiles                  | Per-repository links belong on the package pages; the bar is "who makes this"                                                              | `author.github` / `author.npm`         |
| `caseSource` only reads under `components/playground`        | A dynamic `path.join(process.cwd(), …)` makes Turbopack trace the whole repo                                                               | Keep cases in that folder              |
| `caseSource`'s guard compares against `CASES_DIR + path.sep` | Without the separator a sibling such as `components/playgroundX` satisfies `startsWith` and escapes the scope                              | Covered by `caseSource.test.ts`        |
| Package sections come from `packageSections`                 | It is where `ROUTE_READY` is applied; building the nodes inline is how the sidebar and the dropdown once linked ungated routes             | `lib/nav.tsx`                          |

## 9. Environment

macOS or Linux, Node 22+, Bun. **The filesystem on macOS is case-insensitive** —
renaming a file by case only needs two `git mv` steps.

`CONTENT_LOCAL_ROOT` points the pipeline at checked-out sibling package repos
instead of the network (`<root>/<pkg>/packages/<pkg>/README.md`). It exists
because a README change is only fetchable once a release is cut. It is currently
**required** for local builds: listkit 5.0.0 predates the translated Spanish
`Labels (i18n)` section, so `assertParity` correctly refuses it. Once
listkit 5.0.1 publishes, drop `.env.local` and confirm a clean network build —
otherwise the escape hatch quietly becomes load-bearing.

## 10. Anti-patterns

Do not hand-copy documentation into this repo. Do not add a local `COPY` map to
a component when `lib/i18n` is the convention — `components/playground` is the
one exception, and §5 says why. Do not add middleware. Do not
reach for `next-intl`. Do not hardcode a repo owner, an npm URL or a locale code
— `lib/site.ts` and `lib/i18n/localeCodes.ts` own those. Do not add a route to
the sitemap before the route exists.
