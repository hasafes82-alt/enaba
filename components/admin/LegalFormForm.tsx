"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

const CATEGORY_OPTIONS = ["صحف دعاوى", "مذكرات دفاع", "إنذارات", "عقود"];

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-navy-900 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600";

export function LegalFormForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/legal-forms", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "تعذّر إضافة النموذج");
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
        إضافة نموذج جديد
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
      <input name="title" placeholder="عنوان النموذج" className={inputClass} required />
      <input
        name="priceEgp"
        type="number"
        min="0"
        step="0.01"
        placeholder="السعر (ج.م)"
        className={inputClass}
        required
      />
      <input
        name="file"
        type="file"
        accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className={inputClass}
        required
      />
      <textarea
        name="description"
        placeholder="وصف النموذج (اختياري)"
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
