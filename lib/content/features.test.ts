import { describe, expect, it } from "vitest";

import { inlineRuns, parseFeatures } from "./features";

describe("parseFeatures", () => {
  it("splits label and description on the em dash", () => {
    const [feature] = parseFeatures(
      "- **Declarative config** — one `defineListConfig<T>()` describes the list.",
    );
    expect(feature).toEqual({
      label: "Declarative config",
      description: "one `defineListConfig<T>()` describes the list.",
    });
  });

  it("accepts a hyphen or colon separator too", () => {
    expect(parseFeatures("- **A** - b\n- **C**: d")).toEqual([
      { label: "A", description: "b" },
      { label: "C", description: "d" },
    ]);
  });

  it("ignores lines that are not labelled bullets", () => {
    expect(parseFeatures("intro line\n- plain bullet\n- **X** — y")).toEqual([
      { label: "X", description: "y" },
    ]);
  });
});

describe("inlineRuns", () => {
  it("marks backticked spans as code", () => {
    expect(inlineRuns("use `foo` then `bar`.")).toEqual([
      { code: false, text: "use " },
      { code: true, text: "foo" },
      { code: false, text: " then " },
      { code: true, text: "bar" },
      { code: false, text: "." },
    ]);
  });

  it("returns one plain run when there is no code", () => {
    expect(inlineRuns("plain")).toEqual([{ code: false, text: "plain" }]);
  });
});
