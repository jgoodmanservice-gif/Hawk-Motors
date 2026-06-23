import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { slugify } from "@/lib/utils";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const src = await prisma.vehicle.findUnique({ where: { id: params.id }, include: { media: true } });
  if (!src) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let slug = slugify(`${src.title}-copy`);
  let n = 1;
  while (await prisma.vehicle.findUnique({ where: { slug } })) slug = slugify(`${src.title}-copy-${++n}`);

  const copy = await prisma.vehicle.create({
    data: {
      slug,
      title: `${src.title} (Copy)`,
      status: "DRAFT",
      featured: false,
      price: src.price,
      makeId: src.makeId, modelId: src.modelId, fuelTypeId: src.fuelTypeId,
      bodyStyleId: src.bodyStyleId, colourId: src.colourId,
      variant: src.variant, year: src.year, registration: null, mileage: src.mileage,
      engineSize: src.engineSize, horsepower: src.horsepower, transmission: src.transmission,
      drivetrain: src.drivetrain, doors: src.doors, seats: src.seats, description: src.description,
      features: src.features, serviceHistory: src.serviceHistory, motExpiry: src.motExpiry,
      owners: src.owners, warranty: src.warranty,
      media: { create: src.media.map((m) => ({ type: m.type, url: m.url, embedUrl: m.embedUrl, alt: m.alt, position: m.position })) },
    },
  });
  return NextResponse.json(copy, { status: 201 });
}
