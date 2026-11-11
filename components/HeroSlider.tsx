"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, ChevronLeft, ChevronRight, ArrowUpRight, Calendar, Gauge, Fuel, Cog } from "lucide-react";
import { formatPrice, formatMileage } from "@/lib/utils";
import { telHref } from "@/lib/contact";
import type { VehicleCardData } from "@/lib/types";

const SLIDE_MS = 6500;

export function HeroSlider({ slides, phone }: { slides: VehicleCardData[]; phone: string; email?: string }) {
  const [[i, dir], setState] = useState<[number, number]>([0, 1]);
  const count = slides.length;

  const go = useCallback(
    (d: number) => setState(([p]) => [(p + d + count) % count, d]),
    [count]
  );
  const jump = (idx: number) => setState(([p]) => [idx, idx >= p ? 1 : -1]);

  useEffect(() => {
    if (count < 2) return;
    const t = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, count, go]);

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
  const specs = [
    { icon: Calendar, label: "Year", value: v.year },
    { icon: Gauge, label: "Mileage", value: formatMileage(v.mileage) },
    { icon: Fuel, label: "Fuel", value: v.fuelType ?? "—" },
    { icon: Cog, label: "Gearbox", value: v.transmission ?? "—" },
  ];

  return (
    <section className="relative mx-auto max-w-screen-2xl px-4 pt-6">
      <div
        className="glass relative grid overflow-hidden lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
      >
        {/* 4:3 photo */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={v.id}
                custom={dir}
                className="absolute inset-0"
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                drag={count > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
              >
                <Link href={`/vehicles/${v.slug}`} aria-label={v.title} draggable={false} className="absolute inset-0 overflow-hidden">
                  {v.image && (
                    <Image src={v.image} alt={v.title} fill priority quality={90} draggable={false}
                      sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
                  )}
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Warm up the next photo so it is ready before it slides in */}
            {count > 1 && slides[(i + 1) % count].image && (
              <Image src={slides[(i + 1) % count].image!} alt="" aria-hidden fill quality={90} loading="eager"
                sizes="(max-width:1024px) 100vw, 60vw" className="pointer-events-none -z-10 object-cover opacity-0" />
            )}

            {/* Slide counter */}
            <div className="pointer-events-none absolute left-4 top-4 flex items-baseline gap-1 rounded-full bg-black/55 px-3 py-1 font-display text-white backdrop-blur-md">
              <span className="text-lg font-bold">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-xs text-white/60">/ {String(count).padStart(2, "0")}</span>
            </div>

            {count > 1 && (
              <>
                <button onClick={() => go(-1)} aria-label="Previous car" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/75">
                  <ChevronLeft />
                </button>
                <button onClick={() => go(1)} aria-label="Next car" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/75">
                  <ChevronRight />
                </button>
              </>
            )}

            {/* Autoplay progress */}
            {count > 1 && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-black/30">
                <div
                  key={i}
                  className="fill-x h-full bg-accent"
                  style={{ animationDuration: `${SLIDE_MS}ms` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-col p-5 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={v.id}
              initial="out" animate="in" exit="out"
              variants={{ in: { transition: { staggerChildren: 0.06 } }, out: {} }}
              className="flex flex-1 flex-col justify-center"
            >
              {[
                <span key="c" className="chip w-fit border-accent/40 text-accent">★ Featured vehicle</span>,
                <h1 key="t" className="mt-3 font-display text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">{v.title}</h1>,
                <p key="p" className="mt-2 font-display text-4xl font-bold heading-gradient sm:text-5xl">{formatPrice(v.price)}</p>,
                <div key="s" className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                  {specs.map((s) => (
                    <div key={s.label} className="rounded-xl border bg-white/[0.03] px-3 py-2.5">
                      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[rgb(var(--muted))]"><s.icon size={12} /> {s.label}</p>
                      <p className="mt-0.5 truncate text-sm font-semibold">{s.value}</p>
                    </div>
                  ))}
                </div>,
                <div key="b" className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/vehicles/${v.slug}`} className="btn-accent group/b">
                    View this car <ArrowUpRight size={16} className="transition group-hover/b:-translate-y-0.5 group-hover/b:translate-x-0.5" />
                  </Link>
                  <a href={telHref(phone)} className="btn-ghost"><Phone size={16} /> Call now</a>
                </div>,
              ].map((el, k) => (
                <motion.div key={k} variants={{ out: { opacity: 0, y: 14 }, in: { opacity: 1, y: 0 } }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                  {el}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Car picker rail */}
          {count > 1 && (
            <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => jump(idx)}
                  aria-label={`Show ${s.title}`}
                  className={`relative h-14 w-20 flex-none overflow-hidden rounded-lg border-2 transition duration-300 ${idx === i ? "border-accent" : "border-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0"}`}
                >
                  {s.image && <Image src={s.image} alt="" fill sizes="80px" className="object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
