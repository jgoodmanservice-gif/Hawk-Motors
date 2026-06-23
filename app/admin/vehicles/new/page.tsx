import { getFilterOptions } from "@/lib/vehicles";
import { VehicleForm, emptyVehicle } from "@/components/admin/VehicleForm";

export const dynamic = "force-dynamic";

export default async function NewVehicle() {
  const options = await getFilterOptions();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 font-display text-3xl font-extrabold heading-gradient">Add vehicle</h1>
      <VehicleForm initial={emptyVehicle} options={options} />
    </div>
  );
}
