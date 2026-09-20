"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { createT, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const MANAGERS = [
  { id: "npm", run: (pkg: string) => `npm install ${pkg}` },
  { id: "pnpm", run: (pkg: string) => `pnpm add ${pkg}` },
  { id: "yarn", run: (pkg: string) => `yarn add ${pkg}` },
  { id: "bun", run: (pkg: string) => `bun add ${pkg}` },
] as const;

type Manager = (typeof MANAGERS)[number]["id"];

/**
 * Install block with a package-manager tab row and a copy button.
 *
 * State is local on purpose. Fumadocs' `CodeBlockTabs` with a shared `groupId`
 * syncs every instance on the page, so switching one block switched the other —
 * two packages, one choice. Each block now answers for itself.
 */
export const InstallCommand = ({
  pkg,
  locale,
  className,
}: {
  pkg: string;
  locale: Locale;
  className?: string;
}) => {
  const t = createT(locale);
  const [manager, setManager] = useState<Manager>("npm");
  const [copied, setCopied] = useState(false);
  const revert = useRef<ReturnType<typeof setTimeout>>(undefined);
  const command = MANAGERS.find((m) => m.id === manager)!.run(pkg);

  // Unmounting mid-countdown otherwise sets state on a gone component.
  useEffect(() => () => clearTimeout(revert.current), []);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    clearTimeout(revert.current);
    revert.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <figure
      className={cn(
        "bg-fd-card border-fd-border overflow-hidden rounded-lg border",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label={`${t("common.install")} ${pkg}`}
        className="border-fd-border flex items-center gap-1 border-b px-2"
      >
        {MANAGERS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={m.id === manager}
            onClick={() => setManager(m.id)}
            className={cn(
              "relative px-2.5 py-2 font-mono text-xs transition-colors",
              m.id === manager
                ? "text-fd-primary"
                : "text-fd-muted-foreground hover:text-fd-foreground",
            )}
          >
            {m.id}
            {m.id === manager ? (
              <span className="bg-fd-primary absolute inset-x-2.5 -bottom-px h-0.5 rounded-full" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        <Terminal className="text-fd-muted-foreground size-3.5 shrink-0" />
        <code className="flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap">
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? t("common.copied") : t("common.copy")}
          className="text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground shrink-0 rounded-md p-1.5 transition-colors"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    </figure>
  );
};
