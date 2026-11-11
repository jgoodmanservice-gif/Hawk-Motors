// Local preview only: when DEMO_DATA=1 (no database on this machine) the public pages
// read a snapshot of the live stock instead of Postgres. Never set on Vercel.
import data from "./demo-data.json";
import type { VehicleCardData, FilterOptions } from "./types";

type DemoRow = VehicleCardData & {
  media: { id: string; type: string; url: string; embedUrl: string | null; alt: string | null }[];
  description: string | null;
};

const rows = data as DemoRow[];
export const DEMO = process.env.DEMO_DATA === "1";

const card = ({ media, description, ...c }: DemoRow): VehicleCardData => c;
const makeOf = (t: string) => t.replace(/^\d{4}\s*(\(\d+\)\s*)?/, "").split(" ")[0];

export const demoCards = () => rows.map(card);
export const demoFeatured = (n: number) => rows.filter((r) => r.featured).concat(rows.filter((r) => !r.featured)).slice(0, n).map(card);
export const demoStock = () => rows.filter((r) => r.status === "AVAILABLE").length;

export function demoOptions(): FilterOptions {
  const makes = Array.from(new Set(rows.map((r) => makeOf(r.title))));
  const fuels = Array.from(new Set(rows.map((r) => r.fuelType).filter(Boolean))) as string[];
  const bodies = Array.from(new Set(rows.map((r) => r.bodyStyle).filter(Boolean))) as string[];
  return {
    makes: makes.map((m) => ({ id: m, name: m, models: [] })),
    fuelTypes: fuels.map((f) => ({ id: f, name: f })),
    bodyStyles: bodies.map((b) => ({ id: b, name: b })),
    colours: [],
  };
}

export function demoList(sp: Record<string, string | string[] | undefined>) {
  const g = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  return rows
    .filter((r) => !g("make") || makeOf(r.title) === g("make"))
    .filter((r) => !g("maxPrice") || r.price <= Number(g("maxPrice")))
    .filter((r) => !g("minPrice") || r.price >= Number(g("minPrice")))
    .filter((r) => !g("fuel") || r.fuelType === g("fuel"))
    .filter((r) => !g("body") || r.bodyStyle === g("body"))
    .filter((r) => !g("status") || r.status === g("status"))
    .filter((r) => !g("q") || r.title.toLowerCase().includes(g("q")!.toLowerCase()))
    .map(card);
}

export function demoVehicle(slug: string) {
  const r = rows.find((x) => x.slug === slug);
  if (!r) return null;
  const mk = makeOf(r.title);
  return {
    ...r,
    makeId: mk,
    bodyStyleId: r.bodyStyle,
    make: { id: mk, name: mk },
    model: { id: mk, name: r.title.replace(/^\d{4}\s*(\(\d+\)\s*)?/, "").split(" ").slice(1, 2).join(" ") },
    fuelType: r.fuelType ? { name: r.fuelType } : null,
    bodyStyle: r.bodyStyle ? { name: r.bodyStyle } : null,
    colour: null as { name: string } | null,
    features: [] as string[],
    horsepower: null as number | null,
    drivetrain: null as string | null,
    doors: null as number | null,
    seats: null as number | null,
    registration: null as string | null,
    owners: null as number | null,
    motExpiry: null as Date | null,
    serviceHistory: null as string | null,
    warranty: null as string | null,
    metaTitle: null as string | null,
    metaDescription: null as string | null,
  };
}

export const demoSimilar = (id: string, n: number) => rows.filter((r) => r.id !== id && r.status !== "SOLD").slice(0, n).map(card);
