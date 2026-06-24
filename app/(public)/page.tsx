import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";
import { QuickSearch } from "@/components/QuickSearch";
import { VehicleCard } from "@/components/VehicleCard";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ContactSection } from "@/components/ContactSection";
import { getFeatured, getFilterOptions, getStockCount } from "@/lib/vehicles";
import { getSiteContact } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, options, stock, contact] = await Promise.all([
    getFeatured(6),
    getFilterOptions(),
    getStockCount(),
    getSiteContact(),
  ]);

  return (
    <>
      <HeroSlider slides={featured} phone={contact.phone} email={contact.email} />
      <QuickSearch options={options} />

      <section className="mx-auto max-w-screen-2xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="chip border-accent/30 text-accent">{stock} vehicles in stock</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold heading-gradient md:text-4xl">Featured vehicles</h2>
          </div>
          <Link href="/inventory" className="btn-ghost hidden sm:inline-flex">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {featured.length ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {featured.map((v) => (
              <VehicleCard key={v.id} v={v} phone={contact.phone} />
            ))}
          </div>
        ) : (
          <p className="text-[rgb(var(--muted))]">No featured vehicles yet. Mark vehicles as featured in the admin panel.</p>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/inventory" className="btn-accent">View all inventory <ArrowRight size={16} /></Link>
        </div>
      </section>

      <WhyChooseUs />
      <ContactSection contact={contact} />
    </>
  );
}
