import GithubSlugger from "github-slugger";

/**
 * Derives a README's structure without frontmatter: hero before the first `##`,
 * table of contents in the first `##` section, content after. Positional rather
 * than title-based, so it works on `## Tabla de contenidos` too.
 * @see AGENTS.md#readme-docs-pipeline
 */

export type Heading = {
  /** 1 for `#`, 2 for `##`, … */
  readonly level: number;
  readonly text: string;
  /** GitHub-compatible anchor, so in-file `](#…)` links still resolve. */
  readonly slug: string;
  /** 1-based line number in the source file. */
  readonly line: number;
};

export type Section = {
  readonly heading: Heading;
  /** Raw markdown between this heading and the next one, trimmed. */
  readonly body: string;
};

export type ParsedReadme = {
  readonly title: string;
  /** The bold one-liner under the title. */
  readonly tagline: string;
  /** The sentence under the tagline, if present. */
  readonly summary: string;
  /** Content sections, hero and table of contents removed. */
  readonly sections: readonly Section[];
};

const FENCE = /^\s*(```|~~~)/;
const HEADING = /^(#{1,6})\s+(.+?)\s*#*$/;
const BOLD_LINE = /^\*\*(.+?)\*\*\s*$/;

/** Fence state per line, so the heading scan and the body slicer agree. */
const fenceMask = (lines: readonly string[]): boolean[] => {
  const mask: boolean[] = [];
  let open: string | null = null;
  for (const line of lines) {
    const match = FENCE.exec(line);
    if (open) {
      mask.push(true);
      if (match && line.trim().startsWith(open)) open = null;
      continue;
    }
    if (match) {
      open = match[1];
      mask.push(true);
      continue;
    }
    mask.push(false);
  }
  return mask;
};

/** All headings outside fenced code, in document order. */
export const scanHeadings = (markdown: string): Heading[] => {
  const lines = markdown.split("\n");
  const inCode = fenceMask(lines);
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  lines.forEach((line, i) => {
    if (inCode[i]) return;
    const match = HEADING.exec(line);
    if (!match) return;
    const text = match[2].trim();
    headings.push({
      level: match[1].length,
      text,
      slug: slugger.slug(text),
      line: i + 1,
    });
  });

  return headings;
};

/** Drops a trailing horizontal rule, which separates `##` groups in the source. */
const trimRule = (body: string): string =>
  body.replace(/\n+---\s*$/, "").trimEnd();

export const parseReadme = (markdown: string): ParsedReadme => {
  const lines = markdown.split("\n");
  const inCode = fenceMask(lines);
  const headings = scanHeadings(markdown);

  const h1 = headings.find((h) => h.level === 1);
  if (!h1) throw new Error("README has no H1");

  const firstH2Index = headings.findIndex((h) => h.level === 2);
  if (firstH2Index === -1) throw new Error("README has no `##` section");

  // Tagline: the first bold-only line between the H1 and the first `##`.
  const heroEnd = headings[firstH2Index].line - 1;
  let tagline = "";
  let summary = "";
  for (let i = h1.line; i < heroEnd; i += 1) {
    if (inCode[i]) continue;
    const match = BOLD_LINE.exec(lines[i].trim());
    if (!match) continue;
    tagline = match[1].trim();
    const next = (lines[i + 1] ?? "").trim();
    // The line after the tagline is prose only if it is not a badge row,
    // the language switcher, or the end of the centered block.
    if (
      next &&
      !next.startsWith("[!") &&
      !next.startsWith("<") &&
      !/^\[?.?..?\s?(English|Español)/u.test(next)
    ) {
      summary = next;
    }
    break;
  }

  // Everything from the second `##` onward. The first is the table of contents.
  const content = headings.slice(firstH2Index + 1);
  const sections: Section[] = content.map((heading, i) => {
    const next = content[i + 1];
    const from = heading.line; // heading.line is 1-based; body starts after it
    const to = next ? next.line - 1 : lines.length;
    return { heading, body: trimRule(lines.slice(from, to).join("\n").trim()) };
  });

  return { title: h1.text, tagline, summary, sections };
};

/**
 * Rewrites the links that break once one README becomes many pages. Either
 * resolver returns `null` to leave a link alone.
 */
export const rewriteLinks = (
  markdown: string,
  resolve: (anchor: string) => string | null,
  resolveFile: (path: string) => string | null,
): string =>
  markdown
    .replace(/\]\(#([^)]+)\)/g, (match, anchor: string) => {
      const target = resolve(anchor);
      return target ? `](${target})` : match;
    })
    .replace(/\]\((\.\/[^)]+)\)/g, (match, path: string) => {
      const target = resolveFile(path);
      return target ? `](${target})` : match;
    });

/** Truncate on a word boundary — meta descriptions are cut at ~160 chars. */
export const clamp = (text: string, max = 160): string => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};
