"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, Loader2 } from "lucide-react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

type Status = "unsupported" | "checking" | "off" | "on" | "denied" | "loading" | "error";

export function NotificationOptIn({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    if (!isAuthenticated) return;
    // كل الفروع (بما فيها الفحوص المتزامنة ظاهريًا) داخل .then() عمدًا —
    // استدعاء setState مباشرة داخل جسم الـ effect بلا callback يخالف
    // react-hooks/set-state-in-effect.
    Promise.resolve().then(() => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => setStatus(sub ? "on" : "off"))
        .catch(() => setStatus("error"));
    });
  }, [isAuthenticated]);

  async function enable() {
    setStatus("loading");
    try {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("no-vapid-key");

      const registration = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      setStatus(res.ok ? "on" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (!isAuthenticated || status === "checking" || status === "unsupported" || status === "on") {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gold-600/30 bg-gold-100 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-navy-900">
        <BellRing className="h-4 w-4 text-gold-700" aria-hidden="true" />
        {status === "denied"
          ? "الإشعارات موقوفة من إعدادات المتصفح — فعّلها من هناك لتصلك الطلبات الجديدة فورًا."
          : "فعّل التنبيهات عشان توصلك طلبات الإنابة الجديدة في محافظتك فورًا."}
      </div>
      {status !== "denied" && (
        <button
          type="button"
          onClick={enable}
          disabled={status === "loading"}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-gold-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Bell className="h-4 w-4" aria-hidden="true" />
          )}
          تفعيل
        </button>
      )}
    </div>
  );
}
