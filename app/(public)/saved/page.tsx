"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VehicleCard } from "@/components/VehicleCard";
import type { VehicleCardData } from "@/lib/types";

const PHONE = process.env.NEXT_PUBLIC_PHONE || "07514552586";

function useSlugList(key: string) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    const read = () => {
      try { setSlugs(JSON.parse(localStorage.getItem(key) || "[]")); } catch { setSlugs([]); }
    };
    read();
    window.addEventListener("hawk:saved-changed", read);
    return () => window.removeEventListener("hawk:saved-changed", read);
  }, [key]);
  return slugs;
}

function useCards(slugs: string[]) {
  const [cards, setCards] = useState<VehicleCardData[]>([]);
  useEffect(() => {
    if (!slugs.length) { setCards([]); return; }
    fetch(`/api/vehicles?slugs=${slugs.join(",")}`)
      .then((r) => r.json())
      .then((data: VehicleCardData[]) => {
        // preserve order of slugs
        const order = new Map(slugs.map((s, i) => [s, i]));
        setCards([...data].sort((a, b) => (order.get(a.slug)! - order.get(b.slug)!)));
      })
      .catch(() => setCards([]));
  }, [slugs.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
  return cards;
}

export default function SavedPage() {
  const saved = useSlugList("hawk:saved");
  const recent = useSlugList("hawk:recent");
  const savedCards = useCards(saved);
  const recentCards = useCards(recent);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold heading-gradient">My garage</h1>
      <p className="mt-1 text-[rgb(var(--muted))]">Vehicles you&apos;ve saved and recently viewed (stored on this device).</p>

      <section className="mt-10">
        <h2 className="mb-5 font-display text-2xl font-bold">Saved vehicles</h2>
        {savedCards.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedCards.map((v) => <VehicleCard key={v.id} v={v} phone={PHONE} />)}
          </div>
        ) : (
          <div className="glass p-10 text-center text-[rgb(var(--muted))]">
            No saved vehicles yet. Tap the heart on any vehicle to save it. <Link href="/inventory" className="text-accent">Browse inventory →</Link>
          </div>
        )}
      </section>

      {recentCards.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-2xl font-bold">Recently viewed</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentCards.map((v) => <VehicleCard key={v.id} v={v} phone={PHONE} />)}
          </div>
        </section>
      )}
    </div>
  );
}
