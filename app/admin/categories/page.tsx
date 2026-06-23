import { getFilterOptions } from "@/lib/vehicles";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const options = await getFilterOptions();
  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold heading-gradient">Categories</h1>
      <p className="mb-6 text-sm text-[rgb(var(--muted))]">Manage the makes, models, fuel types, body styles and colours available when adding vehicles.</p>
      <CategoryManager options={options} />
    </div>
  );
}
