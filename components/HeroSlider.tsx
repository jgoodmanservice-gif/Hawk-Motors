"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, formatMileage } from "@/lib/utils";
import { telHref, mailtoHref } from "@/lib/contact";
import type { VehicleCardData } from "@/lib/types";

export function HeroSlider({ slides, phone, email }: { slides: VehicleCardData[]; phone: string; email: string }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  const count = slides.length;

  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setI((p) => (p + 1) % count); setVisible(true); }, 400);
    }, 6000);
    return () => clearInterval(t);
  }, [count]);

  const go = (d: number) => {
    setVisible(false);
    setTimeout(() => { setI((p) => (p + d + count) % count); setVisible(true); }, 400);
  };

  if (count === 0) {
    return (
      <section className="mx-auto max-w-screen-2xl px-4 pt-8">
        <div className="glass grid place-items-center px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-extrabold heading-gradient">Hawk Motors — Used Cars Leicester</h1>
          <p className="mt-2 text-[rgb(var(--muted))]">Add vehicles in the admin panel to populate the showcase.</p>
        </div>
      </section>
    );
  }

  const v = slides[i];

  return (
    <section className="mx-auto max-w-screen-2xl px-4 pt-6">
      <div className="glass relative overflow-hidden">
        <div className="relative aspect-[16/10] md:aspect-[21/9]">
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {v.image && <Image src={v.image} alt={v.title} fill priority sizes="100vw" className="object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 md:p-10">
            <div
              className="max-w-2xl transition-all duration-500"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
            >
              <span className="chip border-accent/40 text-white hidden sm:inline-flex">★ Featured vehicle</span>
              <h1 className="mt-2 font-display text-base font-extrabold text-white sm:text-3xl md:text-5xl leading-tight">{v.title}</h1>
              <p className="mt-1 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80 sm:text-sm hidden sm:flex">
                <span className="text-lg font-bold text-white sm:text-2xl">{formatPrice(v.price)}</span>
                <span>{v.year}</span>
                <span className="hidden sm:inline">{formatMileage(v.mileage)}</span>
                <span className="hidden sm:inline">{v.fuelType}</span>
                <span className="hidden sm:inline">{v.transmission}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-5">
                <Link href={`/vehicles/${v.slug}`} className="btn-accent py-1.5 text-xs sm:py-2 sm:text-sm">View vehicle</Link>
                <Link href="/inventory" className="btn-ghost hidden text-white sm:inline-flex">All used cars</Link>
                <a href={telHref(phone)} className="btn-ghost text-white py-1.5 text-xs sm:py-2 sm:text-sm"><Phone size={14} /> Call now</a>
                <a href={mailtoHref(email, `Enquiry: ${v.title}`)} className="btn-ghost hidden text-white md:inline-flex"><Mail size={16} /> Email</a>
              </div>
            </div>
          </div>

          {count > 1 && (
            <>
              <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md hover:bg-black/60">
                <ChevronLeft className="text-white" />
              </button>
              <button onClick={() => go(1)} aria-label="Next" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md hover:bg-black/60">
                <ChevronRight className="text-white" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {slides.map((s, idx) => (
                  <button key={s.id} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
