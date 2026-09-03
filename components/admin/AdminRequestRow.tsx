"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, XCircle } from "lucide-react";
import { DELEGATION_TYPE_LABELS } from "@/lib/constants";
import { formatArabicDate } from "@/lib/date";
import type { AdminRequestRow as Row } from "@/lib/data/admin";

const STATUS_LABELS: Record<Row["status"], string> = {
  open: "مفتوح",
  assigned: "تم الإسناد",
  completed: "مكتمل",
  cancelled: "مُغلَق",
  expired: "منتهٍ",
};

export function AdminRequestRow({ request }: { request: Row }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"cancel" | "delete" | null>(null);

  async function cancelRequest() {
    setLoading("cancel");
    await fetch(`/api/admin/requests/${request.id}`, { method: "PATCH" });
    setLoading(null);
    router.refresh();
  }

  async function deleteRequest() {
    if (!confirm("حذف هذا الطلب نهائيًا؟")) return;
    setLoading("delete");
    await fetch(`/api/admin/requests/${request.id}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-3 py-2.5 text-sm text-navy-900">{request.requester_name ?? "—"}</td>
      <td className="px-3 py-2.5 text-sm text-navy-700">
        {request.court_name} · {request.governorate_name}
      </td>
      <td className="px-3 py-2.5 text-sm text-navy-700">{DELEGATION_TYPE_LABELS[request.delegation_type]}</td>
      <td className="px-3 py-2.5 text-xs text-navy-700">{formatArabicDate(request.session_date)}</td>
      <td className="px-3 py-2.5 text-xs font-medium text-navy-900">{STATUS_LABELS[request.status]}</td>
      <td className="px-3 py-2.5">
        <div className="flex gap-1.5">
          {request.status === "open" && (
            <button
              type="button"
              onClick={cancelRequest}
              disabled={loading !== null}
              aria-label="إغلاق الطلب"
              title="إغلاق الطلب"
              className="rounded-lg border border-border p-2 text-navy-700 hover:bg-bg disabled:opacity-60"
            >
              {loading === "cancel" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <XCircle className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={deleteRequest}
            disabled={loading !== null}
            aria-label="حذف الطلب"
            title="حذف الطلب"
            className="rounded-lg border border-urgent/30 p-2 text-urgent hover:bg-urgent/5 disabled:opacity-60"
          >
            {loading === "delete" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
