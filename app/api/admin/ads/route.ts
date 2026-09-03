import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { AdSlot } from "@/types/database";

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

/** ينشئ الراعي (لو مش موجود بنفس الاسم) والإعلان معًا — تبسيط إداري
 * مقصود بدل صفحتين منفصلتين لسجل رعاة كامل، غير مطلوب في هذا الحجم. */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const body = await request.json().catch(() => null);
  const { sponsorName, slot, title, bodyText, imageUrl, targetUrl, targetWhatsapp, governorateId, endsAt } =
    body ?? {};

  if (!sponsorName || !slot || !title || !endsAt) {
    return NextResponse.json({ error: "اسم الراعي والمساحة والعنوان وتاريخ الانتهاء مطلوبون" }, { status: 400 });
  }

  let { data: sponsor } = await guard.admin.from("sponsors").select("id").eq("name", sponsorName).maybeSingle();
  if (!sponsor) {
    const { data: newSponsor, error: sponsorError } = await guard.admin
      .from("sponsors")
      .insert({ name: sponsorName })
      .select("id")
      .single();
    if (sponsorError || !newSponsor) {
      return NextResponse.json({ error: "تعذّر إنشاء الراعي" }, { status: 500 });
    }
    sponsor = newSponsor;
  }

  const { data: ad, error } = await guard.admin
    .from("ads")
    .insert({
      sponsor_id: sponsor.id,
      slot: slot as AdSlot,
      title,
      body: bodyText || null,
      image_url: imageUrl || null,
      target_url: targetUrl || null,
      target_whatsapp: targetWhatsapp || null,
      governorate_id: governorateId || null,
      ends_at: endsAt,
    })
    .select("id")
    .single();

  if (error || !ad) return NextResponse.json({ error: "تعذّر إضافة الإعلان" }, { status: 500 });

  await guard.admin.from("admin_actions").insert({
    admin_id: guard.user.id,
    action: "create_ad",
    entity_type: "ads",
    entity_id: ad.id,
  });

  return NextResponse.json({ success: true });
}
