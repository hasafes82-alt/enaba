import { randomUUID } from "node:crypto";
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

const MIME_TO_TYPE: Record<string, "docx" | "pdf"> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

/** إضافة نموذج جديد — يرفع الملف إلى bucket خاص 'legal-forms' ثم يُنشئ صف الكتالوج (SPEC.md §8/F7). */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const form = await request.formData().catch(() => null);
  const category = form?.get("category");
  const title = form?.get("title");
  const description = form?.get("description");
  const priceRaw = form?.get("priceEgp");
  const file = form?.get("file");

  if (typeof category !== "string" || typeof title !== "string" || !category || !title) {
    return NextResponse.json({ error: "الفئة والعنوان مطلوبان" }, { status: 400 });
  }

  const priceEgp = Number(priceRaw);
  if (!Number.isFinite(priceEgp) || priceEgp < 0) {
    return NextResponse.json({ error: "السعر غير صحيح" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ملف النموذج مطلوب (Word أو PDF)" }, { status: 400 });
  }

  const fileType = MIME_TO_TYPE[file.type];
  if (!fileType) {
    return NextResponse.json({ error: "نوع الملف يجب أن يكون Word أو PDF" }, { status: 400 });
  }

  const filePath = `${randomUUID()}.${fileType}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await guard.admin.storage
    .from("legal-forms")
    .upload(filePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: "تعذّر رفع الملف" }, { status: 500 });
  }

  const { data: inserted, error: insertError } = await guard.admin
    .from("legal_forms")
    .insert({
      category,
      title,
      description: typeof description === "string" && description ? description : null,
      price_egp: priceEgp,
      file_path: filePath,
      file_type: fileType,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    await guard.admin.storage.from("legal-forms").remove([filePath]);
    return NextResponse.json({ error: "تعذّر إضافة النموذج" }, { status: 500 });
  }

  await guard.admin.from("admin_actions").insert({
    admin_id: guard.user.id,
    action: "create_legal_form",
    entity_type: "legal_forms",
    entity_id: inserted.id,
  });

  return NextResponse.json({ success: true });
}
