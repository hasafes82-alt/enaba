import { Flag } from "lucide-react";
import { getOpenReports } from "@/lib/data/admin";
import { ReportRow } from "@/components/admin/ReportRow";

export const metadata = { title: "البلاغات" };

export default async function AdminReportsPage() {
  const reports = await getOpenReports();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-navy-900">
        البلاغات <span className="text-navy-700">({reports.length})</span>
      </h1>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <Flag className="h-10 w-10 text-navy-700/50" aria-hidden="true" />
          <p className="font-medium text-navy-900">لا توجد بلاغات مفتوحة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reports.map((r) => (
            <ReportRow key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}
