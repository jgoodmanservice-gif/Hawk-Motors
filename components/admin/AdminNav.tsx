"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Car, Inbox, Tags, Settings, LogOut, ExternalLink } from "lucide-react";
import { Logo } from "@/components/Logo";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const path = usePathname();
  if (path === "/admin/login") return null; // login page has no nav
  return (
    <aside className="flex w-full flex-row gap-1 overflow-x-auto p-3 md:h-screen md:w-64 md:flex-col md:gap-1 md:border-r md:border-white/5">
      <Link href="/" className="mb-4 hidden items-center gap-2 px-2 md:flex">
        <Logo variant="mark" className="h-9 w-14" />
        <span className="metal-text font-display text-sm font-extrabold uppercase tracking-widest">Hawk Admin</span>
      </Link>
      {items.map((it) => {
        const active = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-accent/15 text-accent" : "text-[rgb(var(--muted))] hover:bg-white/5 hover:text-[rgb(var(--fg))]"}`}>
            <it.icon size={17} /> <span className="whitespace-nowrap">{it.label}</span>
          </Link>
        );
      })}
      <div className="mt-auto hidden flex-col gap-1 md:flex">
        <a href="/" target="_blank" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[rgb(var(--muted))] hover:bg-white/5"><ExternalLink size={17} /> View site</a>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-300 hover:bg-rose-500/10"><LogOut size={17} /> Sign out</button>
      </div>
      <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="ml-auto flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-rose-300 md:hidden"><LogOut size={17} /></button>
    </aside>
  );
}
