"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toE164, buildWhatsAppLink } from "@/lib/phone";
import type { Ad } from "@/lib/data/ads";

interface AdSlotProps {
  ad: Ad;
  governorateId?: number;
  className?: string;
}

/**
 * مساحة إعلانية مُقاسة — SPEC.md §10. الظهور يُسجَّل عبر IntersectionObserver
 * عند رؤية 50% من الإعلان لمدة ثانية واحدة، والنقرة عند الضغط. وسم "إعلان"
 * ظاهر دائمًا — لا يُخفى أبدًا (قاعدة إلزامية).
 */
export function AdSlot({ ad, governorateId, className = "" }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    if (tracked || !ref.current) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            fetch(`/api/ads/${ad.id}/impression`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ governorateId }),
            }).catch(() => {});
            setTracked(true);
          }, 1000);
        } else if (timer) {
          clearTimeout(timer);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [ad.id, governorateId, tracked]);

  function handleClick() {
    fetch(`/api/ads/${ad.id}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ governorateId }),
    }).catch(() => {});

    if (ad.target_whatsapp) {
      const e164 = toE164(ad.target_whatsapp) ?? ad.target_whatsapp;
      window.open(buildWhatsAppLink(e164, `مهتم بالعرض: ${ad.title}`), "_blank", "noopener,noreferrer");
    } else if (ad.target_url) {
      window.open(ad.target_url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div
      ref={ref}
      className={`relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm ${className}`}
    >
      <span className="absolute left-3 top-3 rounded-full bg-navy-900/80 px-2 py-0.5 text-[10px] font-medium text-white">
        إعلان
      </span>
      <button type="button" onClick={handleClick} className="flex flex-col gap-2 text-right">
        {ad.image_url && (
          <Image
            src={ad.image_url}
            alt={ad.title}
            width={400}
            height={160}
            className="h-32 w-full rounded-lg object-cover"
          />
        )}
        <h3 className="font-semibold text-navy-900">{ad.title}</h3>
        {ad.body && <p className="text-sm text-navy-700">{ad.body}</p>}
      </button>
    </div>
  );
}
