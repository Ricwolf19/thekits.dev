/** Demo rows. Deliberately plain data: the point of the demo is the config. */
export type Invoice = {
  id: string;
  number: string;
  client: string;
  status: "paid" | "pending" | "overdue" | "draft";
  currency: "MXN" | "USD";
  total: number;
  issuedAt: string;
  recurring: boolean;
};

const CLIENTS = [
  "Cafe Combate",
  "Agates from Mexico",
  "Increscendo",
  "Espau",
  "Nexus Fandom",
  "Vitalink",
  "Kanban Labs",
  "Sid Studio",
];
const STATUSES: Invoice["status"][] = ["paid", "pending", "overdue", "draft"];

/** Generated from a fixed seed so the demo renders identically every build. */
export const invoices: Invoice[] = Array.from({ length: 84 }, (_, i) => {
  const day = ((i * 7) % 28) + 1;
  const month = (i % 12) + 1;
  return {
    id: `inv-${i + 1}`,
    number: `F-${String(2600 + i)}`,
    client: CLIENTS[i % CLIENTS.length],
    status: STATUSES[i % STATUSES.length],
    currency: i % 3 === 0 ? "USD" : "MXN",
    total: 1200 + ((i * 937) % 48_000),
    issuedAt: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    recurring: i % 4 === 0,
  };
});

/** Formatted in the currency's own locale, not the page's — a USD total reads
 * as `$1,200` regardless of which language the surrounding page is in. */
export const formatMoney = (value: number, currency: Invoice["currency"]) =>
  new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
