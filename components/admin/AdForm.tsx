"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import type { Governorate } from "@/lib/data/reference";

const SLOT_OPTIONS: { value: string; label: string }[] = [
  { value: "top_leaderboard", label: "شريط علوي (أسفل مرشّحات البحث)" },
  { value: "in_feed", label: "داخل النتائج (كل 4 بطاقات)" },
  { value: "board_inline", label: "داخل لوحة الطلبات" },
  { value: "sticky_footer", label: "شريط سفلي ثابت" },
];

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-navy-900 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600";

export function AdForm({ governorates }: { governorates: Governorate[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const governorateId = form.get("governorateId");

    const res = await fetch("/api/admin/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sponsorName: form.get("sponsorName"),
        slot: form.get("slot"),
        title: form.get("title"),
        bodyText: form.get("bodyText"),
        targetUrl: form.get("targetUrl"),
        targetWhatsapp: form.get("targetWhatsapp"),
        governorateId: governorateId ? Number(governorateId) : null,
        endsAt: form.get("endsAt"),
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "تعذّر إضافة الإعلان");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 self-start rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        إضافة إعلان جديد
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2"
    >
      <input name="sponsorName" placeholder="اسم الراعي" className={inputClass} required />
      <select name="slot" className={inputClass} required>
        <option value="">المساحة الإعلانية</option>
        {SLOT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <input name="title" placeholder="عنوان الإعلان" className={inputClass} required />
      <input name="endsAt" type="date" className={inputClass} required />
      <input name="targetUrl" placeholder="رابط الوجهة (اختياري)" className={inputClass} />
      <input name="targetWhatsapp" placeholder="رقم واتساب الراعي (اختياري)" className={inputClass} />
      <select name="governorateId" className={inputClass}>
        <option value="">كل المحافظات</option>
        {governorates.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name_ar}
          </option>
        ))}
      </select>
      <textarea name="bodyText" placeholder="نص الإعلان (اختياري)" className={inputClass} rows={2} />

      {error && <p className="text-sm text-urgent sm:col-span-2">{error}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          حفظ
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-navy-700"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
