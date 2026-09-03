"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toE164 } from "@/lib/phone";
import { REGISTRATION_DEGREE_OPTIONS } from "@/lib/constants";
import type { Court, Governorate } from "@/lib/data/reference";
import type { RegistrationDegree } from "@/types/database";

interface JoinFlowProps {
  governorates: Governorate[];
  courts: Court[];
}

type Step = "phone" | "otp" | "profile" | "done";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-navy-900 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600";

export function JoinFlow({ governorates, courts }: JoinFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") ?? "/";

  const [step, setStep] = useState<Step>("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [e164Phone, setE164Phone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [governorateId, setGovernorateId] = useState<number | "">("");
  const [degree, setDegree] = useState<RegistrationDegree | "">("");
  const [barNumber, setBarNumber] = useState("");
  const [bio, setBio] = useState("");
  const [selectedCourtIds, setSelectedCourtIds] = useState<number[]>([]);
  const [carnetFile, setCarnetFile] = useState<File | null>(null);

  const availableCourts = useMemo(
    () => courts.filter((c) => c.governorate_id === governorateId),
    [courts, governorateId],
  );

  async function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = toE164(phoneInput);
    if (!normalized) {
      setError("رقم الهاتف غير صحيح. أدخل رقمًا مصريًا مثل 01012345678");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone: normalized });
    setLoading(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    setE164Phone(normalized);
    setStep("otp");
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: e164Phone,
      token: otp,
      type: "sms",
    });

    if (verifyError || !data.user) {
      setLoading(false);
      setError(verifyError?.message ?? "رمز التحقق غير صحيح");
      return;
    }

    const { data: existingProfile } = await supabase
      .from("lawyer_profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    setLoading(false);
    if (existingProfile) {
      router.replace(redirectedFrom);
      return;
    }
    setStep("profile");
  }

  async function submitProfile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!governorateId || !degree || fullName.trim().length < 5) {
      setError("من فضلك أكمل كل الحقول المطلوبة (الاسم 5 أحرف على الأقل)");
      return;
    }
    if (!carnetFile) {
      setError("لازم ترفع صورة كارنيه النقابة — التوثيق إجباري قبل الظهور في الدليل");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setError("انتهت الجلسة، من فضلك أعد المحاولة من البداية");
      setStep("phone");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        barNumber: barNumber.trim() || null,
        degree,
        governorateId,
        bio: bio.trim() || null,
        courtIds: selectedCourtIds,
      }),
    });
    const registerData = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(registerData.error ?? "تعذّر إنشاء الملف الشخصي");
      return;
    }

    const ext = carnetFile.name.split(".").pop() ?? "jpg";
    const carnetPath = `${user.id}/carnet.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("carnets")
      .upload(carnetPath, carnetFile, { upsert: true });

    if (uploadError) {
      setLoading(false);
      setError("تم إنشاء الحساب لكن تعذّر رفع الكارنيه: " + uploadError.message);
      return;
    }

    await supabase.from("lawyer_profiles").update({ carnet_path: carnetPath }).eq("id", user.id);

    setLoading(false);
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-verified/30 bg-verified/5 p-6 text-center">
        <p className="text-lg font-semibold text-navy-900">تم إنشاء حسابك بنجاح 🎉</p>
        <p className="text-navy-700">
          حسابك الآن <span className="font-medium">قيد المراجعة</span> (عادةً خلال 24 ساعة) — ستظهر
          في الدليل وتقدر تنشر وتستجيب لطلبات الإنابة فور التوثيق.
        </p>
        <Link href="/" className="mt-2 rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
      {step === "phone" && (
        <form onSubmit={submitPhone} className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-navy-900">انضم إلى دليل إنابة</h2>
            <p className="mt-1 text-sm text-navy-700">أدخل رقم هاتفك المصري لإرسال رمز تحقق عبر رسالة نصية.</p>
          </div>
          <input
            type="tel"
            inputMode="tel"
            placeholder="01012345678"
            className={inputClass}
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            required
          />
          {error && <p className="text-sm text-urgent">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            إرسال رمز التحقق
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={submitOtp} className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-navy-900">أدخل رمز التحقق</h2>
            <p className="mt-1 text-sm text-navy-700">أُرسل رمز مكوَّن من 6 أرقام إلى {e164Phone}</p>
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="123456"
            className={inputClass}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {error && <p className="text-sm text-urgent">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            تأكيد
          </button>
        </form>
      )}

      {step === "profile" && (
        <form onSubmit={submitProfile} className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-navy-900">أكمل ملفك الشخصي</h2>
            <p className="mt-1 text-sm text-navy-700">أقل من دقيقة — ثم يراجعه فريقنا خلال 24 ساعة.</p>
          </div>

          <input
            type="text"
            placeholder="الاسم الكامل"
            className={inputClass}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <select
            className={inputClass}
            value={governorateId}
            onChange={(e) => {
              setGovernorateId(e.target.value ? Number(e.target.value) : "");
              setSelectedCourtIds([]);
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
            value={degree}
            onChange={(e) => setDegree(e.target.value as RegistrationDegree)}
            required
          >
            <option value="">درجة القيد</option>
            {REGISTRATION_DEGREE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {availableCourts.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-navy-900">المحاكم التي تتواجد بها يوميًا</p>
              <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-lg border border-border p-2">
                {availableCourts.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm text-navy-700">
                    <input
                      type="checkbox"
                      checked={selectedCourtIds.includes(c.id)}
                      onChange={(e) =>
                        setSelectedCourtIds((prev) =>
                          e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id),
                        )
                      }
                    />
                    {c.name_ar}
                  </label>
                ))}
              </div>
            </div>
          )}

          <input
            type="text"
            placeholder="رقم القيد بالنقابة (اختياري)"
            className={inputClass}
            value={barNumber}
            onChange={(e) => setBarNumber(e.target.value)}
          />

          <textarea
            placeholder="نبذة مختصرة (اختياري)"
            className={inputClass}
            rows={3}
            maxLength={400}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div>
            <label htmlFor="carnet" className="mb-2 block text-sm font-medium text-navy-900">
              صورة كارنيه النقابة <span className="text-urgent">*</span>
            </label>
            <input
              id="carnet"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={inputClass}
              onChange={(e) => setCarnetFile(e.target.files?.[0] ?? null)}
              required
            />
            <p className="mt-1 text-xs text-navy-700">
              إجباري قبل الظهور في الدليل — يراجعه فريقنا يدويًا (JPG/PNG/WebP، حتى 5MB).
            </p>
          </div>

          {error && <p className="text-sm text-urgent">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            إنشاء الحساب
          </button>
        </form>
      )}
    </div>
  );
}
