import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAllFilterOptions } from "@/lib/vehicles";
import { VehicleForm, type VehicleFormData } from "@/components/admin/VehicleForm";

export const dynamic = "force-dynamic";

export default async function EditVehicle({ params }: { params: { id: string } }) {
  const [v, options] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: params.id }, include: { media: { orderBy: { position: "asc" } } } }),
    getAllFilterOptions(),
  ]);
  if (!v) notFound();

  const initial: VehicleFormData = {
    id: v.id,
    title: v.title,
    status: v.status,
    featured: v.featured,
    price: v.price,
    makeId: v.makeId,
    modelId: v.modelId,
    fuelTypeId: v.fuelTypeId ?? "",
    bodyStyleId: v.bodyStyleId ?? "",
    colourId: v.colourId ?? "",
    variant: v.variant ?? "",
    year: v.year,
    registration: v.registration ?? "",
    mileage: v.mileage,
    engineSize: v.engineSize ?? "",
    horsepower: v.horsepower ?? "",
    transmission: v.transmission ?? "",
    drivetrain: v.drivetrain ?? "",
    doors: v.doors ?? "",
    seats: v.seats ?? "",
    description: v.description ?? "",
    features: v.features,
    serviceHistory: v.serviceHistory ?? "",
    motExpiry: v.motExpiry ? v.motExpiry.toISOString().slice(0, 10) : "",
    owners: v.owners ?? "",
    warranty: v.warranty ?? "",
    metaTitle: v.metaTitle ?? "",
    metaDescription: v.metaDescription ?? "",
    media: v.media.map((m) => ({ type: m.type, url: m.url, embedUrl: m.embedUrl, alt: m.alt, position: m.position })),
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 font-display text-3xl font-extrabold heading-gradient">Edit vehicle</h1>
      <VehicleForm initial={initial} options={options} />
    </div>
  );
}
