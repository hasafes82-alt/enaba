import { createClient } from "@/lib/supabase/server";
import type { DelegationType, RequestStatus } from "@/types/database";

export interface BoardRequest {
  id: string;
  requester_id: string;
  court_id: number;
  governorate_id: number;
  delegation_type: DelegationType;
  session_date: string;
  details: string;
  fee_note: string | null;
  status: RequestStatus;
  assigned_to: string | null;
  created_at: string;
  court_name: string | null;
  governorate_name: string | null;
}

/**
 * يقرأ الطلبات المفتوحة والمُسنَدة فقط (RLS تمنع أي شيء غير ذلك للزائر غير
 * الطرف). السياسة الخاصة تسمح لصاحب الطلب أو المُسنَد إليه برؤية طلباتهم في
 * أي حالة، لكن هذه الدالة مخصَّصة للوحة العامة فقط.
 */
export async function getOpenBoardRequests(): Promise<BoardRequest[]> {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("delegation_requests")
    .select(
      "id, requester_id, court_id, governorate_id, delegation_type, session_date, details, fee_note, status, assigned_to, created_at",
    )
    .in("status", ["open", "assigned"])
    .order("session_date", { ascending: true });

  if (error) throw error;
  if (!requests || requests.length === 0) return [];

  const courtIds = [...new Set(requests.map((r) => r.court_id))];
  const governorateIds = [...new Set(requests.map((r) => r.governorate_id))];

  const [{ data: courts }, { data: governorates }] = await Promise.all([
    supabase.from("courts").select("id, name_ar").in("id", courtIds),
    supabase.from("governorates").select("id, name_ar").in("id", governorateIds),
  ]);

  const courtNameById = new Map((courts ?? []).map((c) => [c.id, c.name_ar]));
  const governorateNameById = new Map((governorates ?? []).map((g) => [g.id, g.name_ar]));

  return requests.map((r) => ({
    ...r,
    court_name: courtNameById.get(r.court_id) ?? null,
    governorate_name: governorateNameById.get(r.governorate_id) ?? null,
  }));
}
