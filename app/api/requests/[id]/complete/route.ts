import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** الطالب وحده يُحدِّد طلبه كمكتمل — شرط لازم قبل أي تقييم (SPEC.md §8). */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: requestId } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مصرَّح" }, { status: 401 });

  const { data: existing } = await supabase
    .from("delegation_requests")
    .select("status, assigned_to")
    .eq("id", requestId)
    .eq("requester_id", user.id)
    .single();

  if (!existing || existing.status !== "assigned" || !existing.assigned_to) {
    return NextResponse.json({ error: "لا يمكن إتمام طلب غير مُسنَد" }, { status: 409 });
  }

  const { error } = await supabase
    .from("delegation_requests")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("requester_id", user.id);

  if (error) return NextResponse.json({ error: "تعذّر إتمام الطلب" }, { status: 500 });
  return NextResponse.json({ success: true });
}
