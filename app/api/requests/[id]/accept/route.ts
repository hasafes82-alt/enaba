import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { RATE_LIMITS } from "@/lib/rate-limit";

/**
 * قبول طلب إنابة من لوحة الطلبات — SPEC.md §8/F3:
 * 1) يُنشئ سجلًا في request_responses
 * 2) يُرجع بيانات تواصل الطالب لفتح واتساب من العميل
 * 3) يُخطر الطالب (يُكتَب في notifications_outbox لمعالجته لاحقًا)
 * لا يُغيّر حالة الطلب تلقائيًا — الطالب وحده من يضغط "تم الإسناد".
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: requestId } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول أولًا" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: responderProfile } = await admin
    .from("lawyer_profiles")
    .select("verification_status, full_name")
    .eq("id", user.id)
    .single();

  if (responderProfile?.verification_status !== "verified") {
    return NextResponse.json(
      { error: "لازم يكون حسابك موثَّقًا أولًا للاستجابة للطلبات" },
      { status: 403 },
    );
  }

  const { data: delegationRequest } = await admin
    .from("delegation_requests")
    .select("id, requester_id, status, court_id, delegation_type")
    .eq("id", requestId)
    .single();

  if (!delegationRequest || delegationRequest.status !== "open") {
    return NextResponse.json({ error: "الطلب لم يعد متاحًا" }, { status: 409 });
  }

  const windowStart = new Date(
    Date.now() - RATE_LIMITS.respondToRequest.windowHours * 60 * 60 * 1000,
  ).toISOString();
  const { count } = await admin
    .from("request_responses")
    .select("id", { count: "exact", head: true })
    .eq("lawyer_id", user.id)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= RATE_LIMITS.respondToRequest.max) {
    return NextResponse.json(
      { error: "تجاوزت الحد المسموح للاستجابة للطلبات اليوم (30 استجابة). حاول غدًا." },
      { status: 429 },
    );
  }

  const { error: insertError } = await supabase.from("request_responses").insert({
    request_id: requestId,
    lawyer_id: user.id,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ error: "لقد استجبت لهذا الطلب من قبل" }, { status: 409 });
    }
    return NextResponse.json({ error: "تعذّر تسجيل الاستجابة" }, { status: 500 });
  }

  const { data: requester } = await admin
    .from("lawyer_profiles")
    .select("full_name, phone, whatsapp")
    .eq("id", delegationRequest.requester_id)
    .single();

  const { data: court } = await admin
    .from("courts")
    .select("name_ar")
    .eq("id", delegationRequest.court_id)
    .single();

  await admin.from("notifications_outbox").insert({
    lawyer_id: delegationRequest.requester_id,
    request_id: requestId,
    channel: "push",
    payload: {
      type: "request_accepted",
      responderName: responderProfile.full_name,
      requestId,
    },
  });

  if (!requester) {
    return NextResponse.json({ error: "تعذّر جلب بيانات الطالب" }, { status: 500 });
  }

  return NextResponse.json({
    fullName: requester.full_name,
    phone: requester.phone,
    whatsapp: requester.whatsapp ?? requester.phone,
    courtName: court?.name_ar ?? "",
  });
}
