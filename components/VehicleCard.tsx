"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gauge, Fuel, Cog, Calendar, Phone } from "lucide-react";
import { formatPrice, formatMileage, STATUS_LABEL } from "@/lib/utils";
import { telHref } from "@/lib/contact";
import { SaveVehicleButton } from "./SaveVehicleButton";
import type { VehicleCardData } from "@/lib/types";

const statusColor: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  RESERVED: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  SOLD: "bg-rose-500/20 text-rose-300 border-rose-400/30",
  DRAFT: "bg-white/10 text-white/60 border-white/20",
};

export function VehicleCard({ v, phone }: { v: VehicleCardData; phone: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="glass glass-hover group overflow-hidden"
    >
      <Link href={`/vehicles/${v.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        {v.image ? (
          <Image
            src={v.image}
            alt={v.title}
            fill
            sizes="(max-width:768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-ink-800 text-[rgb(var(--muted))]">No image</div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {v.featured && <span className="chip border-accent/40 bg-black/40 text-white">★ Featured</span>}
          <span className={`chip border ${statusColor[v.status] ?? statusColor.DRAFT}`}>{STATUS_LABEL[v.status]}</span>
        </div>
        <div className="absolute right-3 top-3">
          <SaveVehicleButton slug={v.slug} />
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        <Link href={`/vehicles/${v.slug}`} className="font-display text-xs font-semibold leading-snug hover:text-accent sm:text-base line-clamp-2">
          {v.title}
        </Link>
        <p className="mt-1 text-base font-bold heading-gradient sm:text-xl">{formatPrice(v.price)}</p>

        <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-[rgb(var(--muted))]">
          <span className="flex items-center gap-1"><Calendar size={11} /> {v.year}</span>
          <span className="flex items-center gap-1"><Gauge size={11} /> {formatMileage(v.mileage)}</span>
          <span className="hidden items-center gap-1 sm:flex"><Fuel size={11} /> {v.fuelType ?? "—"}</span>
          <span className="hidden items-center gap-1 sm:flex"><Cog size={11} /> {v.transmission ?? "—"}</span>
        </div>

        <div className="mt-3 flex gap-2">
          <Link href={`/vehicles/${v.slug}`} className="btn-ghost flex-1 py-1.5 text-xs">View</Link>
          <a href={telHref(phone)} className="btn-accent py-1.5 text-xs" aria-label="Call now"><Phone size={13} /></a>
        </div>
      </div>
    </motion.article>
  );
}
