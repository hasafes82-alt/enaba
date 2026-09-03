"use client";

import { useEffect, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { toE164, buildWhatsAppLink } from "@/lib/phone";
import type { Ad } from "@/lib/data/ads";

const STORAGE_KEY = "enaba:sticky-footer-ad-dismissed-at";
const REAPPEAR_AFTER_MS = 1000 * 60 * 60 * 24; // SPEC.md §10: "لا يعود قبل 24 ساعة"

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
function getSnapshot(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const dismissedAt = raw ? Number(raw) : null;
    return dismissedAt !== null && Date.now() - dismissedAt < REAPPEAR_AFTER_MS;
  } catch {
    return false;
  }
}
function getServerSnapshot() {
  return true; // تجنّب أي وميض قبل التحقق من localStorage بعد الترطيب
}

export function StickyFooterAd({ ad }: { ad: Ad }) {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (dismissed) return;
    fetch(`/api/ads/${ad.id}/impression`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(
      () => {},
    );
  }, [ad.id, dismissed]);

  if (dismissed) return null;

  function handleClick() {
    fetch(`/api/ads/${ad.id}/click`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
    if (ad.target_whatsapp) {
      const e164 = toE164(ad.target_whatsapp) ?? ad.target_whatsapp;
      window.open(buildWhatsAppLink(e164, `مهتم بالعرض: ${ad.title}`), "_blank", "noopener,noreferrer");
    } else if (ad.target_url) {
      window.open(ad.target_url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="sticky bottom-0 z-30 flex items-center justify-between gap-3 border-t border-gold-600/30 bg-navy-900 px-4 py-2 text-white">
      <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium">إعلان</span>
      <button type="button" onClick={handleClick} className="flex-1 truncate text-right text-sm">
        {ad.title}
      </button>
      <button
        type="button"
        aria-label="إغلاق الإعلان"
        className="shrink-0 rounded-full p-1 hover:bg-white/10"
        onClick={() => {
          try {
            localStorage.setItem(STORAGE_KEY, String(Date.now()));
            window.dispatchEvent(new StorageEvent("storage"));
          } catch {
            // localStorage غير متاح — يبقى ظاهرًا لهذه الجلسة
          }
        }}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
