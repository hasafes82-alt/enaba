"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, Trash2 } from "lucide-react";
import type { AdminLegalForm } from "@/lib/data/admin";

export function AdminLegalFormRow({ form }: { form: AdminLegalForm }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"toggle" | "delete" | "download" | null>(null);

  async function togglePublished() {
    setLoading("toggle");
    await fetch(`/api/admin/legal-forms/${form.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !form.is_published }),
    });
    setLoading(null);
    router.refresh();
  }

  async function download() {
    setLoading("download");
    const res = await fetch(`/api/admin/legal-forms/${form.id}/download`);
    const data = await res.json().catch(() => ({}));
    setLoading(null);
    if (res.ok && data.url) {
      window.open(data.url, "_blank", "noopener,noreferrer");
    }
  }

  async function remove() {
    if (!confirm(`حذف نموذج "${form.title}"؟`)) return;
    setLoading("delete");
    await fetch(`/api/admin/legal-forms/${form.id}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-3 py-2.5 text-sm text-navy-900">{form.title}</td>
      <td className="px-3 py-2.5 text-xs text-navy-700">{form.category}</td>
      <td className="px-3 py-2.5 text-xs text-navy-700">{form.price_egp} ج.م</td>
      <td className="px-3 py-2.5">
        <button
          type="button"
          onClick={togglePublished}
          disabled={loading !== null}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            form.is_published ? "bg-verified/10 text-verified" : "bg-navy-700/10 text-navy-700"
          }`}
        >
          {loading === "toggle" ? "..." : form.is_published ? "منشور" : "مخفي"}
        </button>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={download}
            disabled={loading !== null}
            aria-label="تحميل الملف"
            className="rounded-lg border border-border p-2 text-navy-700 hover:bg-bg disabled:opacity-60"
          >
            {loading === "download" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
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
        </div>
      </td>
    </tr>
  );
}
