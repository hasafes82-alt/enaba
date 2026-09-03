"use client";

import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { LEGAL_DISCLAIMER } from "@/lib/constants";

const STORAGE_KEY = "enaba:legal-banner-dismissed-at";
/** يُعاد إظهار الشريط تلقائيًا بعد فترة حتى لو أُغلق — SPEC.md §8/F1
 * ("يُعاد إظهاره عند كل نشر طلب جديد"). نطبّق نسخة زمنية بسيطة هنا؛
 * صفحة نشر الطلب تفرضه صراحةً بغض النظر عن هذا التخزين. */
const REAPPEAR_AFTER_MS = 1000 * 60 * 60 * 24; // يوم واحد

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

function getServerSnapshot(): boolean {
  return false; // الافتراضي أثناء SSR: الشريط ظاهر، ثم يُحدَّث بعد الترطيب لو كان مُغلقًا فعلًا
}

export function LegalBanner() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (dismissed) return null;

  return (
    <div className="border-b border-gold-600/30 bg-gold-100 px-4 py-2 text-center text-sm text-navy-900">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3">
        <p className="leading-relaxed">{LEGAL_DISCLAIMER}</p>
        <button
          type="button"
          aria-label="إغلاق التنويه"
          className="shrink-0 rounded-full p-1 text-navy-700 hover:bg-gold-600/20"
          onClick={() => {
            try {
              localStorage.setItem(STORAGE_KEY, String(Date.now()));
              window.dispatchEvent(new StorageEvent("storage"));
            } catch {
              // localStorage قد يكون غير متاح (وضع خاص) — لا شيء يُفعل، الشريط يبقى ظاهرًا
            }
          }}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
