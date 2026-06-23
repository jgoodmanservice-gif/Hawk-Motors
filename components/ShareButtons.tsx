"use client";

import { Facebook, Twitter, Link2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {/* noop */}
  }

  const cls = "grid h-9 w-9 place-items-center rounded-lg border bg-white/5 transition hover:bg-white/10";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[rgb(var(--muted))]">Share</span>
      <a className={cls} href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"><Facebook size={15} /></a>
      <a className={cls} href={`https://twitter.com/intent/tweet?url=${enc}&text=${t}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X"><Twitter size={15} /></a>
      <a className={cls} href={`https://wa.me/?text=${t}%20${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">W</a>
      <button className={cls} onClick={copy} aria-label="Copy link">{copied ? <Check size={15} className="text-emerald-400" /> : <Link2 size={15} />}</button>
    </div>
  );
}
