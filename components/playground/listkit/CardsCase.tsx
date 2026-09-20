"use client";

import { defineListConfig, ES_LABELS, ListImage } from "listkit";
import { NextListView } from "listkit/next";
import { useMemo } from "react";

import type { Locale } from "@/lib/i18n/config";

import { CATEGORIES, money, type Product, products } from "./fixtures";
import { cyanTheme } from "./theme";

const COPY = {
  en: {
    title: "Catalog",
    category: "Category",
    price: "Price",
    name: "Name",
    stock: "Stock",
  },
  es: {
    title: "Catálogo",
    category: "Categoría",
    price: "Precio",
    name: "Nombre",
    stock: "Existencias",
  },
} as const;

/** A card renderer receives the item plus the list context — theme, actions,
 * selection helpers — so nothing is prop-drilled. */
const ProductCard = (item: Product) => (
  <>
    <div className="flex items-center gap-3">
      <ListImage src={item.image} alt={item.name} width={44} height={44} />
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-gray-900">{item.name}</h3>
        <p className="text-xs text-gray-500">{item.sku}</p>
      </div>
    </div>
    <div className="mt-auto flex items-center justify-between pt-3 text-sm">
      <span className="rounded-full bg-[#ecfeff] px-2.5 py-0.5 text-xs font-medium text-[#155e75]">
        {item.category}
      </span>
      <span className="font-semibold text-gray-900">{money(item.price)}</span>
    </div>
  </>
);

/** A brand theme outside the built-ins and a custom card, opening in cards view. */
export const CardsCase = ({ locale }: { locale: Locale }) => {
  const copy = COPY[locale];
  const config = useMemo(
    () =>
      defineListConfig<Product>({
        id: "gallery-cards",
        title: copy.title,
        pageSize: 12,
        colorTheme: cyanTheme,
        defaultView: "cards",
        labels: locale === "es" ? ES_LABELS : undefined,
        search: { fields: ["name", "sku", "category"] },
        getItemKey: (p) => p.id,
        card: ProductCard,
        filters: [
          {
            id: "attrs",
            filters: [
              {
                id: "category",
                field: "category",
                label: copy.category,
                type: "select",
                options: CATEGORIES.map((c) => ({ value: c, label: c })),
                quick: true,
              },
              {
                id: "price",
                field: "price",
                label: copy.price,
                type: "number-range",
                display: "slider",
                min: 0,
                max: 1000,
                step: 10,
                formatValue: money,
              },
            ],
          },
        ],
        table: {
          columns: [
            { key: "name", header: copy.name, sortable: true, grow: true },
            { key: "category", header: copy.category },
            {
              key: "price",
              header: copy.price,
              align: "right",
              sortable: true,
              render: (p) => money(p.price),
            },
            {
              key: "stock",
              header: copy.stock,
              align: "right",
              sortable: true,
            },
          ],
        },
      }),
    [locale, copy],
  );

  return <NextListView config={config} data={products} />;
};
