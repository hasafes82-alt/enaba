/**
 * أنواع TypeScript لقاعدة بيانات Supabase.
 *
 * ⚠️ هذا الملف مكتوب يدويًا ليطابق supabase/migrations/0001_init.sql إلى حين
 * ربط مشروع Supabase فعلي. بعد الربط استبدله بالنوع المولَّد آليًا:
 *
 *   npx supabase gen types typescript --project-id <id> > types/database.ts
 *
 * ولا تُعدَّل يدويًا بعد ذلك — أي تغيير في المخطط يمر عبر هجرة جديدة ثم إعادة توليد.
 */

export type RegistrationDegree = "general" | "primary" | "appeal" | "cassation";
export type VerificationStatus = "pending" | "verified" | "rejected" | "suspended";
export type DelegationType =
  | "session_attendance"
  | "document_copying"
  | "certificate_issuing"
  | "filing_claim"
  | "bailiff_notice"
  | "case_inquiry"
  | "prosecution_hearing";
export type RequestStatus = "open" | "assigned" | "completed" | "cancelled" | "expired";
export type AdSlot = "top_leaderboard" | "in_feed" | "sticky_footer" | "board_inline";
export type AdEventType = "impression" | "click";
export type UserRole = "lawyer" | "admin" | "moderator";

