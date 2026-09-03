import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/** تحديد بلاغ كمُعالَج. */
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مصرَّح" }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin.from("lawyer_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    return NextResponse.json({ error: "غير مصرَّح" }, { status: 403 });
  }

  const { error } = await admin.from("reports").update({ status: "resolved" }).eq("id", id);
  if (error) return NextResponse.json({ error: "تعذّر تحديث البلاغ" }, { status: 500 });

  await admin.from("admin_actions").insert({
    admin_id: user.id,
    action: "resolve_report",
    entity_type: "reports",
    entity_id: id,
  });

  return NextResponse.json({ success: true });
}
