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

/** نشر/إخفاء النموذج. */
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const body = await request.json().catch(() => null);
  if (typeof body?.isPublished !== "boolean") {
    return NextResponse.json({ error: "isPublished مطلوب" }, { status: 400 });
  }

  const { error } = await guard.admin.from("legal_forms").update({ is_published: body.isPublished }).eq("id", id);
  if (error) return NextResponse.json({ error: "تعذّر التحديث" }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { data: form } = await guard.admin.from("legal_forms").select("file_path").eq("id", id).single();

  const { error } = await guard.admin.from("legal_forms").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "تعذّر الحذف" }, { status: 500 });

  if (form?.file_path) {
    await guard.admin.storage.from("legal-forms").remove([form.file_path]);
  }

  await guard.admin.from("admin_actions").insert({
    admin_id: guard.user.id,
    action: "delete_legal_form",
    entity_type: "legal_forms",
    entity_id: id,
  });

  return NextResponse.json({ success: true });
}
