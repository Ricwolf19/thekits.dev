"use client";

import { defineListConfig, ES_LABELS } from "listkit";
import { NextListView } from "listkit/next";
import { useMemo } from "react";

import type { Locale } from "@/lib/i18n/config";

import {
  AREAS,
  CHANNELS,
  TAGS,
  type Ticket,
  TICKET_STATUSES,
  tickets,
} from "./fixtures";

const opt = (value: string) => ({ value, label: value });

/**
 * Every filter type listkit ships, shown twice over: as quick pills in the
 * toolbar and as a fully expanded advanced sidebar.
 *
 * `filtersAutoCollapse: false` keeps every section open, so the advanced
 * sidebar reads as a preset of all six input shapes rather than a panel whose
 * sections start closed.
 */
const COPY = {
  en: {
    subject: "Subject",
    status: "Status",
    escalated: "Escalated",
    ref: "Ref",
    requester: "Requester",
    hoursShort: "Hours",
    area: "Area",
    tags: "Tags",
    channel: "Reply channel",
    hours: "Hours open",
    satisfaction: "Satisfaction",
    created: "Created",
  },
  es: {
    subject: "Asunto",
    status: "Estado",
    escalated: "Escalado",
    ref: "Ref",
    requester: "Solicitante",
    hoursShort: "Horas",
    area: "Área",
    tags: "Etiquetas",
    channel: "Canal de respuesta",
    hours: "Horas abierto",
    satisfaction: "Satisfacción",
    created: "Creado",
  },
} as const;

export const FiltersCase = ({ locale }: { locale: Locale }) => {
  const copy = COPY[locale];
  const config = useMemo(
    () =>
      defineListConfig<Ticket>({
        id: "gallery-filters",
        title:
          locale === "es" ? "Todos los tipos de filtro" : "Every filter type",
        pageSize: 12,
        colorTheme: "blue",
        tones: "slate",
        labels: locale === "es" ? ES_LABELS : undefined,
        search: { fields: ["ref", "subject", "requester.name"] },
        defaultSort: { field: "createdAt", dir: "desc" },
        getItemKey: (t) => t.id,
        filtersTitle: locale === "es" ? "Filtrar tickets" : "Filter tickets",
        filtersAutoCollapse: false,
        filtersActiveFirst: true,
        filters: [
          {
            id: "basics",
            collapsible: false,
            title: locale === "es" ? "Básicos" : "Basics",
            filters: [
              {
                id: "subject",
                field: "subject",
                label: copy.subject,
                type: "text",
                quick: true,
              },
              {
                id: "status",
                field: "status",
                label: copy.status,
                type: "select",
                options: TICKET_STATUSES.map(opt),
                quick: true,
              },
              {
                id: "escalated",
                field: "escalated",
                label: copy.escalated,
                type: "boolean",
                quick: true,
              },
            ],
          },
          {
            id: "people",
            collapsible: false,
            title: locale === "es" ? "Personas" : "People",
            filters: [
              {
                id: "area",
                field: "requester.area",
                label: copy.area,
                type: "select",
                options: AREAS.map(opt),
                quick: true,
              },
              {
                id: "tags",
                field: "tags",
                label: copy.tags,
                type: "multi-select",
                options: TAGS.map(opt),
                quick: true,
              },
              // An array-crossing path: matches when ANY reply used the channel.
              {
                id: "channel",
                field: "replies.channel",
                label: copy.channel,
                type: "multi-select",
                options: CHANNELS.map(opt),
              },
            ],
          },
          {
            id: "ranges",
            collapsible: false,
            title: locale === "es" ? "Rangos" : "Ranges",
            filters: [
              {
                id: "hours",
                field: "hoursOpen",
                label: copy.hours,
                type: "number-range",
                quick: true,
              },
              {
                id: "satisfaction",
                field: "satisfaction",
                label: copy.satisfaction,
                type: "number-range",
                display: "slider",
                min: 0,
                max: 5,
                step: 1,
              },
              {
                id: "created",
                field: "createdAt",
                label: copy.created,
                type: "date-range",
                quick: true,
              },
            ],
          },
        ],
        table: {
          stickyHeader: true,
          columns: [
            { key: "ref", header: copy.ref, sortable: true, sticky: "left" },
            {
              key: "subject",
              header: copy.subject,
              sortable: true,
              grow: true,
            },
            { key: "status", header: copy.status },
            { key: "requester.name", header: copy.requester },
            {
              key: "hoursOpen",
              header: copy.hoursShort,
              align: "right",
              sortable: true,
            },
            { key: "createdAt", header: copy.created, sortable: true },
          ],
        },
      }),
    [locale, copy],
  );

  return <NextListView config={config} data={tickets} />;
};
