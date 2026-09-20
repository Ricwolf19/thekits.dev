export const en = {
  "nav.docs": "Documentation",
  "nav.playground": "Playground",
  "nav.releases": "Releases",
  "nav.packages": "Packages",
  "nav.home": "Home",
  "nav.overview": "Overview",
  "nav.overviewHint": "Install, features and entry points",
  "nav.docsHint": "Guides generated from the README",
  "nav.playgroundHint": "Live examples of the published package",
  "nav.releasesHint": "Every version and its notes",

  "common.getStarted": "Get started",
  "common.viewGithub": "View on GitHub",
  "common.viewNpm": "View on npm",
  "common.install": "Install",
  "common.installWith": "Install with your package manager",
  "common.copy": "Copy",
  "common.copied": "Copied",
  "common.version": "Version",
  "common.prerelease": "Pre-release",
  "common.latest": "Latest",
  "common.license": "MIT license",
  "common.typescript": "TypeScript",

  "hub.eyebrow": "Open-source libraries for React applications",
  "hub.title": "Data lists and file uploads, solved once.",
  "hub.subtitle":
    "Two TypeScript kits for the parts of a product every team rebuilds: a configurable list view with search, filters, pagination and export, and a file-upload contract that the browser and the server validate against together.",
  "hub.kitsTitle": "The kits",
  "hub.kitsSubtitle":
    "Each package is published on npm under the MIT license, ships its own Tailwind v4 layer, and is documented in English and Spanish.",
  "hub.principlesTitle": "What they have in common",
  "hub.principle.contract.title": "One definition, both sides",
  "hub.principle.contract.body":
    "A list is a single config object; an upload scope is a single declaration. The client and the server read the same source, so nothing drifts six months later.",
  "hub.principle.headless.title": "Styled by default, headless on demand",
  "hub.principle.headless.body":
    "Use the shipped components with a Tailwind v4 theme, or drop to the hooks and primitives and bring your own design system.",
  "hub.principle.ssr.title": "Built for the App Router",
  "hub.principle.ssr.body":
    "Server-side rendering, route handlers and Next.js adapters are first-class, not an afterthought. Express is supported where a server is involved.",
  "hub.principle.i18n.title": "Every string is replaceable",
  "hub.principle.i18n.body":
    "Both kits ship English and Spanish label sets and accept overrides for any user-facing text.",
  "hub.howTitle": "How this site works",
  "hub.how.readme.title": "The README is the source of truth",
  "hub.how.readme.body":
    "Every documentation page here is generated at build time from the package's published README, in both languages. npm, GitHub and this site cannot disagree.",
  "hub.how.playground.title": "The playgrounds run the published package",
  "hub.how.playground.body":
    "Each demo imports the exact version on npm, the same way your application would. What you see is what you install.",
  "hub.how.releases.title": "Releases are pulled from GitHub",
  "hub.how.releases.body":
    "Every version, with its notes, straight from the repository's releases. Nothing is transcribed by hand.",

  "landing.installTitle": "Installation",
  "landing.featuresTitle": "Features",
  "landing.featuresSubtitle":
    "Everything the package ships, from its own README.",
  "landing.subpathsTitle": "Entry points",
  "landing.subpathsSubtitle":
    "Import only what you use; each subpath is tree-shaken independently.",
  "docs.onThisPage": "On this page",
  "docs.previous": "Previous",
  "docs.next": "Next",

  "playground.title": "Playground",
  "playground.subtitle":
    "Live demonstrations of the published package. Every example imports the exact version available on npm.",
  "playground.source": "Source",
  "playground.preview": "Preview",
  "playground.case.hello.title": "Overview",
  "playground.case.hello.description":
    "The complete list: search, filters, sorting, pagination, table and cards from one configuration.",
  "playground.case.filters.title": "Every filter type",
  "playground.case.filters.description":
    "Text, select, multi-select, boolean, number range and date range, each as a quick pill and in the sidebar.",
  "playground.case.cards.title": "Custom cards and theme",
  "playground.case.cards.description":
    "A brand theme outside the built-in palettes and a card renderer that receives the list context.",
  "playground.case.selection.title": "Row selection",
  "playground.case.selection.description":
    "Checkboxes, bulk actions, and selecting every matching result — including what a server would receive.",
  "playground.case.primitives.title": "Primitives only",
  "playground.case.primitives.description":
    "Table, Cards, Pagination and SearchInput driven by your own state, with no configuration or provider.",
  "playground.case.basic.title": "Single file",
  "playground.case.basic.description":
    "One dropzone, one file. Validation, upload and the stored descriptor the server returns.",
  "playground.case.multiple.title": "Multiple files",
  "playground.case.multiple.description":
    "Batch progress, per-file cancellation and a maximum file count enforced before anything is sent.",
  "playground.case.avatar.title": "Avatar preset",
  "playground.case.avatar.description":
    "The picture is the control: drop an image on it, it compresses to 512px and replaces the previous one.",
  "playground.case.gallery.title": "Gallery preset",
  "playground.case.gallery.description":
    "Tiles built from each file's own preview, with a full-screen viewer across the set.",
  "playground.case.validation.title": "Validation",
  "playground.case.validation.description":
    "Wrong extension, oversized file and a renamed file caught by its binary signature — all before upload.",
  "playground.case.retry.title": "Retry and concurrency",
  "playground.case.retry.description":
    "A simulated flaky network that fails twice per file; retry with backoff absorbs it, a concurrency cap queues the rest.",
  "playground.case.viewer.title": "File viewer on its own",
  "playground.case.viewer.description":
    "FileViewer with no uploader attached: images, PDFs and a fallback, reusable anywhere an app already has stored files.",
  "playground.case.headless.title": "Headless",
  "playground.case.headless.description":
    "No shipped UI at all: the hook drives a fully custom interface with its own progress ring and controls.",
  "playground.case.server.title": "Real server round trip",
  "playground.case.server.description":
    "This one posts to a route handler on this site backed by the in-memory provider. Nothing is persisted.",

  "releases.title": "Releases",
  "releases.subtitle":
    "Every published version, with its notes, from GitHub Releases.",
  "releases.published": "Released {date}",
  "releases.index": "Versions",
  "faq.title": "Frequently asked questions",
  "faq.subtitle": "The questions that come up most often about these packages.",
  "faq.origin.q": "Why does the version history start where it does?",
  "faq.origin.a":
    "Both packages began as internal solutions built for a company I work with, developed privately over several major versions. When the problems they solve turned out to be the same ones every React project runs into, I released them under the MIT license as independent open-source packages. The public history therefore starts at the point they became open source, not at the first line of code. The private lineage is not published, and these versions are maintained separately from it.",
  "faq.why.q": "Why open-source them at all?",
  "faq.why.a":
    "Two reasons. They are genuinely useful in my own projects, and keeping them public means they are documented, tested and released properly rather than copied between repositories. And a data list or an upload contract is work every team repeats; a maintained package saves that time for anyone who wants it.",
  "faq.production.q": "Are they production-ready?",
  "faq.production.a":
    "They run in production applications today, ship a full test suite, publish type declarations, and release through an automated pipeline with a changelog per version. They are also small, focused libraries maintained by one person in the open, so read the documentation and judge the fit for yourself.",
  "faq.contribute.q": "Can I report an issue or contribute?",
  "faq.contribute.a":
    "Yes. Issues and pull requests are welcome on each package's GitHub repository. Both were built to solve a concrete problem well rather than to cover every case, so a report describing the case you need is genuinely useful input.",
  "faq.together.q": "Do I need both packages?",
  "faq.together.a":
    "No. They share conventions and a design language but have no dependency on each other, and each is installed and used on its own.",
  "faq.stack.q": "What do they require?",
  "faq.stack.a":
    "React 18 or 19, TypeScript, and Tailwind CSS v4 for the styled layer. Both work with the Next.js App Router and with any React setup; uploaderkit additionally ships routers for Next.js and Express where a server is involved.",

  "footer.builtBy": "Built by {author}",
  "footer.sourceCode": "Site source",

  "lang.switch": "Switch language",
  "lang.en": "English",
  "lang.es": "Español",
} as const;

export type TranslationKey = keyof typeof en;
