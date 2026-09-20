import type { ReactNode } from "react";

/** The small result panel the gallery cases share. */
export const ResultPanel = ({
  label,
  data,
}: {
  label: string;
  data: unknown;
}) => (
  <aside className="bg-fd-muted text-fd-foreground rounded-lg p-3 font-mono text-xs">
    <p className="text-fd-muted-foreground mb-2 font-semibold">{label}</p>
    <pre className="max-h-72 overflow-auto break-words whitespace-pre-wrap">
      {JSON.stringify(data, null, 2)}
    </pre>
  </aside>
);

/**
 * Demo beside its result panel when there is room, stacked below it otherwise.
 * The split is a container query, never a viewport one.
 * @see AGENTS.md#invariants
 */
export const Split = ({
  main,
  aside,
}: {
  main: ReactNode;
  aside?: ReactNode;
}) => (
  <div className="@container">
    <div className="grid gap-4 @3xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-4">{main}</div>
      {aside ? <div className="min-w-0">{aside}</div> : null}
    </div>
  </div>
);
