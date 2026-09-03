import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getClientIp, hashViewer, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * كشف رقم هاتف محامٍ — SPEC.md §6/ADR-05 وCLAUDE.md → قواعد أمنية حرجة.
 * لا يُرسَل أي رقم هاتف ضمن HTML الصفحة؛ يُجلب فرديًا هنا مع تحديد معدل
 * وتسجيل في contact_reveals (بلا تخزين IP خام — بصمة مجزّأة فقط).
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const lawyerId = body?.lawyerId;

  if (typeof lawyerId !== "string" || lawyerId.length === 0) {
    return NextResponse.json({ error: "lawyerId مطلوب" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();

  let viewerIsVerified = false;
  if (user) {
    const { data: viewerProfile } = await admin
      .from("lawyer_profiles")
      .select("verification_status")
      .eq("id", user.id)
      .single();
    viewerIsVerified = viewerProfile?.verification_status === "verified";
  }

  const limit = viewerIsVerified
    ? RATE_LIMITS.contactRevealVerified
    : RATE_LIMITS.contactRevealAnonymous;

  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const viewerHash = hashViewer(ip, userAgent);

  const windowStart = new Date(Date.now() - limit.windowHours * 60 * 60 * 1000).toISOString();

  const countQuery = admin
    .from("contact_reveals")
    .select("id", { count: "exact", head: true })
    .gte("created_at", windowStart);

  const { count } = user
    ? await countQuery.eq("viewer_id", user.id)
    : await countQuery.eq("viewer_hash", viewerHash);

  if ((count ?? 0) >= limit.max) {
    return NextResponse.json(
      { error: "تجاوزت الحد المسموح لكشف الأرقام. حاول لاحقًا." },
      { status: 429 },
    );
  }

  const { data: lawyer, error } = await admin
    .from("lawyer_profiles")
    .select("full_name, phone, whatsapp, verification_status")
    .eq("id", lawyerId)
    .single();

  if (error || !lawyer || lawyer.verification_status !== "verified") {
    return NextResponse.json({ error: "المحامي غير موجود" }, { status: 404 });
  }

  await admin.from("contact_reveals").insert({
    viewer_id: user?.id ?? null,
    viewer_hash: viewerHash,
    target_lawyer_id: lawyerId,
  });

  return NextResponse.json({
    fullName: lawyer.full_name,
    phone: lawyer.phone,
    whatsapp: lawyer.whatsapp ?? lawyer.phone,
  });
}
