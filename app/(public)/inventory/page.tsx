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
      <section className="mt-16 glass p-8 md:p-12">
        <h2 className="font-display text-2xl font-extrabold heading-gradient">Buying Used Cars for Sale in Leicester</h2>
        <div className="mt-6 grid gap-6 text-sm leading-relaxed text-[rgb(var(--muted))] md:grid-cols-2">
          <div className="space-y-4">
            <p>
              Hawk Motors offers a wide selection of used cars for sale in Leicester, covering all makes, models and budgets. Every vehicle in our Leicester stock has been personally selected and prepared to a high standard before being listed for sale. We take pride in offering used cars that are clean, reliable and honestly described — so you can browse with confidence.
            </p>
            <p>
              Our used car inventory in Leicester is updated regularly, with new stock arriving throughout the month. Whether you are looking for a compact city car, a practical family estate, a capable SUV or a premium saloon, you will find a strong range of used cars for sale across all categories. Use the filters on this page to narrow by make, model, price, year, mileage, fuel type and more.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Part exchange is welcome on all used cars for sale at Hawk Motors Leicester. If you have a vehicle to sell, we offer fair valuations and can offset the value against your next purchase. This makes upgrading to one of our used cars as straightforward as possible, with no need to deal with private sale hassle.
            </p>
            <p>
              If you have any questions about a specific used car for sale in our Leicester inventory, use the enquiry button on the vehicle page or call us directly. Our team is happy to provide additional photos, answer questions about history and service records, or arrange a viewing by appointment. We serve customers from Leicester, Loughborough, Nottingham, Coventry and across the East Midlands.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
