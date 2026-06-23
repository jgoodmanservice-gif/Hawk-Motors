"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { telHref, type SiteContact } from "@/lib/contact";

const links = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/#why", label: "Why Us" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar({ contact }: { contact: SiteContact }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50">
      <div className="px-4">
        <nav className="glass flex items-center justify-between px-6 py-2.5">
          <Link href="/" className="flex items-center gap-2" aria-label="Hawk Motors home">
            <Logo variant="mark" className="h-14 w-36 object-cover" style={{ objectPosition: "center 15%" }} />
            <span className="metal-text text-2xl font-extrabold uppercase tracking-[0.2em] font-display">
              Hawk Motors
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-4 py-2.5 text-base font-medium text-[rgb(var(--muted))] transition hover:bg-white/5 hover:text-[rgb(var(--fg))]"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a href={telHref(contact.phone)} className="btn-accent hidden sm:inline-flex text-base px-6 py-3">
              <Phone size={16} /> {contact.phone}
            </a>
            <ThemeToggle />
            <button
              className="grid h-9 w-9 place-items-center rounded-xl border bg-white/5 md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="glass mt-2 flex flex-col gap-1 p-3 md:hidden">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5">
                {l.label}
              </Link>
            ))}
            <a href={telHref(contact.phone)} className="btn-accent mt-1">
              <Phone size={16} /> Call {contact.phone}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
