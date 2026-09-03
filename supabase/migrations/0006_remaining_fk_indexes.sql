-- إنابة (Enaba) — باقي فهارس المفاتيح الأجنبية (INFO) من Supabase Advisors،
-- استكمالًا لـ 0005 على مفاتيح أقل حرارة استعلاميًا لكن رخيصة الإضافة.

create index if not exists idx_admin_actions_admin_id on admin_actions (admin_id);
create index if not exists idx_ads_governorate_id on ads (governorate_id);
create index if not exists idx_contact_reveals_viewer_id on contact_reveals (viewer_id);
create index if not exists idx_delegation_requests_requester_id on delegation_requests (requester_id);
create index if not exists idx_lawyer_profiles_verified_by on lawyer_profiles (verified_by);
create index if not exists idx_notification_subscriptions_court_id on notification_subscriptions (court_id);
create index if not exists idx_notifications_outbox_request_id on notifications_outbox (request_id);
create index if not exists idx_perk_redemptions_perk_id on perk_redemptions (perk_id);
create index if not exists idx_perks_governorate_id on perks (governorate_id);
