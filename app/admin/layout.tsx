import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <AdminNav />
      <div className="flex-1 p-4 md:p-8">{children}</div>
    </div>
  );
}
