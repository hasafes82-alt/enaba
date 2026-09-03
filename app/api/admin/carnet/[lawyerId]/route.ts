import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/**
 * رابط موقّع مؤقت لصورة كارنيه النقابة — صالح 5 دقائق فقط (SPEC.md §6/§7).
 * لا يُعرض carnets/* لأي أحد غير المشرف، ولا حتى عبر رابط مباشر (bucket خاص).
 */
export async function GET(request: NextRequest, context: { params: Promise<{ lawyerId: string }> }) {
  const { lawyerId } = await context.params;

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
    .select("carnet_path")
    .eq("id", lawyerId)
    .single();

  if (!target?.carnet_path) {
    return NextResponse.json({ error: "لا توجد صورة كارنيه مرفوعة" }, { status: 404 });
  }

  const { data, error } = await admin.storage.from("carnets").createSignedUrl(target.carnet_path, 300);

  if (error || !data) {
    return NextResponse.json({ error: "تعذّر توليد رابط الصورة" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
