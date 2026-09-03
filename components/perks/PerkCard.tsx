"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, MessageCircle, Tag } from "lucide-react";
import { toE164, buildWhatsAppLink } from "@/lib/phone";
import type { Perk } from "@/lib/data/perks";

export function PerkCard({ perk }: { perk: Perk }) {
  const [copied, setCopied] = useState(false);

  async function redeem() {
    fetch(`/api/perks/${perk.id}/redeem`, { method: "POST" }).catch(() => {});
    const rawPhone = perk.whatsapp ?? perk.phone;
    if (!rawPhone) return;
    const e164 = toE164(rawPhone) ?? rawPhone;
    const message = `السلام عليكم، بخصوص عرض "${perk.title}" (${perk.discount_code ?? ""}) — وصلني عبر منصة إنابة.`;
    window.open(buildWhatsAppLink(e164, message), "_blank", "noopener,noreferrer");
  }

  function copyCode() {
    if (!perk.discount_code) return;
    navigator.clipboard.writeText(perk.discount_code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {perk.logo_url ? (
          <Image
            src={perk.logo_url}
            alt={perk.partner_name}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
            <Tag className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        <div>
          <p className="text-xs text-navy-700">{perk.partner_name}</p>
          <h3 className="font-semibold text-navy-900">{perk.title}</h3>
        </div>
      </div>

      {perk.description && <p className="text-sm text-navy-700">{perk.description}</p>}

      <div className="flex items-center gap-2">
        {perk.discount_code && (
          <button
            type="button"
            onClick={copyCode}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-gold-600 px-3 py-2 text-sm font-mono font-semibold text-gold-700"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {perk.discount_code}
          </button>
        )}
        {(perk.whatsapp || perk.phone) && (
          <button
            type="button"
            onClick={redeem}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-whatsapp px-3 py-2.5 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            استفد من العرض
          </button>
        )}
      </div>
    </article>
  );
}
