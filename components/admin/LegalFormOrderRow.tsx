"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/phone";
import type { AdminLegalFormOrder } from "@/lib/data/admin";

const STATUS_LABELS: Record<AdminLegalFormOrder["status"], string> = {
  pending: "جديد",
  paid: "مدفوع",
  delivered: "تم التسليم",
  cancelled: "ملغى",
};

const STATUS_STYLES: Record<AdminLegalFormOrder["status"], string> = {
  pending: "bg-urgent/10 text-urgent",
  paid: "bg-gold-600/10 text-gold-700",
  delivered: "bg-verified/10 text-verified",
  cancelled: "bg-navy-700/10 text-navy-700",
};

export function LegalFormOrderRow({ order }: { order: AdminLegalFormOrder }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: AdminLegalFormOrder["status"]) {
    setLoading(true);
    await fetch(`/api/admin/legal-form-orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  function contact() {
    const message = `السلام عليكم، بخصوص طلبك نموذج "${order.form_title}" عبر منصة إنابة.`;
    window.open(buildWhatsAppLink(order.buyer_whatsapp, message), "_blank", "noopener,noreferrer");
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-3 py-2.5 text-sm text-navy-900">{order.form_title}</td>
      <td className="px-3 py-2.5 text-xs text-navy-700" dir="ltr">
        {order.buyer_whatsapp}
      </td>
      <td className="px-3 py-2.5">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={contact}
            aria-label="تواصل عبر واتساب"
            className="rounded-lg bg-whatsapp p-2 text-white"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </button>
          <select
            value={order.status}
            onChange={(e) => setStatus(e.target.value as AdminLegalFormOrder["status"])}
            disabled={loading}
            className="rounded-lg border border-border bg-bg px-2 py-2 text-xs text-navy-900 disabled:opacity-60"
          >
            {(Object.keys(STATUS_LABELS) as AdminLegalFormOrder["status"][]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-navy-700" aria-hidden="true" />}
        </div>
      </td>
    </tr>
  );
}
