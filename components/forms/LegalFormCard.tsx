"use client";

import { useState } from "react";
import { FileText, Loader2, MessageCircle } from "lucide-react";
import { toE164, buildWhatsAppLink } from "@/lib/phone";
import { FORMS_WHATSAPP_NUMBER } from "@/lib/constants";
import type { LegalForm } from "@/lib/data/legal-forms";

export function LegalFormCard({ form }: { form: LegalForm }) {
  const [open, setOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function order(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const e164 = toE164(whatsapp);
    if (!e164) {
      setError("رقم واتساب غير صحيح");
      return;
    }

    setStatus("loading");
    const res = await fetch(`/api/legal-forms/${form.id}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsapp: e164 }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("idle");
      setError(data.error ?? "تعذّر إرسال الطلب");
      return;
    }

    setStatus("done");

    if (FORMS_WHATSAPP_NUMBER) {
      const message = `السلام عليكم، أرغب في طلب نموذج "${form.title}" (${form.price_egp} ج.م) — وصلني عبر منصة إنابة.`;
      window.open(buildWhatsAppLink(FORMS_WHATSAPP_NUMBER, message), "_blank", "noopener,noreferrer");
    }
  }

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-navy-700">{form.category}</p>
          <h3 className="font-semibold text-navy-900">{form.title}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-gold-600/10 px-2.5 py-1 text-xs font-bold text-gold-700">
          {form.price_egp} ج.م
        </span>
      </div>

      {form.description && <p className="text-sm text-navy-700">{form.description}</p>}

      {status === "done" ? (
        <p className="rounded-lg bg-verified/10 px-3 py-2.5 text-center text-sm font-medium text-verified">
          تم استلام طلبك — سيتواصل معك فريق إنابة عبر واتساب لتأكيد الدفع والتسليم.
        </p>
      ) : open ? (
        <form onSubmit={order} className="flex flex-col gap-2">
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="رقم واتساب (01xxxxxxxxx)"
            required
            className="min-h-11 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-navy-900 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
          />
          {error && <p className="text-xs text-urgent">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-whatsapp px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              )}
              إرسال الطلب
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-11 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-navy-700"
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gold-600 px-3 py-2.5 text-sm font-semibold text-white"
        >
          اطلب النموذج
        </button>
      )}
    </article>
  );
}
