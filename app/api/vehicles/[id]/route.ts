import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { vehicleSchema } from "@/lib/vehicleSchema";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: { media: { orderBy: { position: "asc" } } },
  });
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}

// Full update (replaces media set).
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = vehicleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid vehicle", details: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;

  const make = await prisma.make.findUnique({ where: { id: d.makeId } });
  const model = await prisma.model.findUnique({ where: { id: d.modelId } });
  const title = d.title?.trim() || `${d.year} ${make?.name ?? ""} ${model?.name ?? ""} ${d.variant ?? ""}`.trim();

  const vehicle = await prisma.$transaction(async (tx) => {
    await tx.media.deleteMany({ where: { vehicleId: params.id } });
    return tx.vehicle.update({
      where: { id: params.id },
      data: {
        title, status: d.status, featured: d.featured, price: d.price,
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
  });
  return NextResponse.json(vehicle);
}

// Partial update — quick actions (sold/reserved/feature).
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof body.featured === "boolean") data.featured = body.featured;
  if (["AVAILABLE", "RESERVED", "SOLD", "DRAFT"].includes(body.status)) data.status = body.status;
  if (!Object.keys(data).length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  const vehicle = await prisma.vehicle.update({ where: { id: params.id }, data });
  return NextResponse.json(vehicle);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.vehicle.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
