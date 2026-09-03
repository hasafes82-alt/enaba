import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * تقييم بعد اكتمال الطلب — RLS + trigger validate_review() (0001_init.sql)
 * يفرضان: الطلب completed، والمُقيِّم أحد طرفيه. هذا المسار مجرد واجهة
 * مريحة برسائل خطأ عربية؛ القيد الحقيقي في قاعدة البيانات.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مصرَّح" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { requestId, revieweeId, rating, comment } = body ?? {};

  if (!requestId || !revieweeId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "بيانات التقييم غير صالحة" }, { status: 400 });
  }

  const { error } = await supabase.from("reviews").insert({
    request_id: requestId,
    reviewer_id: user.id,
    reviewee_id: revieweeId,
    rating,
    comment: comment?.trim() || null,
  });

  if (error) {
    const message = error.code === "23505" ? "لقد قيَّمت هذا الطلب من قبل" : "تعذّر إرسال التقييم";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
