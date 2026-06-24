import type { Metadata } from "next";
import { Suspense } from "react";
import { VehicleCard } from "@/components/VehicleCard";
import { InventoryFilters, SortBar } from "@/components/InventoryFilters";
import { listVehicles, getFilterOptions, type SearchParams } from "@/lib/vehicles";
import { getSiteContact } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Used Cars for Sale in Leicester | Full Inventory",
  description: "Browse all used cars for sale at Hawk Motors in Leicester. Filter by make, model, price, year, mileage, fuel type and more. Quality used cars at competitive prices.",
};

export default async function InventoryPage({ searchParams }: { searchParams: SearchParams }) {
  const [vehicles, options, contact] = await Promise.all([
    listVehicles(searchParams),
    getFilterOptions(),
    getSiteContact(),
  ]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-extrabold heading-gradient">Used Cars for Sale in Leicester</h1>
        <p className="mt-1 text-[rgb(var(--muted))]">Handpicked premium stock, fully prepared and ready to drive.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Suspense fallback={<div className="glass h-96 animate-pulse" />}>
          <InventoryFilters options={options} />
        </Suspense>

        <div>
          <Suspense fallback={null}>
            <SortBar count={vehicles.length} />
          </Suspense>

          {vehicles.length ? (
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} v={v} phone={contact.phone} />
              ))}
            </div>
          ) : (
            <div className="glass grid place-items-center p-16 text-center">
              <p className="text-lg font-semibold">No vehicles match your search</p>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">Try widening your filters or clearing them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
