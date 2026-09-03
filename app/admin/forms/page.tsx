import { getAllLegalFormsForAdmin, getLegalFormOrdersForAdmin } from "@/lib/data/admin";
import { LegalFormForm } from "@/components/admin/LegalFormForm";
import { AdminLegalFormRow } from "@/components/admin/AdminLegalFormRow";
import { LegalFormOrderRow } from "@/components/admin/LegalFormOrderRow";

export const metadata = { title: "إدارة مكتبة النماذج" };

export default async function AdminLegalFormsPage() {
  const [forms, orders] = await Promise.all([getAllLegalFormsForAdmin(), getLegalFormOrdersForAdmin()]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-navy-900">
          الكتالوج <span className="text-navy-700">({forms.length})</span>
        </h1>

        <LegalFormForm />

        {forms.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-navy-700">
            لا توجد نماذج بعد.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border text-xs text-navy-700">
                  <th className="px-3 py-2.5 font-medium">العنوان</th>
                  <th className="px-3 py-2.5 font-medium">الفئة</th>
                  <th className="px-3 py-2.5 font-medium">السعر</th>
                  <th className="px-3 py-2.5 font-medium">الحالة</th>
                  <th className="px-3 py-2.5 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((f) => (
                  <AdminLegalFormRow key={f.id} form={f} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-navy-900">
          طلبات الشراء <span className="text-navy-700">({orders.length})</span>
        </h2>

        {orders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-navy-700">
            لا توجد طلبات بعد.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border text-xs text-navy-700">
                  <th className="px-3 py-2.5 font-medium">النموذج</th>
                  <th className="px-3 py-2.5 font-medium">واتساب المشتري</th>
                  <th className="px-3 py-2.5 font-medium">الحالة</th>
                  <th className="px-3 py-2.5 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <LegalFormOrderRow key={o.id} order={o} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
