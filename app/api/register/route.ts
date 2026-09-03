import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getClientIp, hashViewer, RATE_LIMITS } from "@/lib/rate-limit";
import type { RegistrationDegree } from "@/types/database";

/**
 * إنشاء الملف الشخصي بعد التحقق من OTP — يمر عبر مسار خادم خصيصًا لتحديد
 * معدل التسجيل من نفس البصمة (3/يوم — SPEC.md §6)، وهو ما يستحيل تطبيقه
 * على إدخال مباشر من العميل عبر supabase-js.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مصرَّح" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { fullName, barNumber, degree, governorateId, bio, courtIds } = body ?? {};

  if (!fullName || fullName.trim().length < 5 || !degree || !governorateId) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const admin = createAdminClient();

  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const viewerHash = hashViewer(ip, userAgent);
  const windowStart = new Date(
    Date.now() - RATE_LIMITS.registerFromSameFingerprint.windowHours * 60 * 60 * 1000,
  ).toISOString();

  const { count } = await admin
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("action", "register")
    .eq("viewer_hash", viewerHash)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= RATE_LIMITS.registerFromSameFingerprint.max) {
    return NextResponse.json(
      { error: "تجاوزت الحد المسموح لمحاولات التسجيل اليوم. حاول غدًا." },
      { status: 429 },
    );
  }

  const { data: authUser } = await supabase.auth.getUser();
  const phone = authUser.user?.phone;
  if (!phone) return NextResponse.json({ error: "تعذّر تأكيد رقم الهاتف" }, { status: 400 });

  const { error: insertError } = await supabase.from("lawyer_profiles").insert({
    id: user.id,
    full_name: fullName.trim(),
    phone: phone.startsWith("+") ? phone : `+${phone}`,
    bar_number: barNumber?.trim() || null,
    registration_degree: degree as RegistrationDegree,
    governorate_id: governorateId,
    bio: bio?.trim() || null,
  });

  if (insertError) {
    return NextResponse.json({ error: "تعذّر إنشاء الملف الشخصي: " + insertError.message }, { status: 400 });
  }

  if (Array.isArray(courtIds) && courtIds.length > 0) {
    await supabase
      .from("lawyer_courts")
      .insert(courtIds.map((court_id: number) => ({ lawyer_id: user.id, court_id })));
  }

  await admin.from("rate_limit_events").insert({ action: "register", viewer_hash: viewerHash });

  return NextResponse.json({ success: true });
}
