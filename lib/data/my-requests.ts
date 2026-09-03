import { createClient } from "@/lib/supabase/server";
import type { DelegationType, RequestStatus } from "@/types/database";

export interface RequestResponseWithLawyer {
  id: string;
  lawyer_id: string;
  lawyer_name: string;
  message: string | null;
  created_at: string;
}

export interface MyRequest {
  id: string;
  court_name: string | null;
  delegation_type: DelegationType;
  session_date: string;
  status: RequestStatus;
  assigned_to: string | null;
  assigned_to_name: string | null;
  already_reviewed: boolean;
  responses: RequestResponseWithLawyer[];
}

/** طلباتي كطالب — RLS "read open or own or admin" تسمح لي برؤية طلباتي بكل حالة. */
export async function getMyRequests(userId: string): Promise<MyRequest[]> {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("delegation_requests")
    .select("id, court_id, delegation_type, session_date, status, assigned_to")
    .eq("requester_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!requests || requests.length === 0) return [];

  const requestIds = requests.map((r) => r.id);
  const courtIds = [...new Set(requests.map((r) => r.court_id))];
  const assignedIds = [...new Set(requests.map((r) => r.assigned_to).filter((id): id is string => !!id))];

  const [{ data: courts }, { data: assignedLawyers }, { data: responses }, { data: myReviews }] =
    await Promise.all([
      supabase.from("courts").select("id, name_ar").in("id", courtIds),
      assignedIds.length > 0
        ? supabase.from("lawyer_profiles").select("id, full_name").in("id", assignedIds)
        : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
      supabase.from("request_responses").select("id, request_id, lawyer_id, message, created_at").in("request_id", requestIds),
      supabase.from("reviews").select("request_id").eq("reviewer_id", userId).in("request_id", requestIds),
    ]);

  const courtNameById = new Map((courts ?? []).map((c) => [c.id, c.name_ar]));
  const lawyerNameById = new Map((assignedLawyers ?? []).map((l) => [l.id, l.full_name]));
  const reviewedRequestIds = new Set((myReviews ?? []).map((r) => r.request_id));

  const responderIds = [...new Set((responses ?? []).map((r) => r.lawyer_id))];
  const { data: responders } =
    responderIds.length > 0
      ? await supabase.from("lawyer_profiles").select("id, full_name").in("id", responderIds)
      : { data: [] as { id: string; full_name: string }[] };
  const responderNameById = new Map((responders ?? []).map((l) => [l.id, l.full_name]));

  const responsesByRequest = new Map<string, RequestResponseWithLawyer[]>();
  for (const r of responses ?? []) {
    const list = responsesByRequest.get(r.request_id) ?? [];
    list.push({
      id: r.id,
      lawyer_id: r.lawyer_id,
      lawyer_name: responderNameById.get(r.lawyer_id) ?? "—",
      message: r.message,
      created_at: r.created_at,
    });
    responsesByRequest.set(r.request_id, list);
  }

  return requests.map((r) => ({
    id: r.id,
    court_name: courtNameById.get(r.court_id) ?? null,
    delegation_type: r.delegation_type,
    session_date: r.session_date,
    status: r.status,
    assigned_to: r.assigned_to,
    assigned_to_name: r.assigned_to ? (lawyerNameById.get(r.assigned_to) ?? null) : null,
    already_reviewed: reviewedRequestIds.has(r.id),
    responses: responsesByRequest.get(r.id) ?? [],
  }));
}

export interface MyAssignment {
  id: string;
  court_name: string | null;
  delegation_type: DelegationType;
  session_date: string;
  status: RequestStatus;
  requester_id: string;
  requester_name: string | null;
  already_reviewed: boolean;
}

/** الطلبات المُسنَدة إليّ كمحامٍ منفِّذ. */
export async function getMyAssignments(userId: string): Promise<MyAssignment[]> {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("delegation_requests")
    .select("id, court_id, delegation_type, session_date, status, requester_id")
    .eq("assigned_to", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!requests || requests.length === 0) return [];

  const requestIds = requests.map((r) => r.id);
  const courtIds = [...new Set(requests.map((r) => r.court_id))];
  const requesterIds = [...new Set(requests.map((r) => r.requester_id))];

  const [{ data: courts }, { data: requesters }, { data: myReviews }] = await Promise.all([
    supabase.from("courts").select("id, name_ar").in("id", courtIds),
    supabase.from("lawyer_profiles").select("id, full_name").in("id", requesterIds),
    supabase.from("reviews").select("request_id").eq("reviewer_id", userId).in("request_id", requestIds),
  ]);

  const courtNameById = new Map((courts ?? []).map((c) => [c.id, c.name_ar]));
  const requesterNameById = new Map((requesters ?? []).map((r) => [r.id, r.full_name]));
  const reviewedRequestIds = new Set((myReviews ?? []).map((r) => r.request_id));

  return requests.map((r) => ({
    id: r.id,
    court_name: courtNameById.get(r.court_id) ?? null,
    delegation_type: r.delegation_type,
    session_date: r.session_date,
    status: r.status,
    requester_id: r.requester_id,
    requester_name: requesterNameById.get(r.requester_id) ?? null,
    already_reviewed: reviewedRequestIds.has(r.id),
  }));
}
