<div align="center">

<img src="public/logo.svg" alt="" width="84" height="84">

# thekits.dev

Docs, playgrounds and releases for
[listkit](https://github.com/Ricwolf19/listkit) and
[uploaderkit](https://github.com/Ricwolf19/uploaderkit) — open-source TypeScript
kits for React apps.

**[thekits.dev](https://thekits.dev)**

</div>

---

**Contents** — [Why this exists](#why-this-exists) · [How the content works](#how-the-content-works) · [Architecture](#architecture) · [Routes](#routes) · [Development](#development) · [License](#license)

---

## Why this exists

Both packages ship long, maintained READMEs in English and Spanish. That is good
documentation in a bad container: nothing to rank in search, no way to link from
npm, and no way to show either library actually running.

This site is the container. It does not fork the docs — it **generates them from
the READMEs at build time**, so npm, GitHub and the site can never disagree.

## How the content works

Each package's published README is the single source of truth.

```
registry.npmjs.org/<pkg>          → resolve the published version
raw.githubusercontent.com/…/<pkg>-<version>/packages/<pkg>/README.md
raw.githubusercontent.com/…/<pkg>-<version>/packages/<pkg>/README.es.md
```

Fetching the release tag rather than the default branch pins the docs to the
version people can actually install. The npm registry is deliberately **not**
the source: it truncates READMEs at 65,536 bytes, which silently cuts listkit's
in half.

A manifest per package (`content/<pkg>.map.ts`) groups README sections into
pages. The build fails if a heading is left unmapped, if the English and Spanish
files fall out of structural parity, or if a cross-reference anchor no longer
resolves. That is what keeps "the README is the source of truth" true rather
than aspirational.

To document a new feature, edit the package's README. Nothing here needs to
change unless you added a section, in which case the build will tell you.

## Architecture

| Layer                                                        | Owner     |
| ------------------------------------------------------------ | --------- |
| Docs shell — page tree, sidebar, TOC, rendering, search UI   | Fumadocs  |
| Search index — every page in both locales, split per heading | This repo |
| Overview pages, hub, playground gallery, releases            | This repo |
| Sitemap, robots, JSON-LD, OG images, hreflang                | This repo |

Fumadocs ships no SEO layer on purpose, so that half is owned here. The
invariants that keep it correct live in
[AGENTS.md](./AGENTS.md#8-invariants-do-not-break-without-flagging).

## Routes

Bilingual with explicit route trees — English at the root, Spanish under `/es`,
no `[locale]` segment and no middleware, which is what keeps every page
statically generated.

| English               | Spanish                  | What it is         |
| --------------------- | ------------------------ | ------------------ |
| `/`                   | `/es`                    | Hub                |
| `/listkit`            | `/es/listkit`            | Overview           |
| `/listkit/docs/[…]`   | `/es/listkit/docs/[…]`   | 12 generated pages |
| `/listkit/playground` | `/es/listkit/playground` | Gallery, 5 cases   |
| `/listkit/releases`   | `/es/listkit/versiones`  | GitHub Releases    |

Both packages have the same shape; uploaderkit has 9 generated pages and 9
gallery cases. `ROUTE_READY` in `lib/site.ts` gates a route out of the sitemap
and the navigation together until its page exists.

## Development

Requires [Bun](https://bun.sh) and Node 22+.

```bash
bun install
bun dev
```

The content pipeline reads the packages' **published** READMEs, so a local build
needs either network access or `CONTENT_LOCAL_ROOT` pointing at checked-out
sibling package repos. `.env.local` is the usual home for both:

```bash
CONTENT_LOCAL_ROOT=/path/to/your/Dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Command                 | What it does                                         |
| ----------------------- | ---------------------------------------------------- |
| `bun dev`               | Dev server                                           |
| `bun run verify`        | format, lint, typecheck, test, build — what CI runs  |
| `bun run test`          | Vitest                                               |
| `bun run content:check` | Can the published packages build the docs right now? |

CI runs the same chain on every push and PR, plus a secrets scan. It builds from
the release tags with no `CONTENT_LOCAL_ROOT`, so a README change that is
committed but unreleased fails there rather than in production.

Agent and contributor conventions live in [AGENTS.md](./AGENTS.md).

## License

MIT © Ricardo Tapia
