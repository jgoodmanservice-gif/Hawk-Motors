"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Gauge, Fuel, Cog, Calendar, Phone, ArrowUpRight } from "lucide-react";
import { formatPrice, formatMileage, STATUS_LABEL } from "@/lib/utils";
import { telHref } from "@/lib/contact";
import type { VehicleCardData } from "@/lib/types";

const statusColor: Record<string, string> = {
  AVAILABLE: "bg-emerald-600 text-white border-emerald-400",
  RESERVED: "bg-amber-400 text-black border-amber-300",
  SOLD: "bg-rose-600 text-white border-rose-400",
  DRAFT: "bg-neutral-700 text-white border-neutral-500",
};

export function VehicleCard({ v, phone, index = 0 }: { v: VehicleCardData; phone: string; index?: number }) {
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  function onMove(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x); py.set(y);
    ref.current.style.setProperty("--mx", `${x * 100}%`);
    ref.current.style.setProperty("--my", `${y * 100}%`);
  }
  const reset = () => { px.set(0.5); py.set(0.5); };

  const sold = v.status === "SOLD";

  return (
    <motion.div
      style={{ perspective: 900 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="glass group relative h-full overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-glow"
      >
        <span className="glare" aria-hidden />

        <Link href={`/vehicles/${v.slug}`} className="relative block aspect-[16/10] overflow-hidden">
          {v.image ? (
            <Image
              src={v.image}
              alt={v.title}
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${sold ? "grayscale-[60%]" : ""}`}
            />
          ) : (
            <div className="grid h-full place-items-center bg-ink-800 text-[rgb(var(--muted))]">No image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute left-3 top-3 hidden gap-2 sm:flex">
            {v.featured && <span className="chip border-accent/60 bg-black/80 font-semibold text-white shadow-lg shadow-black/40">★ Featured</span>}
            <span className={`chip border font-semibold shadow-lg shadow-black/40 ${statusColor[v.status] ?? statusColor.DRAFT}`}>{STATUS_LABEL[v.status]}</span>
          </div>

          {/* Price tag on the photo */}
          <span className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2.5 py-1 font-display text-sm font-bold text-white backdrop-blur-md sm:bottom-3 sm:left-3 sm:text-lg">
            {formatPrice(v.price)}
          </span>

          {/* Slides up on hover */}
          <span className="absolute bottom-3 right-3 hidden translate-y-3 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
            View car <ArrowUpRight size={14} />
          </span>
        </Link>

        <div className="p-3 sm:p-4" style={{ transform: "translateZ(20px)" }}>
          <Link href={`/vehicles/${v.slug}`} className="line-clamp-2 font-display text-xs font-semibold leading-snug transition-colors hover:text-accent sm:text-base">
            {v.title}
          </Link>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs text-[rgb(var(--muted))]">
            <span className="flex items-center gap-1"><Calendar size={11} /> {v.year}</span>
            <span className="flex items-center gap-1"><Gauge size={11} /> {formatMileage(v.mileage)}</span>
            <span className="hidden items-center gap-1 sm:flex"><Fuel size={11} /> {v.fuelType ?? "—"}</span>
            <span className="hidden items-center gap-1 sm:flex"><Cog size={11} /> {v.transmission ?? "—"}</span>
          </div>

          <div className="mt-3 flex gap-2">
            <Link href={`/vehicles/${v.slug}`} className="btn-ghost flex-1 py-1.5 text-xs" aria-label={`View ${v.title}`}>View</Link>
            <a href={telHref(phone)} className="btn-accent py-1.5 text-xs" aria-label="Call now"><Phone size={13} /></a>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
