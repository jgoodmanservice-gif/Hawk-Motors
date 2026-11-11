import { Sparkles } from "lucide-react";

const ITEMS = [
  "Handpicked used cars",
  "Part exchange welcome",
  "No-pressure viewings",
  "Fully prepared before sale",
  "Leicester & East Midlands",
  "Honest, transparent pricing",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee relative mt-8 overflow-hidden border-y bg-white/[0.02] py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="marquee-track flex w-max gap-10">
        {row.map((t, k) => (
          <span key={k} aria-hidden={k >= ITEMS.length} className="flex items-center gap-10 whitespace-nowrap font-display text-lg uppercase tracking-wider text-[rgb(var(--muted))] sm:text-2xl">
            {t} <Sparkles size={16} className="text-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
