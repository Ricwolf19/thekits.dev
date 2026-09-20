import { Check } from "lucide-react";

import { type Feature, inlineRuns } from "@/lib/content/features";

/** Equal-height feature cards parsed from the README's `## Features` list. */
export const FeatureGrid = ({ features }: { features: readonly Feature[] }) => (
  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {features.map((feature) => (
      <li
        key={feature.label}
        className="border-fd-border flex gap-3 rounded-lg border p-4"
      >
        <span className="bg-fd-primary/10 text-fd-primary mt-0.5 grid size-6 shrink-0 place-items-center rounded-md">
          <Check className="size-3.5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">{feature.label}</h3>
          <p className="text-fd-muted-foreground mt-1 text-sm leading-relaxed">
            {inlineRuns(feature.description).map((run, i) =>
              run.code ? (
                <code
                  key={i}
                  className="bg-fd-muted rounded px-1 py-0.5 font-mono text-[0.8em]"
                >
                  {run.text}
                </code>
              ) : (
                <span key={i}>{run.text}</span>
              ),
            )}
          </p>
        </div>
      </li>
    ))}
  </ul>
);
