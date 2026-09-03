import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isWithinSilenceHours, sendPushNotification, type PushPayload } from "@/lib/push";

/**
 * يعالج notifications_outbox المؤجَّلة (status='queued') — SPEC.md §9:
 * "تُؤجَّل الرسائل، ولا تُلغى". يُستدعى دوريًا من Vercel Cron (vercel.json) —
 * الحد الأقصى على خطة Hobby مرة واحدة يوميًا لكل cron، لذا الجدولة مضبوطة
 * فور انتهاء ساعات الصمت (راجع vercel.json وSPEC.md §9/الملحق).
 *
 * محمي بـ CRON_SECRET — نفس اسم متغيّر البيئة الذي يتعرَّف عليه Vercel تلقائيًا
 * ويُرسله كـ "Authorization: Bearer <CRON_SECRET>" مع كل استدعاء Cron، فلا
 * حاجة لأي إعداد إضافي غير ضبط قيمته في متغيرات بيئة المشروع.
 */
async function handleDispatch(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "غير مصرَّح" }, { status: 401 });
  }

  if (isWithinSilenceHours()) {
    return NextResponse.json({ processed: 0, reason: "silence-hours" });
  }

  const admin = createAdminClient();
  const { data: queued } = await admin
    .from("notifications_outbox")
    .select("id, lawyer_id, payload, attempts")
    .eq("status", "queued")
    .lt("attempts", 3)
    .order("created_at", { ascending: true })
    .limit(100);

  if (!queued || queued.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let sent = 0;
  let stillQueued = 0;
  let failed = 0;

  for (const item of queued) {
    const { data: devices } = await admin
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("lawyer_id", item.lawyer_id);

    if (!devices || devices.length === 0) {
      // لسه ما فيش جهاز مشترك — يبقى queued لمحاولة لاحقة، حتى الحد الأقصى للمحاولات
      await admin
        .from("notifications_outbox")
        .update({ attempts: item.attempts + 1 })
        .eq("id", item.id);
      stillQueued++;
      continue;
    }

    let anySent = false;
    for (const device of devices) {
      const result = await sendPushNotification(device, item.payload as unknown as PushPayload);
      if (result.ok) anySent = true;
      if (result.expired) {
        await admin.from("push_subscriptions").delete().eq("id", device.id);
      }
    }

    await admin
      .from("notifications_outbox")
      .update({
        status: anySent ? "sent" : "failed",
        sent_at: anySent ? new Date().toISOString() : null,
        attempts: item.attempts + 1,
      })
      .eq("id", item.id);

    if (anySent) sent++;
    else failed++;
  }

  return NextResponse.json({ processed: queued.length, sent, failed, stillQueued });
}

// Vercel Cron يستدعي بـ GET افتراضيًا. POST مُبقًى لتشغيل يدوي/مُجدوِل بديل.
export async function GET(request: NextRequest) {
  return handleDispatch(request);
}

export async function POST(request: NextRequest) {
  return handleDispatch(request);
}
