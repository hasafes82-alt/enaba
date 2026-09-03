import { getAllPerksForAdmin } from "@/lib/data/admin";
import { PerkForm } from "@/components/admin/PerkForm";
import { AdminPerkRow } from "@/components/admin/AdminPerkRow";

export const metadata = { title: "إدارة العروض" };

export default async function AdminPerksPage() {
  const perks = await getAllPerksForAdmin();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-navy-900">
        العروض <span className="text-navy-700">({perks.length})</span>
      </h1>

      <PerkForm />

      {perks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-navy-700">
          لا توجد عروض بعد.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border text-xs text-navy-700">
                <th className="px-3 py-2.5 font-medium">العنوان</th>
                <th className="px-3 py-2.5 font-medium">الشريك</th>
                <th className="px-3 py-2.5 font-medium">الفئة</th>
                <th className="px-3 py-2.5 font-medium">الحالة</th>
                <th className="px-3 py-2.5 font-medium">حذف</th>
              </tr>
            </thead>
            <tbody>
              {perks.map((p) => (
                <AdminPerkRow key={p.id} perk={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
