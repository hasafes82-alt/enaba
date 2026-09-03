"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { formatArabicDate } from "@/lib/date";
import type { AdminReport } from "@/lib/data/admin";

const ENTITY_LABELS: Record<string, string> = {
  lawyer: "محامٍ",
  request: "طلب إنابة",
  ad: "إعلان",
  review: "تقييم",
};

export function ReportRow({ report }: { report: AdminReport }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function resolve() {
    setLoading(true);
    await fetch(`/api/admin/reports/${report.id}`, { method: "PATCH" });
    setLoading(false);
    router.refresh();
  }

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
          {ENTITY_LABELS[report.entity_type] ?? report.entity_type}
        </span>
        <span className="text-xs text-navy-700">{formatArabicDate(report.created_at)}</span>
      </div>
      <p className="text-sm text-navy-900">{report.reason}</p>
      <button
        type="button"
        onClick={resolve}
        disabled={loading}
        className="flex items-center justify-center gap-2 self-start rounded-lg border border-verified/30 px-3 py-2 text-sm font-medium text-verified hover:bg-verified/5 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        )}
        تحديد كمُعالَج
      </button>
    </article>
  );
}
