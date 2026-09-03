import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/**
 * قرار توثيق (قبول/رفض) — SPEC.md §8/F5 وF6. كل قرار يُسجَّل في admin_actions
 * (§13.4: "سجل كامل لكل عملية توثيق — من وثّق، متى، بناءً على أي مستند").
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: targetId } = await context.params;
  const body = await request.json().catch(() => null);
  const action = body?.action as "approve" | "reject" | undefined;
  const reason = typeof body?.reason === "string" ? body.reason : null;

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action غير صالح" }, { status: 400 });
  }
  if (action === "reject" && !reason) {
    return NextResponse.json({ error: "سبب الرفض مطلوب" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مصرَّح" }, { status: 401 });

  const admin = createAdminClient();
  const { data: viewerProfile } = await admin
    .from("lawyer_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (viewerProfile?.role !== "admin" && viewerProfile?.role !== "moderator") {
    return NextResponse.json({ error: "غير مصرَّح" }, { status: 403 });
  }

  const { data: target } = await admin
    .from("lawyer_profiles")
    .select("id, carnet_path, verification_status, governorate_id")
    .eq("id", targetId)
    .single();

  if (!target) return NextResponse.json({ error: "المحامي غير موجود" }, { status: 404 });

  if (action === "approve" && !target.carnet_path) {
    return NextResponse.json(
      { error: "لا يمكن التوثيق بدون صورة كارنيه مرفوعة" },
      { status: 409 },
    );
  }

  const { error: updateError } = await admin
    .from("lawyer_profiles")
    .update(
      action === "approve"
        ? {
            verification_status: "verified",
            verified_at: new Date().toISOString(),
            verified_by: user.id,
            rejection_reason: null,
          }
        : {
            verification_status: "rejected",
            rejection_reason: reason,
          },
    )
    .eq("id", targetId);

  if (updateError) {
    return NextResponse.json({ error: "تعذّر تحديث حالة التوثيق" }, { status: 500 });
  }

  await admin.from("admin_actions").insert({
    admin_id: user.id,
    action: action === "approve" ? "verify_lawyer" : "reject_lawyer",
    entity_type: "lawyer_profiles",
    entity_id: targetId,
    meta: reason ? { reason } : null,
  });

  // اشتراك تلقائي في إشعارات محافظته عند التوثيق — SPEC.md §9
  if (action === "approve") {
    const { data: existingSub } = await admin
      .from("notification_subscriptions")
      .select("id")
      .eq("lawyer_id", targetId)
      .limit(1)
      .maybeSingle();

    if (!existingSub) {
      await admin.from("notification_subscriptions").insert({
        lawyer_id: targetId,
        governorate_id: target.governorate_id,
        channel: "push",
      });
    }
  }

  return NextResponse.json({ success: true });
}
