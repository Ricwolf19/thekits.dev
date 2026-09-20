import { cacheLife } from "next/cache";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** Every gallery case lives here; `caseSource` refuses anything outside it. */
const CASES_DIR = path.join(process.cwd(), "components", "playground");

/**
 * The source shown beside a demo is the demo's real file, read at build. A
 * hand-maintained snippet would drift from what actually renders.
 *
 * The read is scoped to `components/playground` statically, so Next's file
 * tracer bundles that folder and not the whole project.
 */
export const caseSource = async (file: string): Promise<string> => {
  "use cache";
  cacheLife("max");
  const resolved = path.join(CASES_DIR, file);
  // The separator matters: without it `components/playgroundX` passes.
  if (!resolved.startsWith(CASES_DIR + path.sep))
    throw new Error(`Refusing to read outside ${CASES_DIR}: ${file}`);
  const raw = await readFile(resolved, "utf8");
  // "use client" is site plumbing, not part of what a reader would copy.
  return raw.replace(/^"use client";\n\n/, "").trimEnd();
};
