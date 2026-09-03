import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { notifyMatchingLawyers } from "@/lib/notify";
import { RATE_LIMITS } from "@/lib/rate-limit";
import type { DelegationType } from "@/types/database";

/**
 * إنشاء طلب إنابة — يمر عبر مسار خادم (بدل إدخال مباشر من العميل) خصيصًا
 * حتى يتسنى إرسال إشعارات Web Push فور الإنشاء (SPEC.md §9). الإدخال نفسه
 * يمر عبر عميل الجلسة العادي فتُطبَّق RLS كاملة، لا service_role.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { courtId, governorateId, delegationType, sessionDate, details, feeNote } = body ?? {};

  if (!courtId || !governorateId || !delegationType || !sessionDate || !details) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const admin = createAdminClient();
  const windowStart = new Date(
    Date.now() - RATE_LIMITS.postDelegationRequest.windowHours * 60 * 60 * 1000,
  ).toISOString();
  const { count } = await admin
    .from("delegation_requests")
    .select("id", { count: "exact", head: true })
    .eq("requester_id", user.id)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= RATE_LIMITS.postDelegationRequest.max) {
    return NextResponse.json(
      { error: "تجاوزت الحد المسموح لنشر طلبات الإنابة اليوم (5 طلبات). حاول غدًا." },
      { status: 429 },
    );
  }

  const { data: inserted, error } = await supabase
    .from("delegation_requests")
    .insert({
      requester_id: user.id,
      court_id: courtId,
      governorate_id: governorateId,
      delegation_type: delegationType as DelegationType,
      session_date: sessionDate,
      details,
      fee_note: feeNote || null,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return NextResponse.json({ error: "تعذّر نشر الطلب: " + (error?.message ?? "") }, { status: 400 });
  }

  const { data: court } = await admin.from("courts").select("name_ar").eq("id", courtId).single();

  await notifyMatchingLawyers({
    requestId: inserted.id,
    requesterId: user.id,
    governorateId,
    courtId,
    delegationType: delegationType as DelegationType,
    courtName: court?.name_ar ?? "",
  });

  return NextResponse.json({ id: inserted.id });
}
