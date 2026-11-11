"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Wallet } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { VehicleCardData } from "@/lib/types";

/** Drag a slider to a budget and watch the matching cars appear. */
export function BudgetFinder({ cars }: { cars: VehicleCardData[] }) {
  const forSale = useMemo(() => cars.filter((c) => c.status !== "SOLD"), [cars]);
  const prices = forSale.map((c) => c.price);
  const step = 250;
  const min = Math.max(0, Math.floor((Math.min(...prices, 2000) * 0.8) / step) * step);
  const max = Math.ceil((Math.max(...prices, 10000) * 1.1) / step) * step;
  const [budget, setBudget] = useState(Math.round((min + max) / 2 / step) * step);

  const matches = forSale.filter((c) => c.price <= budget).sort((a, b) => b.price - a.price);
  const pct = ((budget - min) / (max - min)) * 100;

  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-16">
      <div className="glass grid gap-8 overflow-hidden p-6 md:p-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center">
        <div>
          <span className="chip border-accent/40 text-accent"><Wallet size={12} /> Budget finder</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold heading-gradient md:text-4xl">What can you get for…</h2>
          <motion.p key={budget} initial={{ scale: 0.96, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 font-display text-5xl font-bold tabular-nums md:text-6xl">
            {formatPrice(budget)}
          </motion.p>

          <input
            type="range" min={min} max={max} step={step} value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            aria-label="Your maximum budget"
            className="range mt-6"
            style={{ ["--pct" as string]: `${pct}%` }}
          />
          <div className="mt-2 flex justify-between text-xs text-[rgb(var(--muted))]">
            <span>{formatPrice(min)}</span><span>{formatPrice(max)}</span>
          </div>

          <p className="mt-6 text-[rgb(var(--muted))]">
            <span className="text-2xl font-bold text-[rgb(var(--fg))]">{matches.length}</span>{" "}
            {matches.length === 1 ? "car" : "cars"} in stock within your budget
          </p>
          <Link href={`/inventory?maxPrice=${budget}`} className="btn-accent mt-4">
            See them all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid min-h-[220px] grid-cols-2 gap-3 sm:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {matches.slice(0, 6).map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.85, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <Link href={`/vehicles/${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-xl border">
                  {c.image && <Image src={c.image} alt={c.title} fill sizes="(max-width:640px) 50vw, 20vw" className="object-cover transition duration-500 group-hover:scale-110" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute inset-x-2 bottom-2 text-white">
                    <p className="truncate text-xs font-medium">{c.title}</p>
                    <p className="font-display text-sm font-bold">{formatPrice(c.price)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
            {matches.length === 0 && (
              <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="col-span-full grid place-items-center rounded-xl border border-dashed p-10 text-center text-sm text-[rgb(var(--muted))]">
                Slide up to see what&apos;s in stock — or call us, we can source to budget.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
