"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Search, Phone, KeyRound, Car } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Browse online", body: "Find a car you like in our live stock — every listing has full photos and specs." },
  { icon: Phone, title: "Get in touch", body: "Call, WhatsApp or send an enquiry. We'll answer questions and send extra photos." },
  { icon: Car, title: "View & test drive", body: "Come and see it by appointment — no pressure and no rush." },
  { icon: KeyRound, title: "Drive away", body: "Agree a fair price, part-exchange if you like, and take your keys." },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-20">
      <div className="mb-12 text-center">
        <p className="chip border-accent/30 text-accent">Simple as 1-2-3-4</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold heading-gradient md:text-4xl">How buying works</h2>
      </div>

      <div ref={ref} className="relative mx-auto max-w-3xl">
        <div className="absolute bottom-0 left-6 top-0 w-px bg-[rgb(var(--border)/0.12)] md:left-1/2" />
        <motion.div style={{ scaleY: line }} className="absolute bottom-0 left-6 top-0 w-px origin-top bg-accent shadow-glow md:left-1/2" />

        <ol className="space-y-10">
          {STEPS.map((s, k) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, x: k % 2 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-start gap-5 pl-16 md:w-1/2 md:pl-0 ${k % 2 ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right md:flex-row-reverse"}`}
            >
              <span className={`absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full border border-accent/50 bg-[rgb(var(--bg))] text-accent shadow-glow md:top-0 ${k % 2 ? "md:-left-6" : "md:left-auto md:-right-6"}`}>
                <s.icon size={20} />
              </span>
              <div className="glass flex-1 p-5">
                <p className="font-display text-xs uppercase tracking-widest text-accent">Step {k + 1}</p>
                <h3 className="mt-1 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-[rgb(var(--muted))]">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
