import { getAllAdsForAdmin } from "@/lib/data/admin";
import { getGovernorates } from "@/lib/data/reference";
import { AdForm } from "@/components/admin/AdForm";
import { AdminAdRow } from "@/components/admin/AdminAdRow";

export const metadata = { title: "إدارة الإعلانات" };

export default async function AdminAdsPage() {
  const [ads, governorates] = await Promise.all([getAllAdsForAdmin(), getGovernorates()]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-navy-900">
        الإعلانات <span className="text-navy-700">({ads.length})</span>
      </h1>

      <AdForm governorates={governorates} />

      {ads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-navy-700">
          لا توجد إعلانات بعد.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border text-xs text-navy-700">
                <th className="px-3 py-2.5 font-medium">العنوان</th>
                <th className="px-3 py-2.5 font-medium">الراعي</th>
                <th className="px-3 py-2.5 font-medium">المساحة</th>
                <th className="px-3 py-2.5 font-medium">ظهور</th>
                <th className="px-3 py-2.5 font-medium">نقرات</th>
                <th className="px-3 py-2.5 font-medium">CTR</th>
                <th className="px-3 py-2.5 font-medium">الحالة</th>
                <th className="px-3 py-2.5 font-medium">حذف</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <AdminAdRow key={ad.id} ad={ad} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
