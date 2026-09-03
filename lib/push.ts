import webpush from "web-push";

/** ساعات الصمت — لا تُرسَل إشعارات فوريًا بينها، تُؤجَّل بدل أن تُلغى — SPEC.md §9. */
export function isWithinSilenceHours(date: Date = new Date()): boolean {
  // بتوقيت القاهرة (UTC+2 شتاءً / +3 صيفًا) — تقريب ثابت +2 يكفي لغرض "ساعات صمت" تقريبية
  const cairoHour = (date.getUTCHours() + 2) % 24;
  return cairoHour >= 23 || cairoHour < 7;
}

let configured = false;
function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@example.com";
  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys غير مضبوطة — راجع .env.example");
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export interface PushSubscriptionRow {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushPayload {
  title: string;
  body: string;
  url: string;
}

/** يرسل إشعار Web Push واحدًا. يُرجع false بدل رمي الخطأ لو الاشتراك منتهي
 * (410/404) حتى يقدر المستدعي يحذفه، بدل ما يفشل العملية كلها. */
export async function sendPushNotification(
  subscription: PushSubscriptionRow,
  payload: PushPayload,
): Promise<{ ok: boolean; expired: boolean }> {
  ensureConfigured();
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      },
      JSON.stringify(payload),
    );
    return { ok: true, expired: false };
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    const expired = statusCode === 404 || statusCode === 410;
    if (!expired) {
      console.error("فشل إرسال إشعار Web Push:", error);
    }
    return { ok: false, expired };
  }
}
