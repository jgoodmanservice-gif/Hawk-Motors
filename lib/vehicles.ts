import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { VehicleCardData, FilterOptions } from "./types";

const cardInclude = {
  make: true,
  model: true,
  fuelType: true,
  bodyStyle: true,
  colour: true,
  media: { where: { type: "IMAGE" as const }, orderBy: { position: "asc" as const }, take: 1 },
} satisfies Prisma.VehicleInclude;

type VehicleWithRels = Prisma.VehicleGetPayload<{ include: typeof cardInclude }>;

export function toCard(v: VehicleWithRels): VehicleCardData {
  return {
    id: v.id,
    slug: v.slug,
    title: v.title,
    price: v.price,
    year: v.year,
    mileage: v.mileage,
    status: v.status,
    featured: v.featured,
    fuelType: v.fuelType?.name ?? null,
    transmission: v.transmission,
    engineSize: v.engineSize,
    bodyStyle: v.bodyStyle?.name ?? null,
    image: v.media[0]?.url ?? null,
  };
}

export async function getFeatured(limit = 6): Promise<VehicleCardData[]> {
  const rows = await prisma.vehicle.findMany({
    where: { featured: true, status: { not: "DRAFT" } },
    include: cardInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return rows.map(toCard);
}

export async function getStockCount() {
  return prisma.vehicle.count({ where: { status: "AVAILABLE" } });
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const [makes, fuelTypes, bodyStyles, colours] = await Promise.all([
    prisma.make.findMany({ include: { models: { orderBy: { name: "asc" } } }, orderBy: { name: "asc" } }),
    prisma.fuelType.findMany({ orderBy: { name: "asc" } }),
    prisma.bodyStyle.findMany({ orderBy: { name: "asc" } }),
    prisma.colour.findMany({ orderBy: { name: "asc" } }),
  ]);
  return {
    makes: makes.map((m) => ({ id: m.id, name: m.name, models: m.models.map((md) => ({ id: md.id, name: md.name })) })),
    fuelTypes: fuelTypes.map((f) => ({ id: f.id, name: f.name })),
    bodyStyles: bodyStyles.map((b) => ({ id: b.id, name: b.name })),
    colours: colours.map((c) => ({ id: c.id, name: c.name })),
  };
}

export type SearchParams = Record<string, string | string[] | undefined>;

const SORTS: Record<string, Prisma.VehicleOrderByWithRelationInput> = {
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
  newest: { year: "desc" },
  oldest: { year: "asc" },
  "mileage-asc": { mileage: "asc" },
  "mileage-desc": { mileage: "desc" },
};

export async function listVehicles(sp: SearchParams) {
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  const num = (k: string) => {
    const v = get(k);
    return v && !Number.isNaN(Number(v)) ? Number(v) : undefined;
  };

  const where: Prisma.VehicleWhereInput = { status: { not: "DRAFT" } };
  const and: Prisma.VehicleWhereInput[] = [];

  if (get("status")) where.status = get("status") as Prisma.VehicleWhereInput["status"];
  if (get("make")) and.push({ make: { name: get("make") } });
  if (get("model")) and.push({ model: { name: get("model") } });
  if (get("fuel")) and.push({ fuelType: { name: get("fuel") } });
  if (get("body")) and.push({ bodyStyle: { name: get("body") } });
  if (get("colour")) and.push({ colour: { name: get("colour") } });
  if (get("transmission")) and.push({ transmission: get("transmission") });

  const minPrice = num("minPrice");
  const maxPrice = num("maxPrice");
  if (minPrice !== undefined || maxPrice !== undefined) and.push({ price: { gte: minPrice, lte: maxPrice } });

  const minYear = num("minYear");
  const maxYear = num("maxYear");
  if (minYear !== undefined || maxYear !== undefined) and.push({ year: { gte: minYear, lte: maxYear } });

  const maxMileage = num("maxMileage");
  if (maxMileage !== undefined) and.push({ mileage: { lte: maxMileage } });

  const owners = num("owners");
  if (owners !== undefined) and.push({ owners: { lte: owners } });

  const q = get("q");
  if (q) {
    and.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { variant: { contains: q, mode: "insensitive" } },
        { make: { name: { contains: q, mode: "insensitive" } } },
        { model: { name: { contains: q, mode: "insensitive" } } },
      ],
    });
  }
  if (and.length) where.AND = and;

  const orderBy = SORTS[get("sort") || "newest"] ?? SORTS.newest;

  const rows = await prisma.vehicle.findMany({ where, include: cardInclude, orderBy });
  return rows.map(toCard);
}

export async function getVehicleBySlug(slug: string) {
  return prisma.vehicle.findUnique({
    where: { slug },
    include: {
      make: true,
      model: true,
      fuelType: true,
      bodyStyle: true,
      colour: true,
      media: { orderBy: { position: "asc" } },
    },
  });
}

export async function getSimilar(vehicleId: string, makeId: string, bodyStyleId: string | null, limit = 3) {
  const rows = await prisma.vehicle.findMany({
    where: {
      id: { not: vehicleId },
      status: { not: "DRAFT" },
      OR: [{ makeId }, ...(bodyStyleId ? [{ bodyStyleId }] : [])],
    },
    include: cardInclude,
    take: limit,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toCard);
}
