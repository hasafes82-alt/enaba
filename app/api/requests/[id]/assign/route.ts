import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** الطالب وحده يُسنِد طلبه لأحد المستجيبين — SPEC.md §8/F3. */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: requestId } = await context.params;
  const body = await request.json().catch(() => null);
  const lawyerId = body?.lawyerId;
  if (!lawyerId) return NextResponse.json({ error: "lawyerId مطلوب" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مصرَّح" }, { status: 401 });

  const { data: existingResponse } = await supabase
    .from("request_responses")
    .select("id")
    .eq("request_id", requestId)
    .eq("lawyer_id", lawyerId)
    .maybeSingle();

  if (!existingResponse) {
    return NextResponse.json({ error: "هذا المحامي لم يستجب لهذا الطلب" }, { status: 409 });
  }

  const { error } = await supabase
    .from("delegation_requests")
    .update({ assigned_to: lawyerId, assigned_at: new Date().toISOString(), status: "assigned" })
    .eq("id", requestId)
    .eq("requester_id", user.id);

  if (error) return NextResponse.json({ error: "تعذّر إسناد الطلب" }, { status: 500 });
  return NextResponse.json({ success: true });
}
