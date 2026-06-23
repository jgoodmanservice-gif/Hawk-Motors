"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { toEmbedUrl, youtubeThumb } from "@/lib/utils";

export type GalleryItem = {
  id: string;
  type: string;
  url: string;
  embedUrl: string | null;
  alt: string | null;
};

const isVideo = (t: string) => t.startsWith("VIDEO");

export function VehicleGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!items.length) {
    return <div className="glass grid aspect-[16/10] place-items-center text-[rgb(var(--muted))]">No media</div>;
  }

  const current = items[active];
  const go = (d: number) => setActive((p) => (p + d + items.length) % items.length);

  return (
    <div>
      <div className="glass relative aspect-[16/10] overflow-hidden">
        {isVideo(current.type) ? (
          <iframe
            key={current.id}
            src={toEmbedUrl(current.embedUrl || current.url)}
            title={current.alt || "Vehicle video"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setLightbox(true)} className="group block h-full w-full">
            <Image src={current.url} alt={current.alt || "Vehicle"} fill priority sizes="(max-width:1024px) 100vw, 66vw" className="object-cover" />
            <span className="absolute bottom-3 right-3 chip border-white/20 bg-black/50 text-white opacity-0 transition group-hover:opacity-100">Click to enlarge</span>
          </button>
        )}

        {items.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md hover:bg-black/60"><ChevronLeft className="text-white" /></button>
            <button onClick={() => go(1)} aria-label="Next" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md hover:bg-black/60"><ChevronRight className="text-white" /></button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {items.map((it, idx) => {
            const thumb = isVideo(it.type) ? youtubeThumb(it.embedUrl || it.url) : it.url;
            return (
              <button
                key={it.id}
                onClick={() => setActive(idx)}
                className={`relative h-16 w-24 flex-none overflow-hidden rounded-lg border-2 transition ${idx === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                {thumb ? <Image src={thumb} alt="" fill className="object-cover" sizes="96px" /> : <span className="grid h-full place-items-center bg-ink-800 text-[rgb(var(--muted))]">▶</span>}
                {isVideo(it.type) && (
                  <span className="absolute inset-0 grid place-items-center bg-black/30"><Play size={16} className="text-white" /></span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {lightbox && !isVideo(current.type) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4"
            onClick={() => setLightbox(false)}
          >
            <button className="absolute right-5 top-5 text-white" aria-label="Close"><X size={28} /></button>
            <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image src={current.url} alt={current.alt || "Vehicle"} fill className="object-contain" sizes="100vw" />
              <button onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 text-white"><ChevronLeft size={36} /></button>
              <button onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white"><ChevronRight size={36} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
