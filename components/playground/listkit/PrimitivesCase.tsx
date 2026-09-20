"use client";

import { Pagination, SearchInput, Table, type ColumnDef } from "listkit";
import { useMemo, useState } from "react";

import type { Locale } from "@/lib/i18n/config";

import { formatMoney, type Invoice, invoices } from "./data";

const PAGE_SIZES = [8, 16, 24];

const COPY = {
  en: {
    number: "Number",
    client: "Client",
    status: "Status",
    total: "Total",
    search: "Search number or client…",
  },
  es: {
    number: "Número",
    client: "Cliente",
    status: "Estado",
    total: "Total",
    search: "Buscar por número o cliente…",
  },
} as const;

const columns = (locale: Locale): ColumnDef<Invoice>[] => [
  { key: "number", header: COPY[locale].number, sortable: true },
  { key: "client", header: COPY[locale].client, grow: true },
  { key: "status", header: COPY[locale].status },
  {
    key: "total",
    header: COPY[locale].total,
    align: "right",
    sortable: true,
    render: (i) => formatMoney(i.total, i.currency),
  },
];

/** No config, no adapter, no provider: the primitives over your own state.
 * Table only reports the sort click; who sorts the data is you. */
export const PrimitivesCase = ({ locale }: { locale: Locale }) => {
  const cols = useMemo(() => columns(locale), [locale]);
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "number",
    dir: "asc",
  });

  const rows = useMemo(() => {
    const needle = term.trim().toLowerCase();
    const matched = needle
      ? invoices.filter(
          (i) =>
            i.number.toLowerCase().includes(needle) ||
            i.client.toLowerCase().includes(needle),
        )
      : invoices;
    const factor = sort.dir === "desc" ? -1 : 1;
    return [...matched].sort((a, b) =>
      sort.field === "total"
        ? (a.total - b.total) * factor
        : a.number.localeCompare(b.number) * factor,
    );
  }, [term, sort]);

  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-xs">
        <SearchInput
          value={term}
          onChange={(v) => {
            setTerm(v);
            setPage(1);
          }}
          placeholder={COPY[locale].search}
        />
      </div>
      <Table
        columns={cols}
        data={pageRows}
        sort={sort}
        onSort={(field) =>
          setSort((s) => ({
            field,
            dir: s.field === field && s.dir === "asc" ? "desc" : "asc",
          }))
        }
      />
      <Pagination
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(rows.length / pageSize))}
        totalItems={rows.length}
        itemsPerPage={pageSize}
        onPageChange={setPage}
        pageSize={{
          value: pageSize,
          options: PAGE_SIZES,
          onChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
        }}
      />
    </div>
  );
};
