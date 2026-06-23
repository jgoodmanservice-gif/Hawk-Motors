import Link from "next/link";
import { Car, CheckCircle, Star, Inbox, Plus, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  const [total, available, featured, reserved, sold, enquiries, newEnquiries, recent, topViewed] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
    prisma.vehicle.count({ where: { featured: true } }),
    prisma.vehicle.count({ where: { status: "RESERVED" } }),
    prisma.vehicle.count({ where: { status: "SOLD" } }),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.vehicle.findMany({ orderBy: { views: "desc" }, take: 5, select: { id: true, title: true, views: true, price: true, status: true } }),
  ]);
  return { total, available, featured, reserved, sold, enquiries, newEnquiries, recent, topViewed };
}

const Stat = ({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent?: boolean }) => (
  <div className="glass p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm text-[rgb(var(--muted))]">{label}</p>
      <Icon size={18} className={accent ? "text-accent" : "text-[rgb(var(--muted))]"} />
    </div>
    <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
  </div>
);

export default async function Dashboard() {
  const s = await getStats();
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold heading-gradient">Dashboard</h1>
          <p className="text-sm text-[rgb(var(--muted))]">Overview of your stock and enquiries.</p>
        </div>
        <Link href="/admin/vehicles/new" className="btn-accent"><Plus size={16} /> Add vehicle</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Car} label="Total vehicles" value={s.total} />
        <Stat icon={CheckCircle} label="Available" value={s.available} accent />
        <Stat icon={Star} label="Featured" value={s.featured} />
        <Stat icon={Inbox} label="New enquiries" value={s.newEnquiries} accent />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Stat icon={Car} label="Reserved" value={s.reserved} />
        <Stat icon={Car} label="Sold" value={s.sold} />
        <Stat icon={Inbox} label="Total enquiries" value={s.enquiries} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="glass p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-accent">View all →</Link>
          </div>
          {s.recent.length ? (
            <ul className="divide-y divide-white/5">
              {s.recent.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium">{e.name}</p>
                    <p className="text-xs text-[rgb(var(--muted))]">{e.vehicleTitle || e.type} · {formatDate(e.createdAt)}</p>
                  </div>
                  <span className={`chip ${e.status === "NEW" ? "border-accent/40 text-accent" : ""}`}>{e.status}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-[rgb(var(--muted))]">No enquiries yet.</p>}
        </section>

        <section className="glass p-5">
          <h2 className="mb-3 font-display text-lg font-semibold">Most viewed</h2>
          {s.topViewed.length ? (
            <ul className="divide-y divide-white/5">
              {s.topViewed.map((v) => (
                <li key={v.id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link href={`/admin/vehicles/${v.id}/edit`} className="font-medium hover:text-accent">{v.title}</Link>
                  <span className="flex items-center gap-3 text-xs text-[rgb(var(--muted))]">
                    <span>{formatPrice(v.price)}</span>
                    <span className="flex items-center gap-1"><Eye size={13} /> {v.views}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-[rgb(var(--muted))]">No data yet.</p>}
        </section>
      </div>
    </div>
  );
}
