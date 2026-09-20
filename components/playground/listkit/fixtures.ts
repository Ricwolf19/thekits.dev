/**
 * English fixtures for the gallery. Generated from fixed seeds so every build
 * renders identically; nothing here is random.
 */
export const TICKET_STATUSES = [
  "Open",
  "In progress",
  "Blocked",
  "Closed",
] as const;
export const AREAS = ["Support", "Sales", "Logistics", "Finance"] as const;
export const TAGS = [
  "urgent",
  "regression",
  "vip",
  "billing",
  "shipping",
] as const;
export const CHANNELS = ["email", "phone", "chat"] as const;

/** One row carrying every filterable shape listkit supports. */
export type Ticket = {
  id: string;
  ref: string;
  subject: string;
  status: (typeof TICKET_STATUSES)[number];
  requester: { name: string; area: (typeof AREAS)[number] };
  tags: string[];
  replies: { author: string; channel: string }[];
  hoursOpen: number;
  satisfaction: number;
  createdAt: string;
  escalated: boolean;
};

const SUBJECTS = [
  "Cannot sign in",
  "Duplicate charge on invoice",
  "Shipment arrived incomplete",
  "Refund request",
  "Export crashes the app",
  "Change billing address",
  "Password reset email never arrives",
];
const PEOPLE = [
  "Ana Pérez",
  "José Núñez",
  "Marta Ito",
  "Luis Cárdenas",
  "Sofía Álvarez",
];

export const tickets: Ticket[] = Array.from({ length: 96 }, (_, i) => {
  const month = (i % 12) + 1;
  const day = ((i * 5) % 27) + 1;
  return {
    id: `t-${i + 1}`,
    ref: `T-${String(4100 + i)}`,
    subject: SUBJECTS[i % SUBJECTS.length],
    status: TICKET_STATUSES[i % TICKET_STATUSES.length],
    requester: {
      name: PEOPLE[i % PEOPLE.length],
      area: AREAS[(i * 3) % AREAS.length],
    },
    tags: [
      TAGS[i % TAGS.length],
      ...(i % 3 === 0 ? [TAGS[(i + 2) % TAGS.length]] : []),
    ],
    replies: Array.from({ length: i % 4 }, (_, r) => ({
      author: PEOPLE[(i + r) % PEOPLE.length],
      channel: CHANNELS[(i + r) % CHANNELS.length],
    })),
    hoursOpen: (i * 37) % 240,
    satisfaction: (i * 7) % 6,
    createdAt: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    escalated: i % 5 === 0,
  };
});

export type Product = {
  id: string;
  name: string;
  image: string;
  sku: string;
  category: string;
  tags: string[];
  stock: number;
  price: number;
  rating: number;
  origin: string;
};

export const CATEGORIES = ["Coffee", "Tea", "Accessories", "Pastry"] as const;
export const ORIGINS = [
  "Mexico",
  "Colombia",
  "Brazil",
  "Ethiopia",
  "Guatemala",
] as const;
const NAMES = [
  "Chiapas Reserve",
  "Oaxaca Blend",
  "Veracruz Dark",
  "Highland Green",
  "Ceramic Dripper",
  "Cardamom Bun",
  "Cold Brew Kit",
  "Yellow Bourbon",
];

export const products: Product[] = Array.from({ length: 48 }, (_, i) => ({
  id: `p-${i + 1}`,
  name: `${NAMES[i % NAMES.length]} ${Math.floor(i / NAMES.length) + 1}`,
  image: `https://picsum.photos/seed/kit${i}/96/96`,
  sku: `SKU-${10000 + i}`,
  category: CATEGORIES[i % CATEGORIES.length],
  tags:
    i % 3 === 0 ? ["New"] : i % 4 === 0 ? ["Organic", "Imported"] : ["Sale"],
  stock: (i * 13) % 120,
  price: 90 + ((i * 47) % 900),
  rating: (i % 5) + 1,
  origin: ORIGINS[i % ORIGINS.length],
}));

export const money = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
