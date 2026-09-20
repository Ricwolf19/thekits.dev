"use client";

import { defineListConfig, ES_LABELS } from "listkit";
import { NextListView } from "listkit/next";
import { useMemo } from "react";

import type { Locale } from "@/lib/i18n/config";

import { formatMoney, type Invoice, invoices } from "./data";

const COPY = {
  en: {
    title: "Invoices",
    subtitle:
      "84 rows, entirely in memory. Every control below is config, not code.",
    search: "Search by number or client…",
    number: "Number",
    client: "Client",
    status: "Status",
    total: "Total",
    issued: "Issued",
    recurring: "Recurring",
    filters: "Filters",
    statuses: {
      paid: "Paid",
      pending: "Pending",
      overdue: "Overdue",
      draft: "Draft",
    },
    yes: "Yes",
    no: "No",
  },
  es: {
    title: "Facturas",
    subtitle:
      "84 filas, todo en memoria. Cada control de abajo es configuración, no código.",
    search: "Buscar por número o cliente…",
    number: "Número",
    client: "Cliente",
    status: "Estado",
    total: "Total",
    issued: "Emitida",
    recurring: "Recurrente",
    filters: "Filtros",
    statuses: {
      paid: "Pagada",
      pending: "Pendiente",
      overdue: "Vencida",
      draft: "Borrador",
    },
    yes: "Sí",
    no: "No",
  },
} as const;

const STATUS_TONE: Record<Invoice["status"], string> = {
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  overdue: "bg-red-500/10 text-red-600 dark:text-red-400",
  draft: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

/**
 * The listkit demo.
 *
 * A client island by necessity — the list owns URL state and interaction — but
 * the page around it stays server-rendered, so the prose and metadata that
 * actually rank are in the initial HTML.
 *
 * It renders the published package from npm, not a workspace link: a demo that
 * shows unreleased behaviour is worse than no demo.
 */
export const ListkitDemo = ({ locale }: { locale: Locale }) => {
  const t = COPY[locale];

  const config = useMemo(
    () =>
      defineListConfig<Invoice>({
        id: "playground-invoices",
        title: t.title,
        subtitle: t.subtitle,
        pageSize: 12,
        colorTheme: "blue",
        tones: "slate",
        searchPlaceholder: t.search,
        labels: locale === "es" ? ES_LABELS : undefined,
        search: { fields: ["number", "client"] },
        filters: [
          {
            id: "main",
            title: t.filters,
            filters: [
              {
                id: "status",
                field: "status",
                label: t.status,
                type: "multi-select",
                options: (["paid", "pending", "overdue", "draft"] as const).map(
                  (value) => ({ value, label: t.statuses[value] }),
                ),
              },
              {
                id: "client",
                field: "client",
                label: t.client,
                type: "select",
                searchable: true,
                options: [...new Set(invoices.map((i) => i.client))].map(
                  (value) => ({ value, label: value }),
                ),
              },
              {
                id: "recurring",
                field: "recurring",
                label: t.recurring,
                type: "boolean",
                trueLabel: t.yes,
                falseLabel: t.no,
              },
            ],
          },
        ],
        table: {
          stickyHeader: true,
          columnControl: true,
          density: true,
          resizable: true,
          columns: [
            { key: "number", header: t.number, sortable: true, sticky: "left" },
            { key: "client", header: t.client, sortable: true, grow: true },
            {
              key: "status",
              header: t.status,
              sortable: true,
              render: (row) => (
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_TONE[row.status]}`}
                >
                  {t.statuses[row.status]}
                </span>
              ),
            },
            {
              key: "total",
              header: t.total,
              align: "right",
              sortable: true,
              render: (row) => formatMoney(row.total, row.currency),
            },
            { key: "issuedAt", header: t.issued, sortable: true },
          ],
        },
      }),
    [locale, t],
  );

  return <NextListView config={config} data={invoices} />;
};
