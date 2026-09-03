import { ShieldCheck } from "lucide-react";
import { getPendingLawyers } from "@/lib/data/admin";
import { getGovernorates } from "@/lib/data/reference";
import { VerificationCard } from "@/components/admin/VerificationCard";

export const metadata = { title: "طلبات التوثيق" };

export default async function AdminVerificationsPage() {
  const [lawyers, governorates] = await Promise.all([getPendingLawyers(), getGovernorates()]);
  const governorateNameById = new Map(governorates.map((g) => [g.id, g.name_ar]));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-navy-900">
        طلبات التوثيق <span className="text-navy-700">({lawyers.length})</span>
      </h1>

      {lawyers.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <ShieldCheck className="h-10 w-10 text-verified/60" aria-hidden="true" />
          <p className="font-medium text-navy-900">لا توجد طلبات توثيق معلَّقة</p>
          <p className="text-sm text-navy-700">كل التسجيلات الجديدة مراجَعة حاليًا.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {lawyers.map((lawyer) => (
            <VerificationCard
              key={lawyer.id}
              lawyer={lawyer}
              governorateName={governorateNameById.get(lawyer.governorate_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
