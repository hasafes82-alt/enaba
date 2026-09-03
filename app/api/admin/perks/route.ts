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

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const body = await request.json().catch(() => null);
  const { category, partnerName, title, description, discountCode, whatsapp, phone } = body ?? {};

  if (!category || !partnerName || !title) {
    return NextResponse.json({ error: "الفئة واسم الشريك والعنوان مطلوبون" }, { status: 400 });
  }

  const { data: inserted, error } = await guard.admin
    .from("perks")
    .insert({
      category,
      partner_name: partnerName,
      title,
      description: description || null,
      discount_code: discountCode || null,
      whatsapp: whatsapp || null,
      phone: phone || null,
    })
    .select("id")
    .single();

  if (error || !inserted) return NextResponse.json({ error: "تعذّر إضافة العرض" }, { status: 500 });

  await guard.admin.from("admin_actions").insert({
    admin_id: guard.user.id,
    action: "create_perk",
    entity_type: "perks",
    entity_id: inserted.id,
  });

  return NextResponse.json({ success: true });
}
