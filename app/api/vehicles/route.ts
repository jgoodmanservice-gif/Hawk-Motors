import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { vehicleSchema } from "@/lib/vehicleSchema";
import { slugify } from "@/lib/utils";
import { toCard } from "@/lib/vehicles";

// Public helper: fetch a set of vehicle cards by slug (used by Saved / Recently viewed).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slugs = searchParams.get("slugs");
  if (slugs) {
    const rows = await prisma.vehicle.findMany({
      where: { slug: { in: slugs.split(",").filter(Boolean) }, status: { not: "DRAFT" } },
      include: {
        make: true, model: true, fuelType: true, bodyStyle: true, colour: true,
        media: { where: { type: "IMAGE" }, orderBy: { position: "asc" }, take: 1 },
      },
    });
    return NextResponse.json(rows.map(toCard));
  }
  // Admin listing (all statuses)
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await prisma.vehicle.findMany({
    include: {
      make: true, model: true, fuelType: true, bodyStyle: true, colour: true,
      media: { where: { type: "IMAGE" }, orderBy: { position: "asc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(rows.map(toCard));
}

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base);
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.vehicle.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${slugify(base)}-${++n}`;
  }
}

// Admin: create a vehicle.
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = vehicleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid vehicle", details: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;

  const make = await prisma.make.findUnique({ where: { id: d.makeId } });
  const model = await prisma.model.findUnique({ where: { id: d.modelId } });
  const title = d.title?.trim() || `${d.year} ${make?.name ?? ""} ${model?.name ?? ""} ${d.variant ?? ""}`.trim();
  const slug = await uniqueSlug(`${title}`);

  const vehicle = await prisma.vehicle.create({
    data: {
      slug, title, status: d.status, featured: d.featured, price: d.price,
      makeId: d.makeId, modelId: d.modelId, fuelTypeId: d.fuelTypeId || null,
      bodyStyleId: d.bodyStyleId || null, colourId: d.colourId || null,
      variant: d.variant || null, year: d.year, registration: d.registration || null,
      mileage: d.mileage, engineSize: d.engineSize || null, horsepower: d.horsepower || null,
      transmission: d.transmission || null, drivetrain: d.drivetrain || null,
      doors: d.doors || null, seats: d.seats || null, description: d.description || null,
      features: d.features, serviceHistory: d.serviceHistory || null,
      motExpiry: d.motExpiry ? new Date(d.motExpiry) : null, owners: d.owners || null,
      warranty: d.warranty || null, metaTitle: d.metaTitle || null, metaDescription: d.metaDescription || null,
      media: { create: d.media.map((m, i) => ({ ...m, position: m.position ?? i })) },
    },
  });
  return NextResponse.json(vehicle, { status: 201 });
}
