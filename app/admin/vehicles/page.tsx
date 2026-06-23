import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCard } from "@/lib/vehicles";
import { VehicleTable } from "@/components/admin/VehicleTable";

export const dynamic = "force-dynamic";

export default async function AdminVehicles() {
  const rows = await prisma.vehicle.findMany({
    include: {
      make: true, model: true, fuelType: true, bodyStyle: true, colour: true,
      media: { where: { type: "IMAGE" }, orderBy: { position: "asc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
  const vehicles = rows.map(toCard);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold heading-gradient">Vehicles</h1>
          <p className="text-sm text-[rgb(var(--muted))]">{vehicles.length} total · manage your stock.</p>
        </div>
        <Link href="/admin/vehicles/new" className="btn-accent"><Plus size={16} /> Add vehicle</Link>
      </div>
      <VehicleTable vehicles={vehicles} />
    </div>
  );
}
