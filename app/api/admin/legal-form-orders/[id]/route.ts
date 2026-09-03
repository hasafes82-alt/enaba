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

const VALID_STATUSES = ["pending", "paid", "delivered", "cancelled"];

/** تحديث حالة طلب شراء نموذج — SPEC.md §8/F7 (التسليم يدوي). */
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const body = await request.json().catch(() => null);
  if (typeof body?.status !== "string" || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "status غير صحيح" }, { status: 400 });
  }

  const { error } = await guard.admin
    .from("legal_form_orders")
    .update({ status: body.status })
    .eq("id", Number(id));
  if (error) return NextResponse.json({ error: "تعذّر التحديث" }, { status: 500 });

  return NextResponse.json({ success: true });
}
