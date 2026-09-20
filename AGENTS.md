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
  es/                   Spanish tree under /es. Its own root layout.
  api/playground/       Upload route for the uploaderkit demo (see §5)
  sitemap.ts robots.ts  Hand-rolled; Fumadocs ships no SEO layer
components/
  layout/               SiteHeader, SiteFooter, DocsIndexGrid
  pages/                Locale-aware page bodies, one per route kind
  playground/           Live demos, importing the packages from npm
  mdx/ seo/ shell/      Renderer, JSON-LD, html shell + locale toggle
content/
  listkit.map.ts        README section → docs page manifests
  uploaderkit.map.ts
lib/
  content/              The generation pipeline (§5)
  i18n/                 Dictionaries, descriptor routing, locale codes
  routes/               Route-segment exports shared by both trees
  playground/           Demo scopes + in-memory storage
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

`lib/content/` turns two published READMEs into 23 docs pages × 2 locales.

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

| Rule                                               | Why                                                                                                                         | Instead                                |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `cacheComponents: true` stays on                   | `"use cache"` in `app/sitemap.ts`, `lib/content/fetch.ts` and `components/mdx/MarkdownBody.tsx` depends on it               | —                                      |
| Never add `dynamicParams`                          | Incompatible with `cacheComponents`; the build fails                                                                        | Guard with `isPackageId` in the layout |
| `MarkdownBody` stays a Cache Component             | Shiki reads the clock, which `cacheComponents` forbids outside a cache scope                                                | —                                      |
| Root layouts declare no `alternates`               | Inherited, a canonical points every page at the home URL                                                                    | `pageMetadata` per page                |
| Heading shift is computed once (`headingShift`)    | Two copies drifting makes rewritten `#fragment` links point at ids that do not exist — silently                             | —                                      |
| Anchors use `github-slugger` (`rehype-slug`)       | The cross-page anchor index was built with it; another slugger breaks every rewritten link                                  | —                                      |
| `ListSkeleton` imports from `listkit/server`       | The main entry pulls client context and crashes the RSC render                                                              | —                                      |
| Routes not yet built stay `false` in `ROUTE_READY` | It gates the sitemap _and_ the nav together; a sitemap listing a 404 spends crawl budget teaching Google the page is broken | Flip the flag when the route lands     |
| No new locale URL built by string surgery          | A prefix swap cannot know `releases` is `versiones`; it 404s                                                                | `routePath` / `alternatePath`          |
| Fumadocs CSS imports unprefixed                    | `prefix()` namespaces the theme's own utilities and breaks them                                                             | —                                      |

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

Do not hand-copy documentation into this repo. Do not add middleware. Do not
reach for `next-intl`. Do not hardcode a repo owner, an npm URL or a locale code
— `lib/site.ts` and `lib/i18n/localeCodes.ts` own those. Do not add a route to
the sitemap before the route exists.