export interface Database {
  public: {
    Tables: {
      governorates: {
        Row: { id: number; name_ar: string; slug: string; sort_order: number };
        Insert: { id?: number; name_ar: string; slug: string; sort_order?: number };
        Update: Partial<Database["public"]["Tables"]["governorates"]["Insert"]>;
        Relationships: [];
      };
      courts: {
        Row: {
          id: number;
          governorate_id: number;
          name_ar: string;
          slug: string;
          court_type: string;
          address: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: number;
          governorate_id: number;
          name_ar: string;
          slug: string;
          court_type: string;
          address?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["courts"]["Insert"]>;
        Relationships: [];
      };
      lawyer_profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          whatsapp: string | null;
          bar_number: string | null;
          registration_degree: RegistrationDegree;
          governorate_id: number;
          bio: string | null;
          avatar_url: string | null;
          carnet_path: string | null;
          verification_status: VerificationStatus;
          verified_at: string | null;
          verified_by: string | null;
          rejection_reason: string | null;
          role: UserRole;
          accepts_notifications: boolean;
          avg_rating: number | null;
          ratings_count: number;
          completed_count: number;
          last_seen_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone: string;
          whatsapp?: string | null;
          bar_number?: string | null;
          registration_degree: RegistrationDegree;
          governorate_id: number;
          bio?: string | null;
          avatar_url?: string | null;
          carnet_path?: string | null;
          verification_status?: VerificationStatus;
          role?: UserRole;
          accepts_notifications?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["lawyer_profiles"]["Insert"]> & {
          verification_status?: VerificationStatus;
          verified_at?: string | null;
          verified_by?: string | null;
          rejection_reason?: string | null;
        };
        Relationships: [];
      };
      lawyer_courts: {
        Row: { lawyer_id: string; court_id: number };
        Insert: { lawyer_id: string; court_id: number };
        Update: Partial<Database["public"]["Tables"]["lawyer_courts"]["Insert"]>;
        Relationships: [];
      };
      delegation_requests: {
        Row: {
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
          assigned_at: string | null;
          completed_at: string | null;
          view_count: number;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          court_id: number;
          governorate_id: number;
          delegation_type: DelegationType;
          session_date: string;
          details: string;
          fee_note?: string | null;
          status?: RequestStatus;
        };
        Update: Partial<Database["public"]["Tables"]["delegation_requests"]["Insert"]> & {
          assigned_to?: string | null;
          assigned_at?: string | null;
          completed_at?: string | null;
          status?: RequestStatus;
        };
        Relationships: [];
      };
      request_responses: {
        Row: {
          id: string;
          request_id: string;
          lawyer_id: string;
          message: string | null;
          created_at: string;
        };
        Insert: { id?: string; request_id: string; lawyer_id: string; message?: string | null };
        Update: Partial<Database["public"]["Tables"]["request_responses"]["Insert"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          request_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [];
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          contact_phone: string | null;
          contact_whatsapp: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_phone?: string | null;
          contact_whatsapp?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sponsors"]["Insert"]>;
        Relationships: [];
      };
      ads: {
        Row: {
          id: string;
          sponsor_id: string;
          slot: AdSlot;
          title: string;
          body: string | null;
          image_url: string | null;
          target_url: string | null;
          target_whatsapp: string | null;
          governorate_id: number | null;
          priority: number;
          starts_at: string;
          ends_at: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sponsor_id: string;
          slot: AdSlot;
          title: string;
          body?: string | null;
          image_url?: string | null;
          target_url?: string | null;
          target_whatsapp?: string | null;
          governorate_id?: number | null;
          priority?: number;
          starts_at?: string;
          ends_at: string;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["ads"]["Insert"]>;
        Relationships: [];
      };
      ad_events: {
        Row: {
          id: number;
          ad_id: string;
          event_type: AdEventType;
          viewer_hash: string | null;
          governorate_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          ad_id: string;
          event_type: AdEventType;
          viewer_hash?: string | null;
          governorate_id?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["ad_events"]["Insert"]>;
        Relationships: [];
      };
      perks: {
        Row: {
          id: string;
          category: string;
          partner_name: string;
          logo_url: string | null;
          title: string;
          description: string | null;
          discount_code: string | null;
          whatsapp: string | null;
          phone: string | null;
          governorate_id: number | null;
          is_active: boolean;
          ends_at: string | null;
        };
        Insert: {
          id?: string;
          category: string;
          partner_name: string;
          logo_url?: string | null;
          title: string;
          description?: string | null;
          discount_code?: string | null;
          whatsapp?: string | null;
          phone?: string | null;
          governorate_id?: number | null;
          is_active?: boolean;
          ends_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["perks"]["Insert"]>;
        Relationships: [];
      };
      perk_redemptions: {
        Row: { id: number; perk_id: string; lawyer_id: string | null; created_at: string };
        Insert: { id?: number; perk_id: string; lawyer_id?: string | null };
        Update: Partial<Database["public"]["Tables"]["perk_redemptions"]["Insert"]>;
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: number;
          lawyer_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: { id?: number; lawyer_id: string; endpoint: string; p256dh: string; auth: string };
        Update: Partial<Database["public"]["Tables"]["push_subscriptions"]["Insert"]>;
        Relationships: [];
      };
      notification_subscriptions: {
        Row: {
          id: number;
          lawyer_id: string;
          governorate_id: number | null;
          court_id: number | null;
          delegation_types: DelegationType[] | null;
          channel: string;
          is_active: boolean;
        };
        Insert: {
          id?: number;
          lawyer_id: string;
          governorate_id?: number | null;
          court_id?: number | null;
          delegation_types?: DelegationType[] | null;
          channel?: string;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["notification_subscriptions"]["Insert"]>;
        Relationships: [];
      };
      notifications_outbox: {
        Row: {
          id: number;
          lawyer_id: string;
          request_id: string | null;
          channel: string;
          payload: Record<string, unknown>;
          status: string;
          attempts: number;
          sent_at: string | null;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          lawyer_id: string;
          request_id?: string | null;
          channel: string;
          payload: Record<string, unknown>;
          status?: string;
          attempts?: number;
          sent_at?: string | null;
          error?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["notifications_outbox"]["Insert"]>;
        Relationships: [];
      };
      contact_reveals: {
        Row: {
          id: number;
          viewer_id: string | null;
          viewer_hash: string;
          target_lawyer_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          viewer_id?: string | null;
          viewer_hash: string;
          target_lawyer_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contact_reveals"]["Insert"]>;
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string | null;
          entity_type: string;
          entity_id: string;
          reason: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id?: string | null;
          entity_type: string;
          entity_id: string;
          reason: string;
          status?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
        Relationships: [];
      };
      admin_actions: {
        Row: {
          id: number;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          meta: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          meta?: Record<string, unknown> | null;
        };
        Update: Partial<Database["public"]["Tables"]["admin_actions"]["Insert"]>;
        Relationships: [];
      };
      rate_limit_events: {
        Row: { id: number; action: string; viewer_hash: string; created_at: string };
        Insert: { id?: number; action: string; viewer_hash: string };
        Update: Partial<Database["public"]["Tables"]["rate_limit_events"]["Insert"]>;
        Relationships: [];
      };
      legal_forms: {
        Row: {
          id: string;
          category: string;
          title: string;
          description: string | null;
          price_egp: number;
          file_path: string;
          file_type: "docx" | "pdf";
          is_published: boolean;
          download_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          title: string;
          description?: string | null;
          price_egp: number;
          file_path: string;
          file_type?: "docx" | "pdf";
          is_published?: boolean;
          download_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["legal_forms"]["Insert"]>;
        Relationships: [];
      };
      legal_form_orders: {
        Row: {
          id: number;
          form_id: string;
          buyer_name: string | null;
          buyer_whatsapp: string;
          status: "pending" | "paid" | "delivered" | "cancelled";
          admin_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          form_id: string;
          buyer_name?: string | null;
          buyer_whatsapp: string;
          status?: "pending" | "paid" | "delivered" | "cancelled";
          admin_note?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["legal_form_orders"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      public_lawyers: {
        Row: {
          id: string;
          full_name: string;
          registration_degree: RegistrationDegree;
          governorate_id: number;
          bio: string | null;
          avatar_url: string | null;
          avg_rating: number | null;
          ratings_count: number;
          completed_count: number;
          verification_status: VerificationStatus;
          last_seen_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      registration_degree: RegistrationDegree;
      verification_status: VerificationStatus;
      delegation_type: DelegationType;
      request_status: RequestStatus;
      ad_slot: AdSlot;
      ad_event_type: AdEventType;
      user_role: UserRole;
    };
  };
}
