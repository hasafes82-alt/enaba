"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2, Landmark, Loader2, MapPin, MessageCircle } from "lucide-react";
import { DELEGATION_TYPE_LABELS } from "@/lib/constants";
import { daysUntil, formatArabicDate, isUrgent, relativeDayLabel } from "@/lib/date";
import { buildWhatsAppLink } from "@/lib/phone";
import type { BoardRequest } from "@/lib/data/requests";

interface RequestCardProps {
  request: BoardRequest;
  isAuthenticated: boolean;
}

export function RequestCard({ request, isAuthenticated }: RequestCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "accepted" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const daysLeft = daysUntil(request.session_date);
  const urgent = isUrgent(daysLeft) && request.status === "open";
  const isAssigned = request.status === "assigned";

  async function handleAccept() {
    if (!isAuthenticated) {
      router.push("/join?redirectedFrom=/board");
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(`/api/requests/${request.id}/accept`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "تعذّر قبول الطلب");
        setStatus("error");
        return;
      }

      setStatus("accepted");
      const message = `السلام عليكم أستاذ ${data.fullName}، بخصوص طلب الإنابة في ${data.courtName} — وصلني عبر منصة إنابة ويسعدني المساعدة.`;
      window.open(buildWhatsAppLink(data.whatsapp, message), "_blank", "noopener,noreferrer");
    } catch {
      setError("تعذّر الاتصال بالخادم");
      setStatus("error");
    }
  }

  return (
    <article
      className={`flex flex-col gap-3 rounded-xl border bg-surface p-4 shadow-sm ${
        urgent ? "border-urgent/50" : "border-border"
      } ${isAssigned ? "opacity-60" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {urgent && (
          <span className="rounded-full bg-urgent/10 px-2 py-0.5 text-xs font-semibold text-urgent">
            عاجل
          </span>
        )}
        {isAssigned && (
          <span className="rounded-full bg-navy-700/10 px-2 py-0.5 text-xs font-semibold text-navy-700">
            تم الاستلام
          </span>
        )}
        <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
          {DELEGATION_TYPE_LABELS[request.delegation_type]}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm font-medium text-navy-900">
        <Landmark className="h-4 w-4 text-navy-700" aria-hidden="true" />
        {request.court_name ?? "—"}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-navy-700">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        {request.governorate_name ?? "—"}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-navy-700">
        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
        <span title={formatArabicDate(request.session_date)}>{relativeDayLabel(daysLeft)}</span>
      </div>

      <p className="text-sm text-navy-700">{request.details}</p>
      {request.fee_note && (
        <p className="text-xs text-navy-700/80">
          <span className="font-medium">الأتعاب: </span>
          {request.fee_note}
        </p>
      )}

      {status === "accepted" ? (
        <p className="flex items-center gap-2 text-sm font-medium text-verified">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          تم إرسال استجابتك — افتح واتساب للتواصل
        </p>
      ) : (
        <button
          type="button"
          onClick={handleAccept}
          disabled={status === "loading" || isAssigned}
          className="flex items-center justify-center gap-2 rounded-lg bg-gold-600 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          )}
          {isAssigned ? "تم الاستلام من زميل آخر" : "قبول والتواصل مع الزميل"}
        </button>
      )}
      {error && <p className="text-xs text-urgent">{error}</p>}
    </article>
  );
}
