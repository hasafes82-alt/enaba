import { createAdminClient } from "@/lib/supabase/server";
import { isWithinSilenceHours, sendPushNotification } from "@/lib/push";
import { DELEGATION_TYPE_LABELS } from "@/lib/constants";
import type { DelegationType } from "@/types/database";

const MAX_PUSH_PER_DAY = 5;

interface NewRequestNotificationInput {
  requestId: string;
  requesterId: string;
  governorateId: number;
  courtId: number;
  delegationType: DelegationType;
  courtName: string;
}

/**
 * يطابق طلب إنابة جديد مع اشتراكات الإشعارات، ويرسل Web Push فورًا لمن لم
 * يتجاوز حصته اليومية ولا يقع في ساعات الصمت، ويؤجّل الباقي في
 * notifications_outbox (status='queued') ليُعالَجه dispatch-notifications
 * لاحقًا — لا يُلغى أي إشعار، فقط يُؤجَّل. SPEC.md §9.
 */
export async function notifyMatchingLawyers(input: NewRequestNotificationInput): Promise<void> {
  const admin = createAdminClient();

  const { data: subs } = await admin
    .from("notification_subscriptions")
    .select("lawyer_id, governorate_id, court_id, delegation_types")
    .eq("is_active", true);

  if (!subs || subs.length === 0) return;

  const matching = subs.filter(
    (s) =>
      s.lawyer_id !== input.requesterId &&
      (s.governorate_id === null || s.governorate_id === input.governorateId) &&
      (s.court_id === null || s.court_id === input.courtId) &&
      (s.delegation_types === null ||
        s.delegation_types.length === 0 ||
        s.delegation_types.includes(input.delegationType)),
  );
  if (matching.length === 0) return;

  const lawyerIds = [...new Set(matching.map((m) => m.lawyer_id))];

  const { data: verifiedLawyers } = await admin
    .from("lawyer_profiles")
    .select("id")
    .eq("verification_status", "verified")
    .in("id", lawyerIds);
  const verifiedIds = new Set((verifiedLawyers ?? []).map((l) => l.id));
  const targetIds = lawyerIds.filter((id) => verifiedIds.has(id));
  if (targetIds.length === 0) return;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const payload = {
    title: "طلب إنابة جديد",
    body: `${DELEGATION_TYPE_LABELS[input.delegationType]} — ${input.courtName}`,
    url: "/board",
  };

  const silenced = isWithinSilenceHours();

  for (const lawyerId of targetIds) {
    const { count } = await admin
      .from("notifications_outbox")
      .select("id", { count: "exact", head: true })
      .eq("lawyer_id", lawyerId)
      .eq("status", "sent")
      .gte("created_at", todayStart.toISOString());

    const overQuota = (count ?? 0) >= MAX_PUSH_PER_DAY;

    if (silenced || overQuota) {
      await admin.from("notifications_outbox").insert({
        lawyer_id: lawyerId,
        request_id: input.requestId,
        channel: "push",
        payload,
        status: "queued",
      });
      continue;
    }

    const { data: devices } = await admin
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("lawyer_id", lawyerId);

    if (!devices || devices.length === 0) {
      // لا يوجد اشتراك متصفح فعلي بعد — يُسجَّل queued حتى لو اشترك لاحقًا
      // dispatch-notifications لن يجد جهازًا فيتجاهله بأمان (انظر ملاحظة هناك).
      await admin.from("notifications_outbox").insert({
        lawyer_id: lawyerId,
        request_id: input.requestId,
        channel: "push",
        payload,
        status: "queued",
      });
      continue;
    }

    let anySent = false;
    for (const device of devices) {
      const result = await sendPushNotification(device, payload);
      if (result.ok) anySent = true;
      if (result.expired) {
        await admin.from("push_subscriptions").delete().eq("id", device.id);
      }
    }

    await admin.from("notifications_outbox").insert({
      lawyer_id: lawyerId,
      request_id: input.requestId,
      channel: "push",
      payload,
      status: anySent ? "sent" : "failed",
      sent_at: anySent ? new Date().toISOString() : null,
    });
  }
}
