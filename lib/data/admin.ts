import { createClient } from "@/lib/supabase/server";
import type {
  AdSlot,
  DelegationType,
  RegistrationDegree,
  RequestStatus,
  VerificationStatus,
} from "@/types/database";

export interface PendingLawyer {
  id: string;
  full_name: string;
  phone: string;
  bar_number: string | null;
  registration_degree: RegistrationDegree;
  governorate_id: number;
  bio: string | null;
  carnet_path: string | null;
  verification_status: VerificationStatus;
  created_at: string;
}

/** يعتمد على RLS ("admin full access lawyer_profiles") — يفترض أن المستدعي مشرف بالفعل. */
export async function getPendingLawyers(): Promise<PendingLawyer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lawyer_profiles")
    .select(
      "id, full_name, phone, bar_number, registration_degree, governorate_id, bio, carnet_path, verification_status, created_at",
    )
    .eq("verification_status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export interface AdminRequestRow {
  id: string;
  requester_id: string;
  requester_name: string | null;
  court_name: string | null;
  governorate_name: string | null;
  delegation_type: DelegationType;
  session_date: string;
  status: RequestStatus;
  created_at: string;
}

/** كل الطلبات بكل الحالات — RLS "admin manages requests" (all). */
export async function getAllRequestsForAdmin(): Promise<AdminRequestRow[]> {
  const supabase = await createClient();
  const { data: requests, error } = await supabase
    .from("delegation_requests")
    .select("id, requester_id, court_id, governorate_id, delegation_type, session_date, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  if (!requests || requests.length === 0) return [];

  const requesterIds = [...new Set(requests.map((r) => r.requester_id))];
  const courtIds = [...new Set(requests.map((r) => r.court_id))];
  const governorateIds = [...new Set(requests.map((r) => r.governorate_id))];

  const [{ data: requesters }, { data: courts }, { data: governorates }] = await Promise.all([
    supabase.from("lawyer_profiles").select("id, full_name").in("id", requesterIds),
    supabase.from("courts").select("id, name_ar").in("id", courtIds),
    supabase.from("governorates").select("id, name_ar").in("id", governorateIds),
  ]);

  const nameByRequester = new Map((requesters ?? []).map((r) => [r.id, r.full_name]));
  const nameByCourt = new Map((courts ?? []).map((c) => [c.id, c.name_ar]));
  const nameByGovernorate = new Map((governorates ?? []).map((g) => [g.id, g.name_ar]));

  return requests.map((r) => ({
    ...r,
    requester_name: nameByRequester.get(r.requester_id) ?? null,
    court_name: nameByCourt.get(r.court_id) ?? null,
    governorate_name: nameByGovernorate.get(r.governorate_id) ?? null,
  }));
}

export interface AdminReport {
  id: string;
  reporter_id: string | null;
  entity_type: string;
  entity_id: string;
  reason: string;
  status: string;
  created_at: string;
}

/** RLS: "admin reads reports" (select) و"admin manages reports" (باقي الأوامر). */
export async function getOpenReports(): Promise<AdminReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("id, reporter_id, entity_type, entity_id, reason, status, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export interface AdminPerk {
  id: string;
  category: string;
  partner_name: string;
  title: string;
  description: string | null;
  discount_code: string | null;
  whatsapp: string | null;
  phone: string | null;
  is_active: boolean;
}

/** كل العروض (نشطة وغير نشطة) — RLS "read active or admin" تسمح للمشرف بالكل. */
export async function getAllPerksForAdmin(): Promise<AdminPerk[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perks")
    .select("id, category, partner_name, title, description, discount_code, whatsapp, phone, is_active")
    .order("category");

  if (error) throw error;
  return data ?? [];
}

export interface AdminAd {
  id: string;
  sponsor_name: string;
  slot: AdSlot;
  title: string;
  governorate_id: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  impressions: number;
  clicks: number;
}

const SLOT_ORDER: AdSlot[] = ["top_leaderboard", "in_feed", "board_inline", "sticky_footer"];

/** كل الإعلانات مع إحصاءات الأداء — SPEC.md §10 ("تقرير شهري لكل راعٍ"، مبسَّط هنا كإجمالي حي). */
export async function getAllAdsForAdmin(): Promise<AdminAd[]> {
  const supabase = await createClient();
  const { data: ads, error } = await supabase
    .from("ads")
    .select("id, sponsor_id, slot, title, governorate_id, starts_at, ends_at, is_active")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!ads || ads.length === 0) return [];

  const sponsorIds = [...new Set(ads.map((a) => a.sponsor_id))];
  const adIds = ads.map((a) => a.id);

  const [{ data: sponsors }, { data: events }] = await Promise.all([
    supabase.from("sponsors").select("id, name").in("id", sponsorIds),
    supabase.from("ad_events").select("ad_id, event_type").in("ad_id", adIds),
  ]);

  const sponsorNameById = new Map((sponsors ?? []).map((s) => [s.id, s.name]));
  const impressionsByAd = new Map<string, number>();
  const clicksByAd = new Map<string, number>();
  for (const e of events ?? []) {
    const map = e.event_type === "impression" ? impressionsByAd : clicksByAd;
    map.set(e.ad_id, (map.get(e.ad_id) ?? 0) + 1);
  }

  return ads
    .map((a) => ({
      id: a.id,
      sponsor_name: sponsorNameById.get(a.sponsor_id) ?? "—",
      slot: a.slot,
      title: a.title,
      governorate_id: a.governorate_id,
      starts_at: a.starts_at,
      ends_at: a.ends_at,
      is_active: a.is_active,
      impressions: impressionsByAd.get(a.id) ?? 0,
      clicks: clicksByAd.get(a.id) ?? 0,
    }))
    .sort((a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot));
}
