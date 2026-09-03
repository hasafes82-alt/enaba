import { ClipboardList } from "lucide-react";
import { getAllRequestsForAdmin } from "@/lib/data/admin";
import { AdminRequestRow } from "@/components/admin/AdminRequestRow";

export const metadata = { title: "إدارة طلبات الإنابة" };

export default async function AdminRequestsPage() {
  const requests = await getAllRequestsForAdmin();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-navy-900">
        طلبات الإنابة <span className="text-navy-700">({requests.length})</span>
      </h1>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <ClipboardList className="h-10 w-10 text-navy-700/50" aria-hidden="true" />
          <p className="font-medium text-navy-900">لا توجد طلبات إنابة بعد</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border text-xs text-navy-700">
                <th className="px-3 py-2.5 font-medium">الطالب</th>
                <th className="px-3 py-2.5 font-medium">المحكمة</th>
                <th className="px-3 py-2.5 font-medium">النوع</th>
                <th className="px-3 py-2.5 font-medium">الجلسة</th>
                <th className="px-3 py-2.5 font-medium">الحالة</th>
                <th className="px-3 py-2.5 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <AdminRequestRow key={r.id} request={r} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
