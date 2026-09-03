-- إنابة (Enaba) — فهارس لمفاتيح أجنبية عالية الاستخدام في سياسات RLS واستعلامات
-- الواجهة، اكتُشفت عبر Supabase Advisors (performance، unindexed_foreign_keys).

create index if not exists idx_delegation_requests_assigned_to on delegation_requests (assigned_to);
create index if not exists idx_request_responses_lawyer_id on request_responses (lawyer_id);
create index if not exists idx_reviews_reviewer_id on reviews (reviewer_id);
create index if not exists idx_reviews_reviewee_id on reviews (reviewee_id);
create index if not exists idx_notifications_outbox_lawyer_id on notifications_outbox (lawyer_id);
create index if not exists idx_notification_subscriptions_lawyer_id on notification_subscriptions (lawyer_id);
create index if not exists idx_perk_redemptions_lawyer_id on perk_redemptions (lawyer_id);
create index if not exists idx_reports_reporter_id on reports (reporter_id);
create index if not exists idx_ads_sponsor_id on ads (sponsor_id);
create index if not exists idx_contact_reveals_target_lawyer_id on contact_reveals (target_lawyer_id);
