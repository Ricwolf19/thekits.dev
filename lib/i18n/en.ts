export const en = {
  "nav.docs": "Docs",
  "nav.playground": "Playground",
  "nav.releases": "Releases",
  "nav.packages": "Packages",
  "nav.home": "Home",

  "common.getStarted": "Get started",
  "common.readDocs": "Read the docs",
  "common.viewGithub": "View on GitHub",
  "common.viewNpm": "View on npm",
  "common.install": "Install",
  "common.copy": "Copy",
  "common.copied": "Copied",
  "common.version": "Version",
  "common.downloads": "Downloads / month",
  "common.license": "License",

  "hub.title": "Two kits for React apps",
  "hub.subtitle":
    "Open-source TypeScript libraries for the parts of an app everyone rewrites: data lists and file uploads.",
  "hub.explore": "Explore the kits",

  "docs.onThisPage": "On this page",
  "docs.previous": "Previous",
  "docs.next": "Next",
  "docs.editOnGithub": "Edit this page on GitHub",
  "docs.generatedFrom":
    "This page is generated from the package README at version {version}.",

  "playground.title": "Playground",
  "playground.subtitle": "Every example runs the published package.",

  "releases.title": "Releases",
  "releases.subtitle": "Every version, straight from GitHub Releases.",
  "releases.published": "Published {date}",

  "footer.builtBy": "Built by {author}",
  "footer.sourceCode": "Source code",

  "lang.switch": "Switch language",
  "lang.en": "English",
  "lang.es": "Español",
} as const;

export type TranslationKey = keyof typeof en;
