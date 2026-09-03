"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import type { AdminAd } from "@/lib/data/admin";

const SLOT_LABELS: Record<AdminAd["slot"], string> = {
  top_leaderboard: "شريط علوي",
  in_feed: "داخل النتائج",
  board_inline: "داخل اللوحة",
  sticky_footer: "شريط سفلي",
};

export function AdminAdRow({ ad }: { ad: AdminAd }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"toggle" | "delete" | null>(null);

  async function toggleActive() {
    setLoading("toggle");
    await fetch(`/api/admin/ads/${ad.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !ad.is_active }),
    });
    setLoading(null);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`حذف إعلان "${ad.title}"؟`)) return;
    setLoading("delete");
    await fetch(`/api/admin/ads/${ad.id}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  }

  const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "—";

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-3 py-2.5 text-sm text-navy-900">{ad.title}</td>
      <td className="px-3 py-2.5 text-xs text-navy-700">{ad.sponsor_name}</td>
      <td className="px-3 py-2.5 text-xs text-navy-700">{SLOT_LABELS[ad.slot]}</td>
      <td className="px-3 py-2.5 text-xs text-navy-700">{ad.impressions}</td>
      <td className="px-3 py-2.5 text-xs text-navy-700">{ad.clicks}</td>
      <td className="px-3 py-2.5 text-xs text-navy-700">{ctr === "—" ? ctr : `${ctr}%`}</td>
      <td className="px-3 py-2.5">
        <button
          type="button"
          onClick={toggleActive}
          disabled={loading !== null}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            ad.is_active ? "bg-verified/10 text-verified" : "bg-navy-700/10 text-navy-700"
          }`}
        >
          {loading === "toggle" ? "..." : ad.is_active ? "نشط" : "متوقَّف"}
        </button>
      </td>
      <td className="px-3 py-2.5">
        <button
          type="button"
          onClick={remove}
          disabled={loading !== null}
          aria-label="حذف"
          className="rounded-lg border border-urgent/30 p-2 text-urgent hover:bg-urgent/5 disabled:opacity-60"
        >
          {loading === "delete" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </td>
    </tr>
  );
}
