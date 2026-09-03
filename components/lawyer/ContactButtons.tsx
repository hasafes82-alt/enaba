"use client";

import { useState } from "react";
import { Loader2, MessageCircle, Phone } from "lucide-react";
import { buildDirectoryContactMessage, buildTelLink, buildWhatsAppLink } from "@/lib/phone";

interface ContactButtonsProps {
  lawyerId: string;
  courtName: string;
}

type Action = "whatsapp" | "call" | null;

/**
 * لا يحتوي هذا المكوّن على رقم الهاتف مطلقًا حتى الضغط — يُجلب فرديًا من
 * app/api/contact عند الطلب فقط (SPEC.md §6/ADR-05).
 */
export function ContactButtons({ lawyerId, courtName }: ContactButtonsProps) {
  const [loading, setLoading] = useState<Action>(null);
  const [error, setError] = useState<string | null>(null);

  async function reveal(action: Exclude<Action, null>) {
    setLoading(action);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lawyerId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "تعذّر جلب بيانات التواصل");
        return;
      }

      if (action === "whatsapp") {
        const message = buildDirectoryContactMessage(data.fullName, courtName);
        window.open(buildWhatsAppLink(data.whatsapp, message), "_blank", "noopener,noreferrer");
      } else {
        window.location.href = buildTelLink(data.phone);
      }
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => reveal("whatsapp")}
          disabled={loading !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-whatsapp px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading === "whatsapp" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          )}
          تواصل عبر واتساب
        </button>
        <button
          type="button"
          onClick={() => reveal("call")}
          disabled={loading !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-900 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading === "call" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Phone className="h-4 w-4" aria-hidden="true" />
          )}
          اتصال هاتفي
        </button>
      </div>
      {error && <p className="text-xs text-urgent">{error}</p>}
    </div>
  );
}
