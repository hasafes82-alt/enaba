"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, Loader2, XCircle } from "lucide-react";
import { REGISTRATION_DEGREE_LABELS } from "@/lib/constants";
import type { PendingLawyer } from "@/lib/data/admin";

interface VerificationCardProps {
  lawyer: PendingLawyer;
  governorateName: string | undefined;
}

export function VerificationCard({ lawyer, governorateName }: VerificationCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"view" | "approve" | "reject" | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function viewCarnet() {
    setLoading("view");
    setError(null);
    try {
      const res = await fetch(`/api/admin/carnet/${lawyer.id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر عرض الكارنيه");
        return;
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(null);
    }
  }

  async function decide(action: "approve" | "reject") {
    setLoading(action);
    setError(null);
    const res = await fetch(`/api/admin/verifications/${lawyer.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason: action === "reject" ? reason : undefined }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setError(data.error ?? "تعذّر تنفيذ القرار");
      return;
    }
    router.refresh();
  }

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-navy-900">{lawyer.full_name}</h3>
          <p className="text-xs text-navy-700">
            {REGISTRATION_DEGREE_LABELS[lawyer.registration_degree]} · {governorateName ?? "—"} ·{" "}
            {lawyer.phone}
          </p>
        </div>
        {lawyer.bar_number && (
          <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
            قيد {lawyer.bar_number}
          </span>
        )}
      </div>

      {lawyer.bio && <p className="text-sm text-navy-700">{lawyer.bio}</p>}

      <button
        type="button"
        onClick={viewCarnet}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-navy-900 disabled:opacity-60"
      >
        {loading === "view" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
        عرض صورة الكارنيه
      </button>

      {showReject && (
        <textarea
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          placeholder="سبب الرفض (سيظهر للمحامي)"
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => decide("approve")}
          disabled={loading !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-verified px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading === "approve" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          )}
          قبول
        </button>
        <button
          type="button"
          onClick={() => (showReject ? decide("reject") : setShowReject(true))}
          disabled={loading !== null || (showReject && reason.trim().length === 0)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-urgent px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading === "reject" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <XCircle className="h-4 w-4" aria-hidden="true" />
          )}
          {showReject ? "تأكيد الرفض" : "رفض"}
        </button>
      </div>
      {error && <p className="text-xs text-urgent">{error}</p>}
    </article>
  );
}
