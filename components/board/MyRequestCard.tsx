"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, UserCheck } from "lucide-react";
import { DELEGATION_TYPE_LABELS } from "@/lib/constants";
import { formatArabicDate } from "@/lib/date";
import { ReviewForm } from "@/components/board/ReviewForm";
import type { MyRequest } from "@/lib/data/my-requests";

const STATUS_LABELS: Record<MyRequest["status"], string> = {
  open: "مفتوح — بانتظار استجابات",
  assigned: "تم الإسناد",
  completed: "مكتمل",
  cancelled: "مُغلَق",
  expired: "منتهٍ",
};

export function MyRequestCard({ request }: { request: MyRequest }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function assign(lawyerId: string) {
    setLoading(lawyerId);
    setError(null);
    const res = await fetch(`/api/requests/${request.id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lawyerId }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setError(data.error ?? "تعذّر الإسناد");
      return;
    }
    router.refresh();
  }

  async function complete() {
    setLoading("complete");
    setError(null);
    const res = await fetch(`/api/requests/${request.id}/complete`, { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setError(data.error ?? "تعذّر إتمام الطلب");
      return;
    }
    router.refresh();
  }

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium text-navy-900">
          {DELEGATION_TYPE_LABELS[request.delegation_type]} — {request.court_name}
        </h3>
        <span className="rounded-full bg-navy-900/5 px-2 py-0.5 text-xs font-medium text-navy-900">
          {STATUS_LABELS[request.status]}
        </span>
      </div>
      <p className="text-xs text-navy-700">جلسة {formatArabicDate(request.session_date)}</p>

      {request.status === "open" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-navy-900">
            الاستجابات ({request.responses.length})
          </p>
          {request.responses.length === 0 ? (
            <p className="text-sm text-navy-700">لا توجد استجابات بعد.</p>
          ) : (
            request.responses.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-navy-900">{r.lawyer_name}</p>
                  {r.message && <p className="text-xs text-navy-700">{r.message}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => assign(r.lawyer_id)}
                  disabled={loading !== null}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gold-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {loading === r.lawyer_id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  إسناد له
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {request.status === "assigned" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-navy-700">
            مُسنَد إلى <span className="font-medium text-navy-900">{request.assigned_to_name}</span>
          </p>
          <button
            type="button"
            onClick={complete}
            disabled={loading !== null}
            className="flex items-center justify-center gap-2 self-start rounded-lg bg-verified px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading === "complete" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            )}
            تحديد كمكتمل
          </button>
        </div>
      )}

      {request.status === "completed" && request.assigned_to && !request.already_reviewed && (
        <ReviewForm
          requestId={request.id}
          revieweeId={request.assigned_to}
          revieweeLabel={request.assigned_to_name ?? "الزميل"}
        />
      )}

      {error && <p className="text-xs text-urgent">{error}</p>}
    </article>
  );
}
