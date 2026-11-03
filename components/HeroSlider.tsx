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

  const fade = { opacity: visible ? 1 : 0 };

  return (
    <section className="mx-auto max-w-screen-2xl px-4 pt-6">
      <div className="glass grid overflow-hidden lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* 4:3 photo, no overlay so the car is fully visible */}
        <div className="relative aspect-[4/3] bg-ink-900">
          <Link href={`/vehicles/${v.slug}`} className="absolute inset-0 transition-opacity duration-700" style={fade} aria-label={v.title}>
            {v.image && <Image src={v.image} alt={v.title} fill priority quality={90} sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />}
          </Link>

          {count > 1 && (
            <>
              <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md hover:bg-black/70">
                <ChevronLeft className="text-white" />
              </button>
              <button onClick={() => go(1)} aria-label="Next" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md hover:bg-black/70">
                <ChevronRight className="text-white" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-2 py-1.5 backdrop-blur-md">
                {slides.map((s, idx) => (
                  <button key={s.id} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details sit below the photo (beside it on large screens) */}
        <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-10">
          <div
            className="transition-all duration-500"
            style={{ ...fade, transform: visible ? "translateY(0)" : "translateY(12px)" }}
          >
            <span className="chip border-accent/40 text-accent">★ Featured vehicle</span>
            <h1 className="mt-3 font-display text-xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">{v.title}</h1>
            <p className="mt-3 text-2xl font-bold sm:text-3xl">{formatPrice(v.price)}</p>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[rgb(var(--muted))]">
              <span>{v.year}</span>
              <span>{formatMileage(v.mileage)}</span>
              {v.fuelType && <span>{v.fuelType}</span>}
              {v.transmission && <span>{v.transmission}</span>}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`/vehicles/${v.slug}`} className="btn-accent">View vehicle</Link>
              <a href={telHref(phone)} className="btn-ghost"><Phone size={16} /> Call now</a>
              <a href={mailtoHref(email, `Enquiry: ${v.title}`)} className="btn-ghost hidden sm:inline-flex"><Mail size={16} /> Email</a>
              <Link href="/inventory" className="btn-ghost hidden lg:inline-flex">All used cars</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
