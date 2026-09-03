import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getClientIp, hashViewer, RATE_LIMITS } from "@/lib/rate-limit";
import { toE164 } from "@/lib/phone";

/**
 * طلب شراء نموذج قانوني — بلا تسجيل دخول، بلا بوابة دفع (SPEC.md §8/F7).
 * يسجّل الطلب بحالة "pending"، والمشرف يتابع التسليم يدويًا من /admin/forms.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: formId } = await context.params;

  const body = await request.json().catch(() => null);
  const rawPhone = body?.whatsapp;
  const buyerName = typeof body?.buyerName === "string" ? body.buyerName.trim().slice(0, 100) : null;

  if (typeof rawPhone !== "string") {
    return NextResponse.json({ error: "رقم واتساب مطلوب" }, { status: 400 });
  }

  const whatsapp = toE164(rawPhone);
  if (!whatsapp) {
    return NextResponse.json({ error: "رقم واتساب غير صحيح" }, { status: 400 });
  }

  const admin = createAdminClient();

  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const viewerHash = hashViewer(ip, userAgent);
  const windowStart = new Date(
    Date.now() - RATE_LIMITS.orderLegalForm.windowHours * 60 * 60 * 1000,
  ).toISOString();

  const { count } = await admin
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("action", "order_legal_form")
    .eq("viewer_hash", viewerHash)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= RATE_LIMITS.orderLegalForm.max) {
    return NextResponse.json(
      { error: "تجاوزت الحد المسموح لطلبات النماذج اليوم. حاول غدًا." },
      { status: 429 },
    );
  }

  const { data: form } = await admin
    .from("legal_forms")
    .select("id, is_published")
    .eq("id", formId)
    .single();

  if (!form || !form.is_published) {
    return NextResponse.json({ error: "النموذج غير متاح" }, { status: 404 });
  }

  const { error: insertError } = await admin.from("legal_form_orders").insert({
    form_id: formId,
    buyer_name: buyerName,
    buyer_whatsapp: whatsapp,
  });

  if (insertError) return NextResponse.json({ error: "تعذّر تسجيل الطلب" }, { status: 500 });

  await admin.from("rate_limit_events").insert({ action: "order_legal_form", viewer_hash: viewerHash });

  return NextResponse.json({ success: true });
}
