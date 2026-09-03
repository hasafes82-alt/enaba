"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DELEGATION_TYPE_OPTIONS } from "@/lib/constants";
import type { Court, Governorate } from "@/lib/data/reference";
import type { DelegationType } from "@/types/database";

interface NewRequestFormProps {
  governorates: Governorate[];
  courts: Court[];
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-navy-900 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600";

export function NewRequestForm({ governorates, courts }: NewRequestFormProps) {
  const router = useRouter();
  const [governorateId, setGovernorateId] = useState<number | "">("");
  const [courtId, setCourtId] = useState<number | "">("");
  const [delegationType, setDelegationType] = useState<DelegationType | "">("");
  const [sessionDate, setSessionDate] = useState("");
  const [details, setDetails] = useState("");
  const [feeNote, setFeeNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableCourts = useMemo(
    () => courts.filter((c) => c.governorate_id === governorateId),
    [courts, governorateId],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!governorateId || !courtId || !delegationType || !sessionDate || details.trim().length < 10) {
      setError("من فضلك أكمل كل الحقول (التفاصيل 10 أحرف على الأقل)");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/join?redirectedFrom=/board/new");
      return;
    }

    const { error: insertError } = await supabase.from("delegation_requests").insert({
      requester_id: user.id,
      court_id: courtId,
      governorate_id: governorateId,
      delegation_type: delegationType,
      session_date: sessionDate,
      details: details.trim(),
      fee_note: feeNote.trim() || null,
    });

    setLoading(false);
    if (insertError) {
      setError("تعذّر نشر الطلب: " + insertError.message);
      return;
    }

    router.push("/board");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-4">
      <select
        className={inputClass}
        value={governorateId}
        onChange={(e) => {
          setGovernorateId(e.target.value ? Number(e.target.value) : "");
          setCourtId("");
        }}
        required
      >
        <option value="">المحافظة</option>
        {governorates.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name_ar}
          </option>
        ))}
      </select>

      <select
        className={inputClass}
        value={courtId}
        onChange={(e) => setCourtId(e.target.value ? Number(e.target.value) : "")}
        disabled={!governorateId}
        required
      >
        <option value="">{governorateId ? "المحكمة" : "اختر المحافظة أولًا"}</option>
        {availableCourts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name_ar}
          </option>
        ))}
      </select>

      <select
        className={inputClass}
        value={delegationType}
        onChange={(e) => setDelegationType(e.target.value as DelegationType)}
        required
      >
        <option value="">نوع الإنابة</option>
        {DELEGATION_TYPE_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="date"
        className={inputClass}
        value={sessionDate}
        onChange={(e) => setSessionDate(e.target.value)}
        min={new Date().toISOString().slice(0, 10)}
        required
      />

      <textarea
        placeholder="تفاصيل الطلب (رقم القضية، ما هو المطلوب بالتحديد...)"
        className={inputClass}
        rows={4}
        maxLength={1000}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="ملاحظة الأتعاب (اختياري) — مثال: الأتعاب بالاتفاق"
        className={inputClass}
        value={feeNote}
        onChange={(e) => setFeeNote(e.target.value)}
      />

      {error && <p className="text-sm text-urgent">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        نشر الطلب
      </button>
    </form>
  );
}
