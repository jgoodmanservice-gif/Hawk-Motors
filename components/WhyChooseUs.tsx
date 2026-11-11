"use client";

import { motion } from "framer-motion";
import { PoundSterling, Handshake, Gauge, ShieldCheck } from "lucide-react";
import { spotlightMove } from "./fx/useSpotlight";

const items = [
  { icon: PoundSterling, title: "Instant Valuation", body: "Fair, transparent pricing on every vehicle — and on yours if you're part-exchanging." },
  { icon: Handshake, title: "Competitive Offers", body: "Handpicked premium stock at prices that stand up against the market." },
  { icon: Gauge, title: "Fast & Easy Process", body: "No pressure, no jargon. View, enquire and drive away with minimal fuss." },
  { icon: ShieldCheck, title: "Safe & Reliable", body: "Every car fully checked and prepared, with warranty and history you can trust." },
];

export function WhyChooseUs() {
  return (
    <section id="why" className="mx-auto max-w-screen-2xl scroll-mt-28 px-4 py-20">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-extrabold heading-gradient md:text-4xl">Why choose Hawk Motors</h2>
        <p className="mx-auto mt-2 max-w-xl text-[rgb(var(--muted))]">A premium buying experience built on trust, quality and speed.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, k) => (
          <motion.div
            key={it.title}
            onPointerMove={spotlightMove}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: k * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="glass spotlight group p-6"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-accent/30 bg-white/5 text-accent transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:shadow-glow">
              <it.icon size={22} />
            </div>
            <span aria-hidden className="absolute right-5 top-4 font-display text-5xl font-extrabold text-outline opacity-50">0{k + 1}</span>
            <h3 className="mt-4 font-display text-lg font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-sm text-[rgb(var(--muted))]">{it.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
