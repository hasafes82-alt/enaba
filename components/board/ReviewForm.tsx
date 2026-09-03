"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";

interface ReviewFormProps {
  requestId: string;
  revieweeId: string;
  revieweeLabel: string;
}

export function ReviewForm({ requestId, revieweeId, revieweeLabel }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit() {
    if (rating === 0) {
      setError("اختر تقييمًا من 1 إلى 5 نجوم");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, revieweeId, rating, comment }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "تعذّر إرسال التقييم");
      return;
    }
    setDone(true);
    router.refresh();
  }

  if (done) {
    return <p className="text-sm font-medium text-verified">شكرًا لتقييمك {revieweeLabel} 🙏</p>;
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gold-600/30 bg-gold-100 p-3">
      <p className="text-sm font-medium text-navy-900">قيِّم {revieweeLabel}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} نجوم`}
            onClick={() => setRating(n)}
            className="p-1"
          >
            <Star
              className={`h-6 w-6 ${n <= rating ? "fill-gold-600 text-gold-600" : "text-navy-700/30"}`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      <textarea
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        placeholder="تعليق (اختياري)"
        rows={2}
        maxLength={300}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <p className="text-xs text-urgent">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="flex items-center justify-center gap-2 self-start rounded-lg bg-gold-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        إرسال التقييم
      </button>
    </div>
  );
}
