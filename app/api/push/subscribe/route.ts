import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** يحفظ اشتراك Web Push للمستخدم الحالي، ويضمن اشتراكه في إشعارات محافظته
 * الافتراضية إن لم يكن مشتركًا بعد (SPEC.md §9). */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مصرَّح" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const endpoint = body?.endpoint;
  const p256dh = body?.keys?.p256dh;
  const auth = body?.keys?.auth;

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "بيانات الاشتراك ناقصة" }, { status: 400 });
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ lawyer_id: user.id, endpoint, p256dh, auth }, { onConflict: "endpoint" });

  if (error) return NextResponse.json({ error: "تعذّر حفظ الاشتراك" }, { status: 500 });

  const { data: profile } = await supabase
    .from("lawyer_profiles")
    .select("governorate_id")
    .eq("id", user.id)
    .single();

  if (profile) {
    const { data: existingSub } = await supabase
      .from("notification_subscriptions")
      .select("id")
      .eq("lawyer_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!existingSub) {
      await supabase.from("notification_subscriptions").insert({
        lawyer_id: user.id,
        governorate_id: profile.governorate_id,
        channel: "push",
      });
    }
  }

  return NextResponse.json({ success: true });
}
