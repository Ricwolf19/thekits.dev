/**
 * The README `## Features` section is a bullet list of `**Label** — text`.
 * Rendered as markdown it is a wall of bold paragraphs; parsed, it is a grid.
 */
export type Feature = {
  readonly label: string;
  readonly description: string;
};

const BULLET = /^-\s+\*\*(.+?)\*\*\s*(?:—|–|-|:)\s*(.+)$/;

export const parseFeatures = (body: string): Feature[] =>
  body
    .split("\n")
    .map((line) => BULLET.exec(line.trim()))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => ({
      label: match[1].trim(),
      description: match[2].trim(),
    }));

export type InlineRun = { readonly code: boolean; readonly text: string };

/** Splits `text with \`code\`` into runs, so a card can render inline code
 * without pulling in the whole markdown renderer per feature. */
export const inlineRuns = (text: string): InlineRun[] =>
  text
    .split(/(`[^`]+`)/)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith("`") && part.endsWith("`")
        ? { code: true, text: part.slice(1, -1) }
        : { code: false, text: part },
    );
