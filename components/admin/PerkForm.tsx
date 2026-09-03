"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

const CATEGORY_OPTIONS = [
  "محلات البدل والأرواب",
  "المكتبات ودور النشر القانونية",
  "أجهزة وسكانرات المكاتب",
  "دورات ودبلومات لغات وتحكيم",
];

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-navy-900 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600";

export function PerkForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/perks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: form.get("category"),
        partnerName: form.get("partnerName"),
        title: form.get("title"),
        description: form.get("description"),
        discountCode: form.get("discountCode"),
        whatsapp: form.get("whatsapp"),
        phone: form.get("phone"),
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "تعذّر إضافة العرض");
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
        إضافة عرض جديد
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2"
    >
      <select name="category" className={inputClass} required>
        <option value="">الفئة</option>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input name="partnerName" placeholder="اسم الشريك/المتجر" className={inputClass} required />
      <input name="title" placeholder="عنوان العرض" className={inputClass} required />
      <input name="discountCode" placeholder="كود الخصم (اختياري)" className={inputClass} />
      <input name="whatsapp" placeholder="رقم واتساب (اختياري)" className={inputClass} />
      <input name="phone" placeholder="رقم هاتف (اختياري)" className={inputClass} />
      <textarea
        name="description"
        placeholder="وصف العرض (اختياري)"
        className={`${inputClass} sm:col-span-2`}
        rows={2}
      />
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
