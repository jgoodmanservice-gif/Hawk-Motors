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
            Browse used cars <ArrowRight size={16} />
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
          <Link href="/inventory" className="btn-accent">See all used cars in stock <ArrowRight size={16} /></Link>
        </div>
      </section>

      <WhyChooseUs />

      <section className="mx-auto max-w-screen-2xl px-4 pb-16">
        <div className="glass p-8 md:p-12">
          <h2 className="font-display text-2xl font-extrabold heading-gradient md:text-3xl">Used Cars in Leicester — Hawk Motors</h2>
          <div className="mt-6 grid gap-6 text-sm leading-relaxed text-[rgb(var(--muted))] md:grid-cols-2">
            <div className="space-y-4">
              <p>
                Hawk Motors is Leicester&apos;s dedicated used car specialist, offering a carefully selected range of quality used cars to buyers across Leicester, Leicestershire and the wider East Midlands region. Whether you are searching for your first car, a family estate, a sports saloon or a premium SUV, our team is committed to making your next car purchase as smooth and straightforward as possible.
              </p>
              <p>
                Every used car in our inventory has been individually selected and thoroughly inspected before it is offered for sale. We believe that buying a used car should be a positive experience, which is why we are transparent about each vehicle&apos;s history, condition and pricing. There are no hidden fees and no high-pressure sales tactics — just honest advice and quality cars at competitive prices.
              </p>
              <p>
                Our stock covers a broad range of popular makes and models. From sporty hatchbacks and practical family saloons to spacious SUVs, crossovers and performance cars, Hawk Motors sources vehicles that appeal to a wide range of buyers across Leicestershire. We carefully consider mileage, service history, condition and value when selecting each car, so every vehicle on our forecourt meets our high standards before it is offered to customers.
              </p>
              <p>
                Buying a used car by appointment means you get dedicated, personal attention from our team with no distractions. We take the time to walk you through the vehicle, answer your questions honestly and ensure you feel completely confident before making any decision. There is never any pressure to buy on the day — we would rather you leave happy and return when you are ready than rush into a purchase that is not right for you.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Leicester is home to a thriving automotive market, and Hawk Motors is proud to be part of it. We stock a wide variety of makes and models to suit all budgets, from reliable everyday runarounds to prestige and performance vehicles. Our used car stock is regularly updated, so whether you browse online or get in touch directly, you can be confident that what you see is what is available.
              </p>
              <p>
                Part exchange is always welcome at Hawk Motors. If you are looking to sell your current vehicle and put the value towards a used car from our Leicester stock, we offer fair and competitive valuations. This makes upgrading straightforward and hassle-free, with no need to deal with private sale advertising, time-wasters or no-shows. Simply bring your current car along and we will assess it honestly.
              </p>
              <p>
                We are conveniently accessible for buyers from across the region, including Loughborough, Hinckley, Melton Mowbray, Market Harborough, Coalville, Coventry and Nottingham. Many of our customers travel to Hawk Motors from across the East Midlands because of our reputation for straightforward, honest used car sales and the quality of our stock. We are happy to arrange viewings at a time that suits you — simply call or send an enquiry through our website.
              </p>
              <p>
                Whether you are a first-time buyer looking for a reliable and affordable runabout, or an experienced driver searching for a premium used vehicle, Hawk Motors Leicester has the right car for you. Browse our latest stock online, use our filters to narrow down your search, or get in touch with our friendly team today. We look forward to helping you drive away in your next car.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactSection contact={contact} />
    </>
  );
}
