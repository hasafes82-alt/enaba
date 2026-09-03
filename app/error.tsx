"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-urgent" aria-hidden="true" />
      <p className="font-medium text-navy-900">حدث خطأ غير متوقع أثناء تحميل الصفحة</p>
      <p className="text-sm text-navy-700">تحقّق من اتصالك بالإنترنت وحاول مرة أخرى.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 flex items-center gap-2 rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-700"
      >
        <RotateCw className="h-4 w-4" aria-hidden="true" />
        إعادة المحاولة
      </button>
    </main>
  );
}
