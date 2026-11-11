"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-[padding] duration-300 ${scrolled ? "pt-2" : "pt-0"}`}>
      <div className="px-4">
        <nav className={`glass relative flex items-center justify-between gap-2 overflow-hidden px-4 transition-all duration-300 md:px-6 ${scrolled ? "mx-auto max-w-screen-xl py-1.5 shadow-2xl" : "py-2.5"}`}>
          <motion.span aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent" />
          <Link href="/" className="flex items-center" aria-label="Hawk Motor Centre home">
            <div className="relative">
              <Logo className={`w-auto transition-all duration-300 ${scrolled ? "h-10 md:h-12" : "h-12 md:h-16"}`} />
              {/* Left wing tip */}
              <span className="pointer-events-none absolute" style={{ left: "1%", top: "4%", margin: "-7px 0 0 -7px" }}>
                <span className="wing-sparkle" style={{ animationDelay: "0s" }}>
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="white" aria-hidden="true"><path d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z" /></svg>
                </span>
              </span>
              {/* Diamond */}
              <span className="pointer-events-none absolute" style={{ left: "25%", top: "64%", margin: "-6px 0 0 -6px" }}>
                <span className="wing-sparkle" style={{ animationDelay: "0.9s" }}>
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="white" aria-hidden="true"><path d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z" /></svg>
                </span>
              </span>
              {/* Right wing tip */}
              <span className="pointer-events-none absolute" style={{ left: "52.5%", top: "3%", margin: "-7px 0 0 -7px" }}>
                <span className="wing-sparkle" style={{ animationDelay: "1.8s" }}>
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="white" aria-hidden="true"><path d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z" /></svg>
                </span>
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = l.href === pathname || (l.href === "/inventory" && pathname.startsWith("/vehicles"));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative whitespace-nowrap rounded-lg px-3 py-2.5 lg:px-4 text-base font-medium transition hover:text-[rgb(var(--fg))] ${active ? "text-[rgb(var(--fg))]" : "text-[rgb(var(--muted))]"}`}
                >
                  {l.label}
                  <span className={`absolute inset-x-4 bottom-1 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 group-hover:scale-x-100 ${active ? "scale-x-100" : "scale-x-0"}`} />
                </Link>
              );
            })}
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
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="glass mt-2 flex flex-col gap-1 p-3 md:hidden">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5">
                {l.label}
              </Link>
            ))}
            <a href={telHref(contact.phone)} className="btn-accent mt-1">
              <Phone size={16} /> Call {contact.phone}
            </a>
          </motion.div>
        )}
      </div>
    </header>
  );
}
