import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/**
 * رابط موقّع مؤقت لملف النموذج — صالح 5 دقائق فقط، للمشرف حصريًا (نفس نمط
 * الكارنيه في app/api/admin/carnet/[lawyerId]/route.ts). المشرف يحمّل الملف
 * ويرسله يدويًا عبر واتساب بعد تأكيد الدفع (SPEC.md §8/F7).
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

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

  const { data: form } = await admin.from("legal_forms").select("file_path").eq("id", id).single();
  if (!form?.file_path) {
    return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
  }

  const { data, error } = await admin.storage.from("legal-forms").createSignedUrl(form.file_path, 300);
  if (error || !data) {
    return NextResponse.json({ error: "تعذّر توليد رابط الملف" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
