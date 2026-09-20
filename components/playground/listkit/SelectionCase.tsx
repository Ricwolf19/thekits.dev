"use client";

import { defineListConfig, ES_LABELS, type SelectionDetails } from "listkit";
import { NextListView } from "listkit/next";
import { useMemo, useState } from "react";

import type { Locale } from "@/lib/i18n/config";

import { formatMoney, type Invoice, invoices } from "./data";

const COPY = {
  en: {
    title: "Invoices",
    number: "Number",
    client: "Client",
    status: "Status",
    total: "Total",
  },
  es: {
    title: "Facturas",
    number: "Número",
    client: "Cliente",
    status: "Estado",
    total: "Total",
  },
} as const;

/** Row selection with bulk actions, and the details a server would receive —
 * including the "every matching result" mode that no id list can express. */
export const SelectionCase = ({ locale }: { locale: Locale }) => {
  const copy = COPY[locale];
  const [details, setDetails] = useState<SelectionDetails | null>(null);

  const config = useMemo(
    () =>
      defineListConfig<Invoice>({
        id: "gallery-selection",
        title: copy.title,
        pageSize: 8,
        colorTheme: "blue",
        labels: locale === "es" ? ES_LABELS : undefined,
        search: { fields: ["number", "client"] },
        getItemKey: (row) => row.id,
        selection: {
          onSelectionChange: (_rows, next) => setDetails(next),
        },
        table: {
          columns: [
            { key: "number", header: copy.number, sortable: true },
            { key: "client", header: copy.client, grow: true },
            { key: "status", header: copy.status },
            {
              key: "total",
              header: copy.total,
              align: "right",
              render: (r) => formatMoney(r.total, r.currency),
            },
          ],
        },
      }),
    [locale, copy],
  );

  return (
    // Container, not viewport: the shell's column is far narrower than the
    // window. @see AGENTS.md#invariants
    <div className="@container">
      <div className="grid gap-4 @3xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <NextListView config={config} data={invoices} />
        </div>
        <aside className="bg-fd-muted min-w-0 rounded-lg p-3 font-mono text-xs">
          <p className="text-fd-muted-foreground mb-2 font-semibold">
            onSelectionChange → details
          </p>
          <pre className="overflow-x-auto break-words whitespace-pre-wrap">
            {JSON.stringify(details ?? { mode: "none", count: 0 }, null, 2)}
          </pre>
        </aside>
      </div>
    </div>
  );
};
