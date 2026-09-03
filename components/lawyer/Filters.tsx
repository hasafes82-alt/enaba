"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { REGISTRATION_DEGREE_OPTIONS } from "@/lib/constants";
import type { Court, Governorate } from "@/lib/data/reference";

interface FiltersProps {
  governorates: Governorate[];
  courts: Court[];
}

export function Filters({ governorates, courts }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const governorateSlug = searchParams.get("governorate") ?? "";
  const courtSlug = searchParams.get("court") ?? "";
  const degree = searchParams.get("degree") ?? "";

  const selectedGovernorate = governorates.find((g) => g.slug === governorateSlug);
  const availableCourts = selectedGovernorate
    ? courts.filter((c) => c.governorate_id === selectedGovernorate.id)
    : [];

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "governorate") params.delete("court");
    router.replace(`/?${params.toString()}`);
  }

  const selectClass =
    "rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-navy-900 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <select
        aria-label="المحافظة"
        className={selectClass}
        value={governorateSlug}
        onChange={(e) => updateParam("governorate", e.target.value)}
      >
        <option value="">كل المحافظات</option>
        {governorates.map((g) => (
          <option key={g.id} value={g.slug}>
            {g.name_ar}
          </option>
        ))}
      </select>

      <select
        aria-label="المحكمة"
        className={selectClass}
        value={courtSlug}
        disabled={!selectedGovernorate}
        onChange={(e) => updateParam("court", e.target.value)}
      >
        <option value="">{selectedGovernorate ? "كل المحاكم" : "اختر المحافظة أولًا"}</option>
        {availableCourts.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name_ar}
          </option>
        ))}
      </select>

      <select
        aria-label="درجة القيد"
        className={selectClass}
        value={degree}
        onChange={(e) => updateParam("degree", e.target.value)}
      >
        <option value="">كل درجات القيد</option>
        {REGISTRATION_DEGREE_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
