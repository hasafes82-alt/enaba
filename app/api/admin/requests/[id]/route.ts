import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "غير مصرَّح" }, { status: 401 }) };

  const admin = createAdminClient();
  const { data: profile } = await admin.from("lawyer_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    return { error: NextResponse.json({ error: "غير مصرَّح" }, { status: 403 }) };
  }
  return { user, admin };
}

/** إغلاق طلب (تحويله لـ cancelled) — لسبب مثل التكرار أو انتفاء الحاجة. */
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { error } = await guard.admin
    .from("delegation_requests")
    .update({ status: "cancelled" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "تعذّر إغلاق الطلب" }, { status: 500 });

  await guard.admin.from("admin_actions").insert({
    admin_id: guard.user.id,
    action: "cancel_request",
    entity_type: "delegation_requests",
    entity_id: id,
  });

  return NextResponse.json({ success: true });
}

/** حذف طلب سبام نهائيًا. */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { error } = await guard.admin.from("delegation_requests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "تعذّر حذف الطلب" }, { status: 500 });

  await guard.admin.from("admin_actions").insert({
    admin_id: guard.user.id,
    action: "delete_request",
    entity_type: "delegation_requests",
    entity_id: id,
  });

  return NextResponse.json({ success: true });
}
